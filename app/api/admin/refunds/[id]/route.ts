import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/payments/stripe";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

const schema = z.object({
  status: z
    .enum(["Approved", "Declined"])
    .optional(),

  amount: z.coerce
    .number()
    .positive()
    .optional(),

  adminNote: z
    .string()
    .max(1000)
    .optional(),

  declineReason: z
    .string()
    .max(500)
    .optional(),
});

export async function GET(
  request: Request,
  { params }: Context
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      {
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const { id } = await params;

  const refund =
    await prisma.refund.findUnique({
      where: {
        id,
      },

      include: {
        order: {
          include: {
            customer: true,
            payment: true,
            items: true,
          },
        },
      },
    });

  if (!refund) {
    return NextResponse.json(
      {
        message: "Refund not found.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(refund);
}

export async function PATCH(
  request: Request,
  { params }: Context
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      {
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const body = await request
    .json()
    .catch(() => null);

  const parsed =
    schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          "Please provide valid refund details.",
      },
      {
        status: 400,
      }
    );
  }

  const { id } = await params;

  const existing =
    await prisma.refund.findUnique({
      where: {
        id,
      },

      include: {
        order: {
          include: {
            payment: true,
          },
        },
      },
    });

  if (!existing) {
    return NextResponse.json(
      {
        message: "Refund not found.",
      },
      {
        status: 404,
      }
    );
  }

  const {
    status,
    amount: requestedAmount,
    adminNote,
    declineReason,
  } = parsed.data;

  if (!status) {
    return NextResponse.json(
      {
        message:
          "Please select Approve or Decline.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    existing.status !== "Requested"
  ) {
    return NextResponse.json(
      {
        message:
          "This refund request has already been processed.",
      },
      {
        status: 409,
      }
    );
  }

  if (status === "Declined") {
    const refund =
      await prisma.refund.update({
        where: {
          id: existing.id,
        },

        data: {
          status: "Declined",
          adminNote,
          declineReason:
            declineReason?.trim() ||
            "Refund request declined by admin.",
          declinedAt: new Date(),
        },
      });

    return NextResponse.json(
      refund
    );
  }

  const payment =
    existing.order.payment;

  if (!payment) {
    return NextResponse.json(
      {
        message:
          "No payment record was found for this order.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    payment.provider !== "Stripe"
  ) {
    return NextResponse.json(
      {
        message:
          "This payment cannot be refunded automatically because it was not processed by Stripe.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    !payment.providerPaymentId
  ) {
    return NextResponse.json(
      {
        message:
          "The Stripe PaymentIntent reference is missing from this payment.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    payment.status !== "Paid"
  ) {
    return NextResponse.json(
      {
        message:
          "Only a paid Stripe payment can be refunded.",
      },
      {
        status: 400,
      }
    );
  }

  const orderTotal = Number(
    existing.order.total
  );

  const refundAmount =
    requestedAmount ??
    Number(existing.amount);

  if (
    !Number.isFinite(
      refundAmount
    ) ||
    refundAmount <= 0
  ) {
    return NextResponse.json(
      {
        message:
          "Please provide a valid refund amount.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    refundAmount >
    orderTotal
  ) {
    return NextResponse.json(
      {
        message:
          "Refund amount cannot exceed the order total.",
      },
      {
        status: 400,
      }
    );
  }

  const refundAmountMinor =
    Math.round(
      refundAmount * 100
    );

  try {
    const stripe =
      getStripe();

    const stripeRefund =
      await stripe.refunds.create(
        {
          payment_intent:
            payment.providerPaymentId,

          amount:
            refundAmountMinor,

          metadata: {
            orderId:
              existing.orderId,

            refundRequestId:
              existing.id,
          },
        },
        {
          idempotencyKey:
            `royalchins-refund-${existing.id}`,
        }
      );

    const stripeSucceeded =
      stripeRefund.status ===
      "succeeded";

    const stripeFailed =
      stripeRefund.status ===
        "failed" ||
      stripeRefund.status ===
        "canceled";

    const refundStatus =
      stripeSucceeded
        ? "Completed"
        : stripeFailed
          ? "Failed"
          : "Pending";

    const now =
      new Date();

    const updatedRefund =
      await prisma.refund.update({
        where: {
          id: existing.id,
        },

        data: {
          amount:
            refundAmount,

          status:
            refundStatus,

          approvedAt:
            now,

          completedAt:
            stripeSucceeded
              ? now
              : null,

          gatewayRefundId:
            stripeRefund.id,

          adminNote,

          declineReason:
            stripeFailed
              ? stripeRefund
                  .failure_reason ??
                "Stripe refund failed."
              : null,
        },
      });

    if (stripeSucceeded) {
      const fullRefund =
        refundAmountMinor >=
        Math.round(
          orderTotal * 100
        );

      if (fullRefund) {
        await prisma.$transaction([
          prisma.order.update({
            where: {
              id:
                existing.orderId,
            },

            data: {
              paymentStatus:
                "Refunded",
            },
          }),

          prisma.payment.update({
            where: {
              orderId:
                existing.orderId,
            },

            data: {
              status:
                "Refunded",

              refundedAt:
                now,
            },
          }),
        ]);
      }
    }

    return NextResponse.json(
      updatedRefund
    );
  } catch (error) {
    console.error(
      "Stripe refund error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Stripe could not create this refund.";

    const failedRefund =
      await prisma.refund.update({
        where: {
          id: existing.id,
        },

        data: {
          status: "Failed",

          adminNote,

          declineReason:
            message,
        },
      });

    return NextResponse.json(
      {
        message:
          "Stripe could not create this refund. Check the Stripe payment and refund details.",

        refund:
          failedRefund,
      },
      {
        status: 400,
      }
    );
  }
}