import type { Metadata } from "next";
import { ShowroomPageClient } from "@/components/ShowroomPageClient";

export const metadata: Metadata = {
  title: "Visit Our Furniture Showroom in Kurnool | Nandyal Check Post — Mallikarjuna Furniture World",
  description:
    "Visit Mallikarjuna Furniture World's 15,000+ sq. ft. multi-floor luxury furniture showroom near Nandyal Check Post, Kurnool. Explore sofas, recliners, teakwood beds & marble dining suites in person.",
};

export default function FurnitureShowroomKurnoolPage() {
  return <ShowroomPageClient />;
}
