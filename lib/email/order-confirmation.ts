import "server-only";

import { Resend } from "resend";

type MoneyValue =
  | { toString(): string }
  | number;

type OrderEmail = {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  subtotal: MoneyValue;
  deliveryFee: MoneyValue;
  total: MoneyValue;
  paymentMethod: string;

  items: {
    productName: string;
    quantity: number;
    unitPrice: MoneyValue;
  }[];

  shippingAddress: {
    recipientName: string;
    phone: string;
    emirate: string;
    area: string;
    street: string;
    building: string;
    unit: string | null;
  } | null;
};

const amount = (value: MoneyValue) =>
  `AED ${Number(value).toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const text = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character
  );

export async function sendOrderConfirmationEmails(
  order: OrderEmail,
  ownerEmail?: string
) {
  const apiKey = process.env.RESEND_API_KEY;

  const from =
    process.env.RESEND_FROM_EMAIL ||
    "Royal Chins <orders@royalchins.com>";

  if (!apiKey) {
    console.warn(
      "Order confirmation emails skipped: RESEND_API_KEY is missing."
    );

    return;
  }

  if (!ownerEmail) {
    console.warn(
      "Owner notification skipped: no admin notification email is configured."
    );
  }

  const resend = new Resend(apiKey);

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0">
            ${text(item.productName)} × ${item.quantity}
          </td>

          <td align="right">
            ${amount(item.unitPrice)}
          </td>
        </tr>
      `
    )
    .join("");

  const address = order.shippingAddress
    ? `
      ${text(order.shippingAddress.recipientName)}
      <br>
      ${text(order.shippingAddress.building)},
      ${text(order.shippingAddress.street)}
      <br>
      ${text(order.shippingAddress.area)},
      ${text(order.shippingAddress.emirate)}
      ${
        order.shippingAddress.unit
          ? `<br>Unit ${text(order.shippingAddress.unit)}`
          : ""
      }
    `
    : "Delivery address pending";

  const summary = `
    <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="
        font-family:Arial,sans-serif;
        color:#19131f;
        max-width:600px;
      "
    >
      <tr>
        <td>
          <h1
            style="
              margin:0 0 8px;
              color:#6f3bd2;
            "
          >
            Royal Chins
          </h1>

          <h2 style="margin:0 0 18px">
            Order ${text(order.orderNumber)} confirmed
          </h2>

          <p>
            Thank you, ${text(order.customerName)}.
            We’ve received your order and will prepare
            it with care.
          </p>

          <table
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="
              border-top:1px solid #e8e2ed;
              border-bottom:1px solid #e8e2ed;
            "
          >
            ${itemRows}
          </table>

          <p>
            <strong>Subtotal:</strong>
            ${amount(order.subtotal)}
            <br>

            <strong>Delivery:</strong>
            ${amount(order.deliveryFee)}
            <br>

            <strong>Total:</strong>
            ${amount(order.total)}
          </p>

          <p>
            <strong>Delivery address</strong>
            <br>
            ${address}
          </p>

          <p style="color:#6b6570">
            Payment method:
            ${text(order.paymentMethod)}
          </p>
        </td>
      </tr>
    </table>
  `;

  const customerEmail = resend.emails.send({
    from,
    to: order.email,
    subject: `Order confirmed · ${order.orderNumber}`,
    html: summary,
  });

  const emailRequests: Promise<unknown>[] = [
    customerEmail,
  ];

  if (ownerEmail) {
    const ownerEmailHtml = `
      ${summary}

      <div
        style="
          max-width:600px;
          margin-top:20px;
          padding:16px;
          border:1px solid #e8e2ed;
          border-radius:12px;
          font-family:Arial,sans-serif;
          color:#19131f;
        "
      >
        <strong>Customer Contact</strong>

        <p style="margin:8px 0 0">
          Name: ${text(order.customerName)}
          <br>

          Email: ${text(order.email)}
          <br>

          Phone: ${text(order.phone)}
        </p>
      </div>
    `;

    emailRequests.push(
      resend.emails.send({
        from,
        to: ownerEmail,
        subject: `New order · ${order.orderNumber}`,
        html: ownerEmailHtml,
      })
    );
  }

  const results =
    await Promise.allSettled(emailRequests);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        index === 0
          ? "Customer order confirmation email failed:"
          : "Owner order notification email failed:",
        result.reason
      );
    }
  });
}
