import type { Metadata } from "next";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";

export const metadata: Metadata = {
  title: "Dining Tables in Kurnool | Italian Marble & Teakwood Dining Sets — Mallikarjuna Furniture World",
  description:
    "Explore 6-seater and 8-seater Italian marble dining tables in Kurnool at Mallikarjuna Furniture World. Anti-stain sealed marble, solid teakwood bases, and ergonomic dining chairs.",
};

export default function DiningTablesKurnoolPage() {
  const diningTiles: any[] = [];

  const faqs = [
    {
      question: "Will Indian curries, turmeric, or lemon juice stain the Italian marble dining table?",
      answer:
        "No. All our natural Italian marble dining tops are sealed with a 3-layer nanotechnology stain-shield that prevents liquids, hot curries, oil, and citrus acids from penetrating the stone pores.",
    },
    {
      question: "Can I customize the dining chairs fabric and wood polish?",
      answer:
        "Yes, our solid teak dining chairs can be polished to honey teak, walnut satin, or smoked dark teak, and upholstered with your choice of stain-resistant velvet or easy-wipe leatherette.",
    },
  ];

  return (
    <CategoryLandingTemplate
      categorySlug="dining-tables-kurnool"
      categoryName="Dining Tables & Chairs"
      subheading="DINING · ITALIAN MARBLE & SOLID TEAKWOOD"
      heading="Discover Dining Suites for Unforgettable Gatherings"
      introduction="The dining table is the emotional heartbeat of the Indian home. Our monolithic Italian Onyx marble tops and solid teak pedestals are engineered for generous legroom, effortless cleaning, and timeless elegance."
      filterCategoryKey="dining"
      categoryTiles={diningTiles}
      seoFaqs={faqs}
    />
  );
}
