import type { Metadata } from "next";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";
import { categoryProducts } from "@/lib/catalog/queries";
import { getCatalog } from "@/lib/server/catalog";

export const metadata: Metadata = {
  title: "Orthopedic Mattresses in Kurnool | Pocket Spring & Latex — Mallikarjuna Furniture World",
  description:
    "Explore orthopedic pocket-spring and natural latex mattresses in Kurnool at Mallikarjuna Furniture World. 10-year replacement warranty and 100-night trial.",
};

export default async function MattressesKurnoolPage() {
  const tiles: any[] = [];

  return (
    <CategoryLandingTemplate
      categorySlug="mattresses-kurnool"
      categoryName="Mattresses & Spine Care"
      subheading="BEDROOM · ORTHOPEDIC SLEEP SYSTEMS"
      heading="Discover Mattresses Engineered for Spine Alignment"
      introduction="Experience deep, restorative sleep free from partner motion disturbance. Our orthopedic sleep systems combine high-tensile carbon pocket springs with natural breathable latex layers to support your spine naturally."
      categoryTiles={tiles}
      products={categoryProducts(await getCatalog(), "mattresses")}
    />
  );
}
