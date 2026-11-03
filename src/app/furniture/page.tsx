import type { Metadata } from "next";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "New Arrivals | All Furniture in Kurnool — Casablanca Sofas",
  description:
    "Explore the complete catalogue of luxury living room, bedroom, and dining furniture at Casablanca Sofas in Kurnool. 15-year Burma teakwood guarantee.",
};

// "New Arrivals" in the navbar: every product, newest first
export default function AllFurniturePage() {
  const newestFirst = [...PRODUCTS].sort((a, b) => b.year - a.year);

  return (
    <CategoryLandingTemplate
      categorySlug="furniture"
      categoryName="New Arrivals"
      subheading="CATALOGUE · THE COMPLETE ARCHIVE"
      heading="Discover Furniture for Every Room"
      introduction="Explore our comprehensive collection of handcrafted Burma teakwood beds, cloud-comfort sofas, motorized zero-gravity recliners, and monolithic Italian marble dining suites. Every creation is backed by genuine warranties and personalized showroom assistance in Kurnool."
      categoryTiles={[]}
      products={newestFirst}
    />
  );
}
