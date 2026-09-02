import type {
  Metadata,
} from "next";

import {
  LegalDocumentPage,
} from "@/components/store/legal/legal-document-page";

import {
  privacyPolicyDocument,
} from "@/lib/store/legal/privacy-content";

export const metadata: Metadata = {
  title:
    "Privacy Policy | Royal Chins",

  description:
    "Read the Royal Chins Privacy Policy to understand how we collect, use, protect, and manage customer information in the UAE.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      eyebrow={
        privacyPolicyDocument.eyebrow
      }
      title={
        privacyPolicyDocument.title
      }
      description={
        privacyPolicyDocument.description
      }
      lastUpdated={
        privacyPolicyDocument.lastUpdated
      }
      effectiveDate={
        privacyPolicyDocument.effectiveDate
      }
      sections={
        privacyPolicyDocument.sections
      }
    />
  );
}