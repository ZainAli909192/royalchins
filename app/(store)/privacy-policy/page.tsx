import type {
  Metadata,
} from "next";

import {
  LegalDocumentPage,
} from "@/components/store/legal/legal-document-page";

import {
  privacyPolicyDocument,
} from "@/lib/store/legal/privacy-content";
import CompanionStorySection from "@/components/store/layout/companion-story-section";

export const metadata: Metadata = {
  title:
    "Privacy Policy",

  description:
    "Read the Royal Chins Privacy Policy to understand how we collect, use, protect, and manage customer information in the UAE.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
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
      <div className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
              <CompanionStorySection />
            </div>
      </>
  );
}
