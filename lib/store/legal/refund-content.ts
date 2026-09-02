import type {
  LegalSection,
} from "@/lib/store/legal/terms-content";

export const refundPolicySections: LegalSection[] = [
  {
    id: "overview",
    title: "1. Overview",
    paragraphs: [
      "This Refund and Cancellation Policy explains how Royal Chins handles order cancellations, refund requests, approved refunds, failed refunds, and related customer requests.",
      "Royal Chins is the customer-facing trading brand operated by Royal Chains, a business licensed in Abu Dhabi, United Arab Emirates.",
      "This policy should be read together with our Terms and Conditions and any other policies published on the Royal Chins website.",
    ],
  },

  {
    id: "cancellation-before-processing",
    title: "2. Cancelling an Order",
    paragraphs: [
      "Customers may be able to cancel an eligible order before it enters processing or delivery preparation.",
      "The availability of self-cancellation depends on the current order status shown in the customer's Royal Chins account.",
      "If the cancellation option is available, the customer may submit the cancellation request directly from the relevant order.",
    ],
  },

  {
    id: "eligible-cancellation-statuses",
    title: "3. When Cancellation Is Available",
    paragraphs: [
      "As a general rule, orders may be eligible for cancellation while they are still in an early stage of fulfilment.",
    ],
    bullets: [
      "Pending orders may be cancelled where fulfilment has not yet started.",
      "Confirmed orders may be cancelled where the order has not yet entered processing or delivery preparation.",
      "Processing orders are generally no longer eligible for customer self-cancellation.",
      "Delivered orders cannot be cancelled because fulfilment has already been completed.",
      "Orders already marked as Cancelled do not need to be cancelled again.",
    ],
  },

  {
    id: "cancellation-and-payment",
    title: "4. Cancellation Does Not Automatically Mean Refund",
    paragraphs: [
      "Cancelling an order stops the order from proceeding where cancellation is still permitted.",
      "A cancellation and a refund are separate actions.",
      "If payment has not yet been successfully collected, no refund may be required.",
      "If payment has already been successfully collected, an eligible customer may need to submit a refund request after the order has been cancelled.",
    ],
  },

  {
    id: "refund-eligibility",
    title: "5. Refund Eligibility",
    paragraphs: [
      "Refund eligibility depends on the circumstances of the order, payment status, product type, delivery status, animal welfare considerations, and applicable UAE law.",
      "Submitting a refund request does not automatically guarantee that the refund will be approved.",
      "Each eligible refund request may be reviewed by Royal Chins before a final decision is made.",
    ],
  },

  {
    id: "refund-reasons",
    title: "6. Common Reasons for a Refund Request",
    paragraphs: [
      "Customers may submit a refund request where an eligible issue has occurred.",
    ],
    bullets: [
      "The order was cancelled before delivery after payment had already been collected.",
      "An animal or item arrived with an immediately identifiable issue.",
      "The wrong item was delivered.",
      "An accessory or item was damaged during delivery.",
      "A duplicate payment was processed.",
      "Another issue occurred that reasonably requires review by Royal Chins.",
    ],
  },

  {
    id: "live-animals",
    title: "7. Refund Requests Involving Live Animals",
    paragraphs: [
      "Live animals require special consideration because they are living beings and their health, condition, behaviour, and welfare may be affected by handling, environment, transport, care, and other factors.",
      "Customers should inspect the animal at the time of delivery and contact Royal Chins promptly if there is an immediately observable concern.",
      "Customers should provide accurate information and reasonable supporting evidence where requested so that Royal Chins can review the circumstances.",
      "Royal Chins may assess animal-related refund requests individually, taking into account the condition of the animal at delivery, the timing of the report, available evidence, welfare considerations, and any rights that apply under UAE law.",
    ],
  },

  {
    id: "customer-responsibility",
    title: "8. Customer Responsibility After Delivery",
    paragraphs: [
      "After successful delivery and acceptance, customers are responsible for providing appropriate housing, nutrition, care, handling, cleanliness, environmental conditions, and veterinary attention where required.",
      "Royal Chins may not be responsible for issues caused after delivery by unsuitable care, improper handling, inappropriate housing, environmental conditions, neglect, or other circumstances outside our reasonable control.",
      "Nothing in this policy is intended to remove any customer right that cannot legally be excluded under applicable UAE law.",
    ],
  },

  {
    id: "accessories",
    title: "9. Accessories and Physical Products",
    paragraphs: [
      "Refund requests relating to accessories or other physical products may be reviewed based on the condition of the item, the reason for the request, delivery circumstances, and applicable law.",
      "Where requested, customers may need to provide photographs or other information showing the relevant issue.",
      "Products that have been used, damaged after delivery, altered, or otherwise made unsuitable for return may not be eligible for a refund unless required by applicable law.",
    ],
  },

  {
    id: "refund-request-process",
    title: "10. How to Request a Refund",
    paragraphs: [
      "Where a refund request is available, customers may submit the request through their Royal Chins account from the relevant order.",
      "Customers should select the reason for the request and provide sufficient details about the issue.",
      "Royal Chins may contact the customer for additional information before making a decision.",
    ],
  },

  {
    id: "review-process",
    title: "11. Refund Review Process",
    paragraphs: [
      "Refund requests are reviewed by Royal Chins.",
      "A submitted refund request may remain pending while it is being reviewed.",
      "Royal Chins may approve or decline the request based on the information available and the circumstances of the order.",
      "Where further information is required, processing may take longer until the requested information is provided.",
    ],
  },

  {
    id: "refund-statuses",
    title: "12. Refund Statuses",
    paragraphs: [
      "Customers may see different refund statuses while a request is being processed.",
    ],
    bullets: [
      "Requested: The refund request has been submitted and is awaiting review.",
      "Approved: Royal Chins has approved the refund request.",
      "Pending: The approved refund is being processed by the payment provider.",
      "Completed: The refund has been successfully processed.",
      "Failed: The payment provider was unable to complete the refund and further review may be required.",
      "Declined: Royal Chins has reviewed the request and has not approved the refund.",
    ],
  },

  {
    id: "approved-refunds",
    title: "13. Approved Refunds",
    paragraphs: [
      "If a refund request is approved, Royal Chins will normally initiate the refund through the original payment method where technically possible.",
      "The refund is not treated as completed until confirmation is received from the relevant payment provider.",
      "The amount refunded will depend on the approved refund amount and the circumstances of the request.",
    ],
  },

  {
    id: "refund-processing-time",
    title: "14. Refund Processing Time",
    paragraphs: [
      "After an approved refund has been processed by Royal Chins, the time required for the funds to appear in the customer's account depends on the payment provider, card network, bank, or card issuer.",
      "Royal Chins cannot control the internal posting time used by the customer's bank or payment provider.",
      "Customers should allow the relevant provider's normal processing period before reporting a missing refund.",
    ],
  },

  {
    id: "original-payment-method",
    title: "15. Original Payment Method",
    paragraphs: [
      "Refunds will normally be returned to the original payment method used for the order where technically possible.",
      "Royal Chins does not normally issue refunds to an unrelated bank account, card, or payment method unless there is a valid operational or legal reason to do so.",
      "Third-party payment providers such as card processors, Tamara, or Tabby may apply their own procedures and timelines to refunds processed through their services.",
    ],
  },

  {
    id: "partial-refunds",
    title: "16. Partial Refunds",
    paragraphs: [
      "In some circumstances, Royal Chins may approve a refund for only part of an order rather than the full amount.",
      "A partial refund may apply where only a specific item, charge, or portion of an order is affected.",
      "The approved amount will be communicated through the applicable order or refund process.",
    ],
  },

  {
    id: "delivery-fees",
    title: "17. Delivery Charges",
    paragraphs: [
      "Whether a delivery charge is refundable depends on the circumstances of the cancellation or refund request.",
      "Where delivery has already been completed or substantial delivery costs have already been incurred, the delivery fee may not be refundable unless required by applicable law or otherwise approved by Royal Chins.",
    ],
  },

  {
    id: "duplicate-payments",
    title: "18. Duplicate or Incorrect Payments",
    paragraphs: [
      "If you believe you have been charged more than once for the same order or that an incorrect amount has been processed, contact Royal Chins promptly.",
      "We will review the payment records and, where an incorrect or duplicate payment is confirmed, take the appropriate action through the relevant payment provider.",
    ],
  },

  {
    id: "failed-refunds",
    title: "19. Failed Refunds",
    paragraphs: [
      "A refund may occasionally fail because of a payment-provider, card, banking, technical, or account-related issue.",
      "If a refund fails, Royal Chins may review the failure and determine whether another attempt or further action is required.",
      "Customers may be contacted if additional information is needed.",
    ],
  },

  {
    id: "chargebacks",
    title: "20. Chargebacks and Payment Disputes",
    paragraphs: [
      "Customers should contact Royal Chins first where possible if they believe there is a problem with an order or payment.",
      "Submitting a chargeback or payment dispute through a bank does not automatically replace the Royal Chins refund process.",
      "If a dispute is submitted, Royal Chins may provide relevant order, payment, delivery, and communication records to the payment provider or financial institution as part of the dispute process.",
    ],
  },

  {
    id: "fraud",
    title: "21. Fraudulent or Abusive Requests",
    paragraphs: [
      "Royal Chins may reject, investigate, or restrict refund requests that appear fraudulent, intentionally misleading, abusive, repetitive, or otherwise inconsistent with genuine customer use.",
      "We may also take reasonable steps to protect the business, customers, animals, and payment systems from misuse.",
    ],
  },

  {
    id: "changes",
    title: "22. Changes to This Policy",
    paragraphs: [
      "Royal Chins may update this Refund and Cancellation Policy from time to time to reflect changes to our order process, payment methods, delivery operations, legal requirements, or business practices.",
      "The latest version published on the Royal Chins website will apply from its stated effective date.",
    ],
  },

  {
    id: "governing-law",
    title: "23. Governing Law",
    paragraphs: [
      "This Refund and Cancellation Policy is governed by the applicable laws of the United Arab Emirates and, where relevant, the laws and regulations applicable in the Emirate of Abu Dhabi.",
      "Nothing in this policy is intended to limit rights or remedies that cannot legally be excluded under applicable UAE law.",
    ],
  },

  {
    id: "contact",
    title: "24. Contact Royal Chins",
    paragraphs: [
      "If you need assistance with a cancellation, refund request, payment issue, delivery concern, or completed refund, contact Royal Chins using the information available on our website.",
    ],
    bullets: [
      "Website: royalchins.com",
      "Email: hello@royalchins.ae",
      "Phone: +971 50 780 1110",
      "WhatsApp: +971 50 780 1110",
      "Location: Abu Dhabi, United Arab Emirates",
    ],
  },
];

export const refundPolicyDocument = {
  eyebrow: "Customer Policy",
  title: "Refund & Cancellation Policy",
  description:
    "This policy explains when Royal Chins orders may be cancelled, how refund requests are reviewed, and how approved refunds are processed.",
  lastUpdated: "2 September 2026",
  effectiveDate: "2 September 2026",
  sections: refundPolicySections,
};