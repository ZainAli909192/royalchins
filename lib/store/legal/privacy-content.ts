import type {
  LegalSection,
} from "@/lib/store/legal/terms-content";

export const privacyPolicySections: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    paragraphs: [
      "This Privacy Policy explains how Royal Chins collects, uses, stores, and protects personal information when you visit our website, create an account, place an order, make a payment, request a refund, submit a review, contact us, or otherwise use our services.",
      "Royal Chins is the customer-facing trading brand operated by Royal Chains, a business licensed in Abu Dhabi, United Arab Emirates.",
      "By using the Royal Chins website and services, you acknowledge the practices described in this Privacy Policy.",
    ],
  },

  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    paragraphs: [
      "We may collect personal information that you provide directly to Royal Chins as well as certain technical and transactional information generated when you use our website and services.",
      "The information collected depends on how you interact with Royal Chins.",
    ],
    bullets: [
      "Name and customer account information.",
      "Email address.",
      "Mobile or telephone number.",
      "Delivery address and delivery instructions.",
      "Order and purchase information.",
      "Payment status and payment transaction references.",
      "Refund and cancellation information.",
      "Customer reviews and related submissions.",
      "Communications with Royal Chins.",
      "Technical, security, and website usage information where applicable.",
    ],
  },

  {
    id: "account-information",
    title: "3. Customer Account Information",
    paragraphs: [
      "When you create a Royal Chins account, we may collect information such as your name, email address, mobile number, and authentication information required to maintain your account.",
      "Your account allows you to manage information such as your profile, delivery addresses, orders, reviews, cancellations, and eligible refund requests.",
      "You are responsible for keeping your account information accurate and for protecting your login credentials.",
    ],
  },

  {
    id: "delivery-information",
    title: "4. Delivery Information",
    paragraphs: [
      "When you place an order, we collect the information necessary to arrange and complete delivery.",
    ],
    bullets: [
      "Customer or recipient name.",
      "Mobile or contact number.",
      "Delivery address.",
      "Emirate, area, or location information.",
      "Delivery instructions or notes supplied by the customer.",
      "Information reasonably required to coordinate delivery.",
    ],
  },

  {
    id: "order-information",
    title: "5. Order Information",
    paragraphs: [
      "We maintain information relating to purchases made through Royal Chins.",
      "This may include the products or animals ordered, quantities, prices, delivery charges, order total, order status, payment status, delivery information, cancellation information, and related transaction records.",
      "We use this information to fulfil orders, provide customer support, maintain transaction records, manage refunds, and operate the Royal Chins service.",
    ],
  },

  {
    id: "payment-information",
    title: "6. Payment Information",
    paragraphs: [
      "Payments made through Royal Chins may be processed by authorised third-party payment providers.",
      "For card payments, Royal Chins may use Stripe or another approved payment service provider to securely process the transaction.",
      "Royal Chins does not intend to store your complete payment card number or card security code on its own servers when payment information is collected directly and securely by the payment provider.",
      "We may receive and retain payment-related information such as the payment provider, payment method type, payment status, transaction reference, amount, payment date, failure information, refund information, and other details necessary to reconcile the transaction.",
    ],
  },

  {
    id: "payment-providers",
    title: "7. Third-Party Payment Providers",
    paragraphs: [
      "Depending on the payment options available during checkout, payments may be processed through providers such as Stripe, Tamara, Tabby, or other authorised payment services.",
      "When you use a third-party payment provider, that provider may independently collect and process information according to its own privacy policy and legal obligations.",
      "Royal Chins may exchange information with payment providers where necessary to process payments, verify transaction status, prevent fraud, process refunds, handle disputes, and maintain financial records.",
    ],
  },

  {
    id: "how-we-use-information",
    title: "8. How We Use Personal Information",
    paragraphs: [
      "Royal Chins uses personal information where reasonably necessary to provide and operate our services.",
    ],
    bullets: [
      "Create and maintain customer accounts.",
      "Process and manage orders.",
      "Confirm product or animal availability.",
      "Process and verify payments.",
      "Arrange and complete deliveries.",
      "Send order and payment communications.",
      "Manage cancellations and refund requests.",
      "Provide customer service and respond to enquiries.",
      "Manage customer reviews.",
      "Prevent fraud, misuse, and unauthorised activity.",
      "Maintain website and account security.",
      "Comply with legal, regulatory, accounting, and record-keeping obligations.",
      "Improve the operation and customer experience of Royal Chins.",
    ],
  },

  {
    id: "communications",
    title: "9. Customer Communications",
    paragraphs: [
      "We may use your contact information to send communications that are necessary for your account or transaction.",
    ],
    bullets: [
      "Account-related notifications.",
      "Order confirmations.",
      "Payment confirmations or payment-related notices.",
      "Delivery coordination and updates.",
      "Cancellation and refund updates.",
      "Security-related communications.",
      "Responses to customer service requests.",
    ],
    },
  
  {
    id: "marketing",
    title: "10. Marketing Communications",
    paragraphs: [
      "Where permitted by applicable law and where any required consent has been obtained, Royal Chins may send customers information about products, animals, accessories, offers, or other Royal Chins updates.",
      "Where applicable, customers may unsubscribe from optional marketing communications using the method provided in the communication or by contacting Royal Chins.",
      "Transactional or service-related communications may still be sent where necessary to operate your account or fulfil an order.",
    ],
  },

  {
    id: "reviews",
    title: "11. Reviews and Customer Content",
    paragraphs: [
      "Customers may be able to submit reviews relating to eligible purchases.",
      "Information submitted as part of a review may be reviewed by Royal Chins before publication.",
      "Approved reviews may be displayed publicly on the Royal Chins website.",
      "Customers should avoid including sensitive personal information, payment information, addresses, telephone numbers, or other unnecessary personal information in publicly submitted reviews.",
    ],
  },

  {
    id: "cookies",
    title: "12. Cookies and Similar Technologies",
    paragraphs: [
      "Royal Chins may use cookies or similar technologies that are necessary for website functionality, authentication, security, shopping functionality, preferences, analytics, or other permitted purposes.",
      "Some cookies may be provided by third-party services integrated with the website.",
      "Where required by applicable law, additional information or choices relating to non-essential cookies may be presented to website visitors.",
    ],
  },

  {
    id: "technical-information",
    title: "13. Technical and Usage Information",
    paragraphs: [
      "When you access the Royal Chins website, certain technical information may be processed automatically by our hosting, security, analytics, or technology providers.",
    ],
    bullets: [
      "IP address.",
      "Browser and device information.",
      "Operating system information.",
      "Pages visited and website interactions.",
      "Date and time of access.",
      "Security and diagnostic information.",
      "General technical information required to operate and protect the website.",
    ],
  },

  {
    id: "fraud-security",
    title: "14. Fraud Prevention and Security",
    paragraphs: [
      "Royal Chins and our service providers may process information to identify suspicious transactions, prevent payment fraud, protect customer accounts, detect unauthorised activity, and maintain the security of our services.",
      "Payment providers may apply their own fraud detection, authentication, and risk-management systems to transactions.",
      "Where a transaction appears suspicious or requires additional verification, an order or payment may be delayed, rejected, or reviewed.",
    ],
  },

  {
    id: "sharing-information",
    title: "15. When We Share Information",
    paragraphs: [
      "Royal Chins does not need to sell personal information in order to operate its business.",
      "We may share personal information with trusted third parties where reasonably necessary to operate the Royal Chins service or comply with legal obligations.",
    ],
    bullets: [
      "Payment processors and payment providers.",
      "Hosting, database, and technology providers.",
      "Email and communication service providers.",
      "Delivery and logistics providers where applicable.",
      "Fraud prevention and security providers.",
      "Professional advisers where reasonably necessary.",
      "Government, regulatory, law-enforcement, judicial, or other authorities where disclosure is legally required.",
    ],
  },

  {
    id: "service-providers",
    title: "16. Service Providers",
    paragraphs: [
      "Royal Chins may rely on third-party technology and service providers to operate parts of the website and business.",
      "These providers may process information on our behalf or independently where necessary to provide their services.",
      "We aim to use reputable providers and disclose only information reasonably necessary for the relevant purpose.",
    ],
  },

  {
    id: "international-processing",
    title: "17. International Data Processing",
    paragraphs: [
      "Some technology, payment, hosting, communication, or service providers used by Royal Chins may process or store information outside the United Arab Emirates.",
      "Where personal information is transferred or processed internationally, we seek to use service providers and arrangements appropriate to the nature of the information and applicable legal requirements.",
    ],
  },

  {
    id: "data-retention",
    title: "18. Data Retention",
    paragraphs: [
      "Royal Chins retains personal information for as long as reasonably necessary for the purpose for which it was collected and to meet applicable legal, regulatory, accounting, security, dispute-resolution, and business requirements.",
      "Different categories of information may be retained for different periods.",
      "For example, order and payment records may need to be retained after a customer stops actively using their account where they are required for financial, legal, fraud-prevention, or record-keeping purposes.",
    ],
  },

  {
    id: "data-security",
    title: "19. Data Security",
    paragraphs: [
      "Royal Chins takes reasonable technical and organisational measures designed to protect personal information against unauthorised access, loss, misuse, alteration, or disclosure.",
      "These measures may include access controls, secure authentication, encrypted connections, restricted access to administrative systems, payment-provider security measures, and other appropriate safeguards.",
      "No internet-based service can guarantee absolute security, and customers should also take reasonable steps to protect their account credentials and devices.",
    ],
  },

  {
    id: "passwords",
    title: "20. Password and Account Security",
    paragraphs: [
      "Customers are responsible for maintaining the confidentiality of their Royal Chins account credentials.",
      "You should use a strong password and should not knowingly share your password with another person.",
      "If you believe your account has been compromised or accessed without permission, contact Royal Chins promptly and change your password where possible.",
    ],
  },

  {
    id: "customer-rights",
    title: "21. Your Privacy Rights",
    paragraphs: [
      "Depending on the circumstances and applicable UAE law, you may have rights relating to personal information held about you.",
      "These rights may be subject to legal conditions, exceptions, verification requirements, and record-retention obligations.",
    ],
    bullets: [
      "Request information about how your personal information is processed.",
      "Request access to certain personal information held about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of information where legally applicable.",
      "Object to or request restriction of certain processing where applicable.",
      "Withdraw consent where processing relies on consent, subject to applicable legal limitations.",
    ],
  },

  {
    id: "account-updates",
    title: "22. Updating Your Information",
    paragraphs: [
      "Certain personal information may be updated directly through your Royal Chins account.",
      "Customers should keep their name, contact information, and delivery information accurate to help prevent order and delivery problems.",
      "If information cannot be updated through your account, you may contact Royal Chins for assistance.",
    ],
  },

  {
    id: "deletion",
    title: "23. Account and Data Deletion Requests",
    paragraphs: [
      "Customers may contact Royal Chins regarding account or personal-data deletion requests.",
      "A deletion request does not necessarily require Royal Chins to immediately delete every record associated with the customer.",
      "Certain information may need to be retained where required for legal, financial, tax, fraud-prevention, dispute-resolution, payment, or other legitimate record-keeping purposes.",
    ],
  },

  {
    id: "children",
    title: "24. Children's Privacy",
    paragraphs: [
      "Royal Chins is not intended to knowingly collect personal information from children who are not legally capable of entering into the relevant transaction or providing any required consent.",
      "Purchases should be made by a person legally capable of entering into the transaction.",
      "If you believe personal information relating to a child has been provided to Royal Chins inappropriately, please contact us.",
    ],
  },

  {
    id: "external-links",
    title: "25. External Websites and Services",
    paragraphs: [
      "The Royal Chins website may contain links to third-party websites or services.",
      "Royal Chins is not responsible for the privacy practices, security, or content of independent third-party websites.",
      "Customers should review the privacy information provided by the relevant third party before providing personal information directly to them.",
    ],
  },

  {
    id: "legal-disclosure",
    title: "26. Legal and Regulatory Disclosure",
    paragraphs: [
      "Royal Chins may preserve or disclose information where reasonably necessary to comply with applicable laws, legal processes, regulatory requirements, court orders, governmental requests, fraud investigations, or the establishment, exercise, or defence of legal claims.",
    ],
  },

  {
    id: "policy-changes",
    title: "27. Changes to This Privacy Policy",
    paragraphs: [
      "Royal Chins may update this Privacy Policy from time to time to reflect changes to our website, services, technology providers, payment methods, business practices, or applicable legal requirements.",
      "The latest version will be published on the Royal Chins website together with its updated effective date.",
      "Customers should review this page periodically for material changes.",
    ],
  },

  {
    id: "contact",
    title: "28. Contact Royal Chins",
    paragraphs: [
      "If you have a question about this Privacy Policy, the personal information associated with your Royal Chins account, or a privacy-related request, please contact Royal Chins.",
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

export const privacyPolicyDocument = {
  eyebrow: "Privacy",
  title: "Privacy Policy",
  description:
    "This Privacy Policy explains how Royal Chins collects, uses, protects, and manages personal information when you use our website, account, ordering, payment, delivery, and customer services.",
  lastUpdated: "2 September 2026",
  effectiveDate: "2 September 2026",
  sections: privacyPolicySections,
};