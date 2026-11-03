import type { Metadata } from "next";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";

export const metadata: Metadata = {
  title: "Sofas in Kurnool | Luxury 3-Seater, Sectionals & L-Shape Couches — Casablanca Sofas",
  description:
    "Discover luxury sofas in Kurnool at Casablanca Sofas. 3-seater sofas, L-shaped sectionals, curved modular couches and chesterfields with 15-year teakwood warranty.",
};

export default function SofasKurnoolPage() {
  const sofaTiles: any[] = [];

  const faqs = [
    {
      question: "Can I customize the sofa size and fabric colour for my living room in Kurnool?",
      answer:
        "Yes, absolutely. At Casablanca Sofas, every sofa can be custom-scaled to your exact room dimensions. You can select from over 120+ stain-resistant European fabrics, bouclés, and genuine Italian leathers at our Kurnool showroom.",
    },
    {
      question: "What is the warranty on sofas purchased from Casablanca Sofas?",
      answer:
        "We offer a 15-year written warranty on our seasoned Grade-A Burma teakwood internal frames against termites and structural defects, along with a 5-year cushion sag warranty on high-density cold-cure foam.",
    },
    {
      question: "Do you offer free delivery and setup in Kurnool?",
      answer:
        "Yes. We provide white-glove delivery, careful unboxing, and in-room positioning across Kurnool town, Nandyal, Dhone, and surrounding Rayalaseema districts.",
    },
  ];

  return (
    <CategoryLandingTemplate
      categorySlug="sofas-kurnool"
      categoryName="Sofas & Couches"
      subheading="SOFAS · LUXURY LIVING ROOM COLLECTION"
      heading="Discover Sofas for Every Living Space"
      introduction="From intimate 2-seaters to grand curved sectionals, our sofa collection marries architectural poise with cloud-like seating depth. Experience authentic Burma teak framing, anti-sag springs, and stain-shield fabrics designed for modern Kurnool living."
      filterCategoryKey="sofas"
      categoryTiles={sofaTiles}
      seoFaqs={faqs}
    />
  );
}
