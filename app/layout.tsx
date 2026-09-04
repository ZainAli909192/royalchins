import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { absoluteUrl, serializeJsonLd, SITE_NAME, SITE_URL } from "@/lib/store/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Royal Chins | Chinchillas, Guinea Pigs & Small Pets UAE",
    template: "%s | Royal Chins",
  },
  description: "Discover Chinchillas, Guinea Pigs, Micro Squirrels and carefully selected small pet accessories from Royal Chins in the UAE.",
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: ["chinchillas UAE", "guinea pigs UAE", "small pets Abu Dhabi", "small pet accessories UAE"],
  authors: [{ name: SITE_NAME }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AE",
    title: "Royal Chins | Chinchillas, Guinea Pigs & Small Pets UAE",
    description: "Discover Chinchillas, Guinea Pigs, Micro Squirrels and carefully selected small pet accessories from Royal Chins in the UAE.",
    url: SITE_URL,
    images: [{ url: "/desktop_hero_poster.png", width: 1200, height: 630, alt: "Royal Chins small pets and accessories in the UAE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Chins | Chinchillas, Guinea Pigs & Small Pets UAE",
    description: "Discover Chinchillas, Guinea Pigs, Micro Squirrels and carefully selected small pet accessories from Royal Chins in the UAE.",
    images: ["/desktop_hero_poster.png"],
  },
  icons: { icon: "/favicon.ico", apple: "/logo.png" },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
                logo: absoluteUrl("/logo.png"),
                address: { "@type": "PostalAddress", addressLocality: "Abu Dhabi", addressCountry: "AE" },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${SITE_URL}/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
        {children}
      </body>
    </html>
  );
}
