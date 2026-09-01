import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/payments/stripe";

const schema = z.object({
  addressId: z.string().min(1),

  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

const deliveryFees: Record<string, number> = {
  Dubai: 35,
  "Abu Dhabi": 50,
  Sharjah: 40,
  Ajman: 45,
  "Umm Al Quwain": 55,
  "Ras Al Khaimah": 60,
  Fujairah: 60,
};

export async function POST(
  request: Request
) {
  const session =
    await getCustomerSession();

  if (!session?.sub) {
    return NextResponse.json(
      {
        message:
          "Please sign in to place your order.",
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
          "Your order is incomplete. Please review your items and delivery address.",
      },
      {
        status: 400,
      }
    );
  }

  const input = parsed.data;

  try {
    const result =
      await prisma.$transaction(
        async (
          tx: Prisma.TransactionClient
        ) => {
          const customer =
            await tx.customer.findUnique({
              where: {
                id: session.sub,
              },
            });

          const address =
            await tx.customerAddress.findFirst({
              where: {
                id: input.addressId,
                customerId:
                  session.sub,
              },
            });

          if (
            !customer ||
            !address
          ) {
            throw new Error(
              "ADDRESS_NOT_FOUND"
            );
          }

          const ids =
            input.items.map(
              (item) =>
                item.productId
            );

          if (
            new Set(ids).size !==
            ids.length
          ) {
            throw new Error(
              "DUPLICATE_PRODUCT"
            );
          }

          const products =
            await tx.product.findMany({
              where: {
                id: {
                  in: ids,
                },
                status: "Active",
              },
            });

          if (
            products.length !==
            ids.length
          ) {
            throw new Error(
              "PRODUCT_UNAVAILABLE"
            );
          }

          const lines =
            input.items.map(
              (item) => {
                const product =
                  products.find(
                    (
                      candidate
                    ) =>
                      candidate.id ===
                      item.productId
                  );

                if (!product) {
                  throw new Error(
                    "PRODUCT_UNAVAILABLE"
                  );
                }

                const quantity =
                  product.type ===
                  "Animal"
                    ? 1
                    : item.quantity;

                if (
                  product.type ===
                    "Animal" &&
                  item.quantity !== 1
                ) {
                  throw new Error(
                    "PET_LIMIT"
                  );
                }

                if (
                  product.type !== "Animal" &&
                  product.quantity < quantity
                ) {
                  throw new Error(
                    `OUT_OF_STOCK:${product.name}`
                  );
                }

                const unitPrice =
                  Number(
                    product.salePrice ??
                      product.regularPrice
                  );

                return {
                  product,
                  quantity,
                  unitPrice,
                };
              }
            );

          const subtotal =
            lines.reduce(
              (
                total,
                line
              ) =>
                total +
                line.unitPrice *
                  line.quantity,
              0
            );

          const deliveryFee =
            deliveryFees[
              address.emirate
            ] ?? 60;

          const total =
            subtotal +
            deliveryFee;

          const orderNumber =
            `RC-${Date.now()
              .toString()
              .slice(
                -8
              )}-${Math.floor(
              Math.random() *
                900 +
                100
            )}`;

          const order =
            await tx.order.create({
              data: {
                orderNumber,

                customerId:
                  customer.id,

                customerName:
                  customer.name,

                email:
                  customer.email,

                phone:
                  address.phone ||
                  customer.phone,

                shippingAddressId:
                  address.id,

                subtotal,

                deliveryFee,

                total,

                paymentMethod:
                  "Card",

                paymentStatus:
                  "Pending",

                orderStatus:
                  "Pending",

                items: {
                  create:
                    lines.map(
                      (
                        line
                      ) => ({
                        productId:
                          line
                            .product
                            .id,

                        productName:
                          line
                            .product
                            .name,

                        quantity:
                          line.quantity,

                        unitPrice:
                          line.unitPrice,
                      })
                    ),
                },
              },

              include: {
                items: true,
              },
            });

          return {
            order,
            lines,
            total,
          };
        }
      );

    const amountInFils =
      Math.round(
        result.total * 100
      );

    const paymentIntent =
      await getStripe().paymentIntents.create({
        amount:
          amountInFils,

        currency: "aed",

        payment_method_types: ["card"],

        receipt_email:
          result.order.email,

        metadata: {
          orderId:
            result.order.id,

          orderNumber:
            result.order
              .orderNumber,

          customerId:
            session.sub,
        },
      });

    if (!paymentIntent.client_secret) {
      throw new Error(
        "PAYMENT_CLIENT_SECRET_MISSING"
      );
    }

    await prisma.payment.upsert({
      where: { orderId: result.order.id },
      create: {
        orderId: result.order.id,
        amount: result.total,
        currency: "aed",
        status: "Pending",
        providerPaymentIntentId: paymentIntent.id,
      },
      update: {
        amount: result.total,
        currency: "aed",
        status: "Pending",
        providerPaymentIntentId: paymentIntent.id,
        failureMessage: null,
      },
    });

    return NextResponse.json(
      {
        orderId:
          result.order.id,

        orderNumber:
          result.order
            .orderNumber,

        clientSecret:
          paymentIntent.client_secret,

        amount:
          result.total,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Stripe payment creation failed:",
      error
    );

    const reason =
      error instanceof Error
        ? error.message
        : "PAYMENT_FAILED";

    let message =
      "We could not prepare your payment. Please try again.";

    if (
      reason.startsWith(
        "OUT_OF_STOCK:"
      )
    ) {
      message = `${reason.slice(
        13
      )} no longer has enough stock.`;
    } else if (
      reason ===
      "ADDRESS_NOT_FOUND"
    ) {
      message =
        "Choose a saved delivery address before continuing.";
    } else if (
      reason ===
      "PET_LIMIT"
    ) {
      message =
        "Animals can only be purchased one at a time.";
    } else if (
      reason ===
      "PRODUCT_UNAVAILABLE"
    ) {
      message =
        "One or more products are no longer available.";
    }

    return NextResponse.json(
      {
        message,
      },
      {
        status: 400,
      }
    );
  }
}
