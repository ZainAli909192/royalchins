import type {
  Metadata,
} from "next";

import {
  LegalDocumentPage,
} from "@/components/store/legal/legal-document-page";

import {
  termsDocument,
} from "@/lib/store/legal/terms-content";

export const metadata: Metadata = {
  title:
    "Terms & Conditions | Royal Chins",

  description:
    "Read the Royal Chins Terms and Conditions covering orders, payments, companion animals, accessories, delivery, cancellations and refunds in the UAE.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalDocumentPage
      eyebrow={
        termsDocument.eyebrow
      }
      title={
        termsDocument.title
      }
      description={
        termsDocument.description
      }
      lastUpdated={
        termsDocument.lastUpdated
      }
      effectiveDate={
        termsDocument.effectiveDate
      }
      sections={
        termsDocument.sections
      }
    />
  );
}