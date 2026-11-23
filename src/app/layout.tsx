import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { SHOWROOM_INFO } from "@/data/products";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AutoInquiryPopup } from "@/components/AutoInquiryPopup";
import { StorefrontOnly } from "@/components/StorefrontOnly";
import { CatalogProvider } from "@/lib/catalog/context";
import { getCatalog } from "@/lib/server/catalog";
import { getSiteContent } from "@/lib/server/site-content";

export const metadata: Metadata = {
  metadataBase: new URL("https://casablancasofas.com"),
  title: "Mallikarjuna Furniture World | Premium Furniture & Living Solutions",
  description:
    "Explore luxury sofas, dining tables, cots, curtains, and mattresses at Mallikarjuna Furniture World. Browse our collection and enquire on WhatsApp.",
  keywords: [
    "Mallikarjuna Furniture World",
    "Luxury sofas",
    "Motorized recliners",
    "Teak wood beds",
    "Marble dining tables",
    "Curtains and blinds",
    "Premium furniture solutions",
  ],
  openGraph: {
    title: "Mallikarjuna Furniture World | Premium Furniture & Living Solutions",
    description:
      "Explore luxury sofas, dining tables, cots, curtains, and mattresses at Mallikarjuna Furniture World.",
    url: "https://casablancasofas.com",
    siteName: "Mallikarjuna Furniture World",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Mallikarjuna Furniture World Kurnool Luxury Living Room",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mallikarjuna Furniture World | Premium Furniture & Living Solutions",
    description:
      "Explore luxury sofas, motorized recliners, solid teakwood beds and Italian marble dining suites at Mallikarjuna Furniture World.",
    images: ["/og.jpg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Products and categories from the admin (cached until an admin saves), for every page and the header.
  // The inquiry popup's text and photos come from Admin → Inquiry popup.
  const [catalog, content] = await Promise.all([getCatalog(), getSiteContent()]);

  // LocalBusiness structured data for Kurnool Local SEO (Section 8 Brief)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: SHOWROOM_INFO.brandName,
    alternateName: "Mallikarjuna Furniture World Kurnool",
    image: "https://casablancasofas.com/og.jpg",
    logo: "https://casablancasofas.com/images/mallikarjuna-logo.png",
    telephone: SHOWROOM_INFO.phone,
    email: SHOWROOM_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "980-B1, Sanjeevaiah Circle, D.No. 87, near Nandyal Check Post, Valmiki Nagar, Madhavi Nagar, Kalluru",
      addressLocality: "Kurnool",
      addressRegion: "Andhra Pradesh",
      postalCode: "518002",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 15.8281,
      longitude: 78.0373,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "21:00",
      },
    ],
    priceRange: "₹₹₹",
    url: "https://casablancasofas.com",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Suspense: reading the pathname must not block prerendering of dynamic routes */}
        <Suspense fallback={null}>
          <StorefrontOnly>
            <SmoothScroll />
          </StorefrontOnly>
        </Suspense>
        <CatalogProvider value={catalog}>
          {children}
          <Suspense fallback={null}>
            <StorefrontOnly>
              <AutoInquiryPopup content={content.inquiryPopup} />
            </StorefrontOnly>
          </Suspense>
        </CatalogProvider>
      </body>
    </html>
  );
}
