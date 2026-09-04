import type {
  Metadata,
} from "next";

import {
  LegalDocumentPage,
} from "@/components/store/legal/legal-document-page";

import {
  refundPolicyDocument,
} from "@/lib/store/legal/refund-content";

export const metadata: Metadata = {
  title:
    "Refund & Cancellation Policy",

  description:
    "Read the Royal Chins Refund and Cancellation Policy covering order cancellation, refund requests, refund processing and customer responsibilities in the UAE.",
  alternates: { canonical: "/refund-and-cancellation-policy" },
};

export default function RefundAndCancellationPolicyPage() {
  return (
    <LegalDocumentPage
      eyebrow={
        refundPolicyDocument.eyebrow
      }
      title={
        refundPolicyDocument.title
      }
      description={
        refundPolicyDocument.description
      }
      lastUpdated={
        refundPolicyDocument.lastUpdated
      }
      effectiveDate={
        refundPolicyDocument.effectiveDate
      }
      sections={
        refundPolicyDocument.sections
      }
    />
  );
}
