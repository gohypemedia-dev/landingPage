import type { Metadata } from "next";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";
import { getCategoryProducts } from "@/data/categories";

export const metadata: Metadata = {
  title: "Orthopedic Mattresses in Kurnool | Pocket Spring & Latex — Casablanca Sofas",
  description:
    "Explore orthopedic pocket-spring and natural latex mattresses in Kurnool at Casablanca Sofas. 10-year replacement warranty and 100-night trial.",
};

export default function MattressesKurnoolPage() {
  const tiles: any[] = [];

  return (
    <CategoryLandingTemplate
      categorySlug="mattresses-kurnool"
      categoryName="Mattresses & Spine Care"
      subheading="BEDROOM · ORTHOPEDIC SLEEP SYSTEMS"
      heading="Discover Mattresses Engineered for Spine Alignment"
      introduction="Experience deep, restorative sleep free from partner motion disturbance. Our orthopedic sleep systems combine high-tensile carbon pocket springs with natural breathable latex layers to support your spine naturally."
      categoryTiles={tiles}
      products={getCategoryProducts("mattresses")}
      heroImage="/images/bedroom-space.jpg"
    />
  );
}
