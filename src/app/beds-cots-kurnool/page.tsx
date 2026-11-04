import type { Metadata } from "next";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";

export const metadata: Metadata = {
  title: "Teakwood Beds & Cots in Kurnool | King Size Hydraulic Beds — Mallikarjuna Furniture World",
  description:
    "Handcrafted solid Burma teakwood beds and cots in Kurnool at Mallikarjuna Furniture World. German hydraulic storage, upholstered headboards, and 15-year termite guarantee.",
};

export default function BedsCotsKurnoolPage() {
  const bedTiles: any[] = [];

  const faqs = [
    {
      question: "Is the wood 100% solid teakwood or veneer/MDF?",
      answer:
        "Every cot in our Heritage collection is built with genuine mature Burma Teakwood with zero MDF or particle board. We provide a stamped 15-year termite and borer proof certificate with every purchase.",
    },
    {
      question: "How easy is it to lift the hydraulic storage bed?",
      answer:
        "Effortless! We install German gas-spring hydraulic pistons with 150 kg lifting capacity, so anyone can lift the king mattress with just one hand to access 1,100+ liters of storage.",
    },
  ];

  return (
    <CategoryLandingTemplate
      categorySlug="beds-cots-kurnool"
      categoryName="Beds, Cots & Mattresses"
      subheading="BEDROOM · HEIRLOOM TEAKWOOD & HYDRAULIC BEDS"
      heading="Discover Handcrafted Beds for Restorative Sleep"
      introduction="Built from seasoned Grade-A Burma teakwood to endure generations. Featuring architectural fluted headboards, effortless German gas-lift storage, and orthopedic mattress compatibility."
      filterCategoryKey="beds"
      categoryTiles={bedTiles}
      seoFaqs={faqs}
    />
  );
}
