import type { Metadata } from "next";
import { OffersPageClient } from "@/components/OffersPageClient";

export const metadata: Metadata = {
  title: "Current Furniture Offers & Wedding Packages in Kurnool — Mallikarjuna Furniture World",
  description:
    "Explore festive home packages, recliner exchange offers, and 0% EMI finance at Mallikarjuna Furniture World in Kurnool. Save up to ₹46,000 on full 3BHK teakwood furniture suites.",
};

export default function OffersPage() {
  return <OffersPageClient />;
}
