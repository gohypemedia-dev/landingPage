import type { Metadata } from "next";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";

export const metadata: Metadata = {
  title: "Curtains & Blinds in Kurnool | Motorized Blackout Drapes & Sheer Linens — Mallikarjuna Furniture World",
  description:
    "Tailored motorized blackout curtains and architectural blinds in Kurnool at Mallikarjuna Furniture World. Free in-home measurement and installation across Kurnool town.",
};

export default function CurtainsBlindsKurnoolPage() {
  const curtainTiles: any[] = [];

  const faqs = [
    {
      question: "Do you provide free in-home measurement in Kurnool?",
      answer:
        "Yes! Our drapery specialist visits your home with full fabric swatch catalogues, measures your windows with precision laser gauges, and gives a quotation on the spot.",
    },
    {
      question: "How long does custom stitching and installation take?",
      answer:
        "Standard orders are professionally fabricated, steam-pressed, and installed in your home within 5 to 7 business days.",
    },
  ];

  return (
    <CategoryLandingTemplate
      categorySlug="curtains-blinds-kurnool"
      categoryName="Curtains & Blinds"
      subheading="SOFT FURNISHINGS · MOTORIZED DRAPES & BLINDS"
      heading="Discover Bespoke Window Treatments for Every Room"
      introduction="Transform the light and acoustics of your sanctuary with heavy triple-weave blackout drapes, motorized silent tracks, and sheer linens. Keep your rooms cool and peaceful through the Andhra summers."
      filterCategoryKey="curtains"
      categoryTiles={curtainTiles}
      seoFaqs={faqs}
    />
  );
}
