import { NextResponse } from "next/server";
import {
  Prisma,
} from "@prisma/client";
import Stripe from "stripe";

import {
  getAdminNotificationEmail,
} from "@/lib/auth/admin-auth-server";
import {
  sendOrderConfirmationEmails,
} from "@/lib/email/order-confirmation";
import {
  getStripe,
} from "@/lib/payments/stripe";
import {
  prisma,
} from "@/lib/prisma";

export async function POST(
  request: Request
) {
  const webhookSecret =
    process.env
      .STRIPE_WEBHOOK_SECRET;

  const signature =
    request.headers.get(
      "stripe-signature"
    );

  if (
    !webhookSecret ||
    !signature
  ) {
    return NextResponse.json(
      {
        message:
          "Stripe webhook is not configured.",
      },
      {
        status: 400,
      }
    );
  }

  let event: Stripe.Event;

  try {
    const body =
      await request.text();

    event =
      getStripe().webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Invalid Stripe webhook.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(
          event.data
            .object as Stripe.PaymentIntent
        );
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(
          event.data
            .object as Stripe.PaymentIntent
        );
        break;

      case "refund.created":
      case "refund.updated":
        await handleRefundUpdated(
          event.data
            .object as Stripe.Refund
        );
        break;

      case "refund.failed":
        await handleRefundFailed(
          event.data
            .object as Stripe.Refund
        );
        break;

      default:
        break;
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      `Stripe webhook processing failed for ${event.type}:`,
      error
    );

    return NextResponse.json(
      {
        message:
          "Webhook processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}

async function handlePaymentFailed(
  intent: Stripe.PaymentIntent
) {
  const {
    orderId,
    customerId,
  } = intent.metadata;

  if (
    !orderId ||
    !customerId
  ) {
    return;
  }

  await prisma.$transaction([
    prisma.payment.updateMany({
      where: {
        orderId,
      },

      data: {
        status: "Failed",

        providerPaymentId:
          intent.id,

        failureCode:
          intent
            .last_payment_error
            ?.code ?? null,

        failureMessage:
          intent
            .last_payment_error
            ?.message ??
          "Stripe declined this payment.",

        failedAt:
          new Date(),
      },
    }),

    prisma.order.updateMany({
      where: {
        id: orderId,
        customerId,
      },

      data: {
        paymentStatus:
          "Failed",
      },
    }),
  ]);
}

async function handlePaymentSucceeded(
  intent: Stripe.PaymentIntent
) {
  const {
    orderId,
    orderNumber,
    customerId,
  } = intent.metadata;

  if (
    !orderId ||
    !orderNumber ||
    !customerId
  ) {
    return;
  }

  const completed =
    await prisma.$transaction(
      async (
        tx: Prisma.TransactionClient
      ) => {
        const order =
          await tx.order.findFirst({
            where: {
              id: orderId,
              orderNumber,
              customerId,
            },

            include: {
              items: {
                include: {
                  product: true,
                },
              },

              shippingAddress:
                true,
            },
          });

        if (!order) {
          return null;
        }

        if (
          order.paymentStatus ===
          "Paid"
        ) {
          return null;
        }

        for (
          const item of
          order.items
        ) {
          if (!item.product) {
            continue;
          }

          if (item.product.type === "Animal") {
            const updated = await tx.product.updateMany({
              where: {
                id: item.productId ?? "",
                isSold: false,
              },
              data: { isSold: true },
            });

            if (updated.count !== 1) {
              throw new Error("PET_SOLD");
            }

            continue;
          }

          const updated =
            await tx.product.updateMany(
              {
                where: {
                  id:
                    item.productId ??
                    "",

                  quantity: {
                    gte:
                      item.quantity,
                  },
                },

                data: {
                  quantity: {
                    decrement:
                      item.quantity,
                  },
                },
              }
            );

          if (
            updated.count !== 1
          ) {
            throw new Error(
              "OUT_OF_STOCK"
            );
          }
        }

        const paidOrder =
          await tx.order.update({
            where: {
              id: order.id,
            },

            data: {
              paymentStatus:
                "Paid",

              orderStatus:
                "Confirmed",
            },

            include: {
              items: true,

              shippingAddress:
                true,
            },
          });

        await tx.payment.updateMany(
          {
            where: {
              orderId:
                order.id,
            },

            data: {
              provider:
                "Stripe",

              method: "Card",

              status: "Paid",

              providerPaymentId:
                intent.id,

              providerChargeId:
                typeof intent.latest_charge ===
                "string"
                  ? intent.latest_charge
                  : intent
                      .latest_charge
                      ?.id ??
                    null,

              paidAt:
                new Date(),

              failureCode:
                null,

              failureMessage:
                null,

              failedAt:
                null,
            },
          }
        );

        return paidOrder;
      }
    );

  if (completed) {
    await sendOrderConfirmationEmails(
      completed,
      await getAdminNotificationEmail()
    );
  }
}

async function handleRefundUpdated(
  stripeRefund: Stripe.Refund
) {
  const refundRequestId =
    stripeRefund.metadata
      ?.refundRequestId;

  const orderId =
    stripeRefund.metadata
      ?.orderId;

  if (
    !refundRequestId ||
    !orderId
  ) {
    console.warn(
      "Stripe refund webhook is missing Royal Chins metadata:",
      stripeRefund.id
    );

    return;
  }

  const existing =
    await prisma.refund.findFirst(
      {
        where: {
          id:
            refundRequestId,

          orderId,
        },

        include: {
          order: {
            include: {
              payment: true,
            },
          },
        },
      }
    );

  if (!existing) {
    console.warn(
      "Royal Chins refund request was not found:",
      refundRequestId
    );

    return;
  }

  if (
    existing.gatewayRefundId &&
    existing.gatewayRefundId !==
      stripeRefund.id
  ) {
    console.warn(
      "Stripe refund ID does not match the Royal Chins refund record:",
      stripeRefund.id
    );

    return;
  }

  const status =
    stripeRefund.status;

  if (
    status === "succeeded"
  ) {
    await completeRefund(
      existing.id,
      existing.orderId,
      stripeRefund
    );

    return;
  }

  if (
    status === "failed" ||
    status === "canceled"
  ) {
    await failRefund(
      existing.id,
      stripeRefund
    );

    return;
  }

  await prisma.refund.update({
    where: {
      id: existing.id,
    },

    data: {
      status: "Approved",

      gatewayRefundId:
        stripeRefund.id,
    },
  });
}

async function handleRefundFailed(
  stripeRefund: Stripe.Refund
) {
  const refundRequestId =
    stripeRefund.metadata
      ?.refundRequestId;

  const orderId =
    stripeRefund.metadata
      ?.orderId;

  if (
    !refundRequestId ||
    !orderId
  ) {
    console.warn(
      "Failed Stripe refund is missing Royal Chins metadata:",
      stripeRefund.id
    );

    return;
  }

  const existing =
    await prisma.refund.findFirst(
      {
        where: {
          id:
            refundRequestId,

          orderId,
        },
      }
    );

  if (!existing) {
    console.warn(
      "Royal Chins refund request was not found:",
      refundRequestId
    );

    return;
  }

  if (
    existing.gatewayRefundId &&
    existing.gatewayRefundId !==
      stripeRefund.id
  ) {
    return;
  }

  await failRefund(
    existing.id,
    stripeRefund
  );
}

async function completeRefund(
  refundId: string,
  orderId: string,
  stripeRefund: Stripe.Refund
) {
  const existing =
    await prisma.refund.findUnique(
      {
        where: {
          id: refundId,
        },

        include: {
          order: {
            include: {
              payment: true,
            },
          },
        },
      }
    );

  if (!existing) {
    return;
  }

  const refundAmount =
    Number(
      existing.amount
    );

  const orderTotal =
    Number(
      existing.order.total
    );

  const isFullRefund =
    Math.round(
      refundAmount * 100
    ) >=
    Math.round(
      orderTotal * 100
    );

  const now =
    new Date();

  await prisma.$transaction(
    async (
      tx: Prisma.TransactionClient
    ) => {
      await tx.refund.update({
        where: {
          id: refundId,
        },

        data: {
          status:
            "Completed",

          gatewayRefundId:
            stripeRefund.id,

          completedAt:
            existing.completedAt ??
            now,

          declineReason:
            null,
        },
      });

      if (!isFullRefund) {
        return;
      }

      await tx.order.update({
        where: {
          id: orderId,
        },

        data: {
          paymentStatus:
            "Refunded",
        },
      });

      await tx.payment.updateMany(
        {
          where: {
            orderId,
          },

          data: {
            status:
              "Refunded",

            refundedAt:
              now,
          },
        }
      );
    }
  );
}

async function failRefund(
  refundId: string,
  stripeRefund: Stripe.Refund
) {
  await prisma.refund.update({
    where: {
      id: refundId,
    },

    data: {
      status: "Failed",

      gatewayRefundId:
        stripeRefund.id,

      declineReason:
        stripeRefund
          .failure_reason ??
        "Stripe refund failed.",

      completedAt: null,
    },
  });
}
