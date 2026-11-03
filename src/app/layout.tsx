import type { Metadata } from "next";
import "./globals.css";
import { SHOWROOM_INFO } from "@/data/products";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AutoInquiryPopup } from "@/components/AutoInquiryPopup";

export const metadata: Metadata = {
  metadataBase: new URL("https://casablancasofas.com"),
  title: "Casablanca Sofas | Premium Furniture & Living Solutions",
  description:
    "Explore luxury sofas, dining tables, cots, curtains, and mattresses at Casablanca Sofas. Browse our collection and enquire on WhatsApp.",
  keywords: [
    "Casablanca Sofas",
    "Luxury sofas",
    "Motorized recliners",
    "Teak wood beds",
    "Marble dining tables",
    "Curtains and blinds",
    "Premium furniture solutions",
  ],
  openGraph: {
    title: "Casablanca Sofas | Premium Furniture & Living Solutions",
    description:
      "Explore luxury sofas, dining tables, cots, curtains, and mattresses at Casablanca Sofas.",
    url: "https://casablancasofas.com",
    siteName: "Casablanca Sofas",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Casablanca Sofas Kurnool Luxury Living Room",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casablanca Sofas | Premium Furniture & Living Solutions",
    description:
      "Explore luxury sofas, motorized recliners, solid teakwood beds and Italian marble dining suites at Casablanca Sofas.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // LocalBusiness structured data for Kurnool Local SEO (Section 8 Brief)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: SHOWROOM_INFO.brandName,
    alternateName: "Casablanca Sofas Kurnool",
    image: "https://casablancasofas.com/og.jpg",
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
        <SmoothScroll />
        {children}
        <AutoInquiryPopup />
      </body>
    </html>
  );
}
