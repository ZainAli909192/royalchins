export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export const termsSections: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    paragraphs: [
      "These Terms and Conditions govern your access to and use of the Royal Chins website and your purchase of animals, accessories, products, and related services offered through the website.",
      "Royal Chins is the customer-facing trading brand operated by Royal Chains, a business licensed in Abu Dhabi, United Arab Emirates.",
      "By accessing our website, creating an account, placing an order, or completing a purchase, you agree to be bound by these Terms and Conditions.",
      "If you do not agree with these Terms and Conditions, you should not use the website or place an order.",
    ],
  },

  {
    id: "business-information",
    title: "2. Business Information",
    paragraphs: [
      "The Royal Chins website is operated by Royal Chains in the United Arab Emirates.",
      "The Royal Chins name may be used throughout the website, checkout, customer communications, payment descriptions, marketing materials, and other customer-facing areas as the trading brand of the business.",
    ],
  },

  {
    id: "eligibility",
    title: "3. Customer Eligibility",
    paragraphs: [
      "You must be legally capable of entering into a binding agreement to make a purchase through Royal Chins.",
      "You are responsible for ensuring that the information you provide when creating an account, placing an order, or arranging delivery is complete, accurate, and current.",
      "Royal Chins may refuse, cancel, or restrict an order where we reasonably believe the information supplied is inaccurate, fraudulent, incomplete, or otherwise unsuitable for processing.",
    ],
  },

  {
    id: "products",
    title: "4. Animals, Accessories and Product Information",
    paragraphs: [
      "Royal Chins offers small companion animals and related accessories and supplies. Our animal categories may include chinchillas, guinea pigs, micro squirrels, and other products that we are legally permitted to offer.",
      "We make reasonable efforts to ensure that descriptions, photographs, characteristics, availability, pricing, and other information displayed on the website are accurate.",
      "Because animals are living beings, individual appearance, size, behaviour, temperament, colouring, and other characteristics may naturally differ from photographs or general descriptions.",
      "Product images are provided for identification and presentation purposes. Accessories may also differ slightly in appearance due to manufacturing changes, photography, lighting, screen settings, or supplier updates.",
    ],
  },

  {
    id: "animal-welfare",
    title: "5. Animal Welfare and Customer Responsibility",
    paragraphs: [
      "Purchasing a companion animal is a long-term responsibility. Customers are expected to provide appropriate housing, nutrition, care, handling, cleanliness, environmental conditions, and veterinary attention where required.",
      "Before purchasing an animal, you should ensure that you understand the general care requirements associated with that species and that your household and environment are suitable.",
      "Customers are responsible for the animal's ongoing care after successful delivery and acceptance, subject to any rights that may apply under our Refund and Cancellation Policy and applicable UAE law.",
      "Royal Chins reserves the right to refuse or cancel an animal order where we reasonably believe that completing the sale could negatively affect the welfare of the animal or would otherwise be inappropriate.",
    ],
  },

  {
    id: "account",
    title: "6. Customer Accounts",
    paragraphs: [
      "Customers may be required to create or sign in to a Royal Chins account before completing a purchase.",
      "You are responsible for maintaining the confidentiality of your login credentials and for activities carried out through your account.",
      "You should notify Royal Chins if you believe your account has been accessed without your permission.",
    ],
  },

  {
    id: "orders",
    title: "7. Orders",
    paragraphs: [
      "Submitting an order through the website does not automatically guarantee acceptance.",
      "An order is subject to product or animal availability, successful payment processing, delivery availability, verification requirements, and acceptance by Royal Chins.",
      "We may contact you if additional information is required before we can process your order.",
      "Royal Chins reserves the right to reject or cancel an order where necessary, including where an animal or product is unavailable, a pricing or technical error has occurred, payment has failed, or the order cannot reasonably be fulfilled.",
    ],
  },

  {
    id: "pricing",
    title: "8. Pricing",
    paragraphs: [
      "Prices displayed on the Royal Chins website are shown in United Arab Emirates Dirhams (AED), unless stated otherwise.",
      "The applicable product price, delivery charge, and total amount will be displayed during checkout before payment is submitted.",
      "We may change prices from time to time. A change will not normally affect an order that has already been successfully placed and accepted, except where there is an obvious pricing or technical error.",
    ],
  },

  {
    id: "payments",
    title: "9. Payments",
    paragraphs: [
      "Royal Chins accepts the payment methods displayed during checkout. These may include credit or debit card payments and approved third-party payment providers such as Tamara or Tabby when available.",
      "Payment processing may be provided by third-party payment service providers.",
      "Royal Chins does not store your full payment card number or card security code on its own servers when payments are processed through an authorised third-party payment provider.",
      "Your payment may be subject to additional terms, verification procedures, security checks, or eligibility requirements imposed by your bank or payment provider.",
      "An order will not be treated as successfully paid merely because the customer is redirected to a confirmation screen. Payment confirmation may depend on verification from the relevant payment provider.",
    ],
  },

  {
    id: "delivery",
    title: "10. Delivery",
    paragraphs: [
      "Royal Chins currently provides delivery within supported locations in the United Arab Emirates.",
      "Available delivery options, charges, and related information will be shown during checkout where applicable.",
      "Customers must provide an accurate delivery address, contact number, and any information reasonably required to complete delivery.",
      "You should ensure that an authorised person is available to receive the order at the agreed delivery location.",
      "Delivery times are estimates unless expressly confirmed otherwise. Delays may occur due to traffic, weather, customer availability, operational issues, animal welfare considerations, or other circumstances outside our reasonable control.",
    ],
  },

  {
    id: "animal-delivery",
    title: "11. Delivery of Live Animals",
    paragraphs: [
      "Live animal deliveries require additional care and coordination.",
      "Royal Chins may contact the customer before delivery to confirm availability and ensure that suitable arrangements have been made to receive the animal.",
      "The customer should inspect the animal at the time of delivery and notify Royal Chins promptly if there is an immediately observable concern.",
      "For animal welfare reasons, Royal Chins may postpone, rearrange, or cancel a delivery if completing the delivery at that time would reasonably create an unsuitable condition for the animal.",
    ],
  },

  {
    id: "cancellations",
    title: "12. Order Cancellation",
    paragraphs: [
      "Customers may be able to request cancellation of an eligible order through their Royal Chins account.",
      "Cancellation availability depends on the current stage of the order.",
      "Orders that have already entered processing, delivery preparation, or delivery may no longer be eligible for self-cancellation.",
      "Cancellation of an order does not automatically mean that a refund has been completed. If payment has already been collected, an eligible customer may need to submit a refund request.",
      "Further information is provided in our Refund and Cancellation Policy.",
    ],
  },

  {
    id: "refunds",
    title: "13. Refunds",
    paragraphs: [
      "Refund requests are reviewed according to the circumstances of the order, the type of product purchased, the payment status, animal welfare considerations, and applicable law.",
      "Submitting a refund request does not automatically guarantee approval.",
      "If a refund is approved, it will normally be returned through the original payment method where technically possible.",
      "The time required for funds to appear in the customer's account may depend on the payment provider, card issuer, or bank.",
      "Please refer to the Royal Chins Refund and Cancellation Policy for additional information.",
    ],
  },

  {
    id: "reviews",
    title: "14. Reviews and Customer Content",
    paragraphs: [
      "Customers may be permitted to submit reviews relating to eligible purchases.",
      "Reviews should be truthful, relevant, respectful, and based on genuine customer experience.",
      "Royal Chins may review customer-submitted content before publication and may reject or remove content that is misleading, abusive, unlawful, inappropriate, irrelevant, or otherwise inconsistent with our website standards.",
      "Submitting a review does not guarantee that it will be published.",
    ],
  },

  {
    id: "website-use",
    title: "15. Acceptable Website Use",
    paragraphs: [
      "You must not use the Royal Chins website for unlawful, fraudulent, abusive, disruptive, or unauthorised purposes.",
    ],
    bullets: [
      "Attempt to gain unauthorised access to the website, customer accounts, systems, or data.",
      "Interfere with the normal operation or security of the website.",
      "Use automated tools to scrape or extract website content without permission.",
      "Submit false, fraudulent, misleading, or malicious information.",
      "Use the website in a manner that violates applicable UAE laws or regulations.",
    ],
  },

  {
    id: "intellectual-property",
    title: "16. Intellectual Property",
    paragraphs: [
      "Unless otherwise stated, the Royal Chins website, branding, logo, text, graphics, photographs, design elements, product presentation, software, and other original website content are owned by or licensed to Royal Chains.",
      "You may use the website for your own lawful personal use.",
      "You may not copy, reproduce, distribute, modify, commercially exploit, or republish protected Royal Chins content without prior permission, except where permitted by applicable law.",
    ],
  },

  {
    id: "third-parties",
    title: "17. Third-Party Services",
    paragraphs: [
      "The website may use or link to third-party services, including payment processors, financing providers, communication services, maps, analytics platforms, and other technology providers.",
      "Your use of a third-party service may also be governed by that provider's own terms and privacy practices.",
      "Royal Chins is not responsible for the independent operation of third-party websites or services that are outside our reasonable control.",
    ],
  },

  {
    id: "availability",
    title: "18. Website Availability",
    paragraphs: [
      "We aim to keep the Royal Chins website available and functioning correctly, but uninterrupted availability cannot be guaranteed.",
      "We may temporarily suspend, restrict, update, or modify parts of the website for maintenance, security, operational, legal, or technical reasons.",
    ],
  },

  {
    id: "liability",
    title: "19. Limitation of Liability",
    paragraphs: [
      "Nothing in these Terms and Conditions is intended to exclude or limit any responsibility that cannot legally be excluded under applicable UAE law.",
      "To the extent permitted by applicable law, Royal Chins and Royal Chains will not be responsible for indirect or consequential losses arising from use of the website or circumstances beyond our reasonable control.",
      "Customers remain responsible for complying with appropriate care requirements after taking possession of an animal.",
    ],
  },

  {
    id: "force-majeure",
    title: "20. Events Outside Our Control",
    paragraphs: [
      "Royal Chins will not be responsible for a failure or delay caused by circumstances reasonably beyond our control.",
      "Such circumstances may include severe weather, transport disruption, government restrictions, telecommunications failures, payment-network disruption, emergencies, or other events that prevent normal fulfilment.",
    ],
  },

  {
    id: "privacy",
    title: "21. Privacy and Personal Data",
    paragraphs: [
      "We collect and process personal information required to operate customer accounts, fulfil orders, process payments, arrange delivery, provide support, prevent fraud, and operate the Royal Chins website.",
      "For further information about how personal data is handled, please refer to our Privacy Policy.",
    ],
  },

  {
    id: "changes",
    title: "22. Changes to These Terms",
    paragraphs: [
      "Royal Chins may update these Terms and Conditions from time to time to reflect changes to our services, business practices, legal requirements, payment methods, or website functionality.",
      "The latest version published on the website will apply from its stated effective date.",
    ],
  },

  {
    id: "law",
    title: "23. Governing Law",
    paragraphs: [
      "These Terms and Conditions are governed by the applicable laws of the United Arab Emirates and, where relevant, the laws and regulations applicable in the Emirate of Abu Dhabi.",
      "Any dispute will be handled subject to the jurisdiction and procedures applicable under UAE law.",
    ],
  },

  {
    id: "contact",
    title: "24. Contact Royal Chins",
    paragraphs: [
      "If you have questions about these Terms and Conditions, an order, delivery, refund, or your Royal Chins account, you can contact us using the contact information available on our website.",
    ],
    bullets: [
      "Website: royalchins.com",
      "Email: theroyalchins@gmail.com",
      "Phone: +971 50 780 1110",
      "WhatsApp: +971 50 780 1110",
      "Location: Abu Dhabi, United Arab Emirates",
    ],
  },
];

export const termsDocument = {
  eyebrow: "Legal",
  title: "Terms & Conditions",
  description:
    "Please read these Terms and Conditions carefully before using Royal Chins or placing an order through our website.",
  lastUpdated: "2 September 2026",
  effectiveDate: "2 September 2026",
  sections: termsSections,
};