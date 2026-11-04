import type { Metadata } from "next";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";

export const metadata: Metadata = {
  title: "Motorized Recliners in Kurnool | Zero Gravity & Leather Loungers — Mallikarjuna Furniture World",
  description:
    "Explore motorized recliners and zero-gravity loungers in Kurnool at Mallikarjuna Furniture World. German OKIN motors, USB charging ports, and breathable leatherette with 5-year mechanism warranty.",
};

export default function ReclinersKurnoolPage() {
  const reclinerTiles = [
    {
      title: "Olive Leather Motorized Suite",
      countText: "German OKIN Zero-Gravity Linear Actuator",
      image: "/images/678579352_122102739512690441_8609336410938895823_n.jpg",
      tag: "Showroom Feature",
    },
  ];

  const faqs = [
    {
      question: "What motor is used in your motorized recliners?",
      answer:
        "We exclusively use original German OKIN heavy-duty linear actuator motors known for their whisper-quiet operation (under 45 dB), smooth zero-gravity lift, and 25,000-cycle certified longevity.",
    },
    {
      question: "Are these recliners suitable for elderly family members or patients with back pain?",
      answer:
        "Yes! Our zero-gravity models elevate the feet above the heart level, reducing spinal disc pressure and improving cardiovascular circulation. Many Kurnool doctors recommend our recliners for lumbar decompression.",
    },
  ];

  return (
    <CategoryLandingTemplate
      categorySlug="recliners-kurnool"
      categoryName="Recliners & Loungers"
      subheading="RECLINERS · MOTORIZED & ERGONOMIC COLLECTION"
      heading="Discover Motorized Recliners for Pure Relaxation"
      introduction="Experience the soothing relief of zero-gravity positioning, whisper-quiet German OKIN actuators, and integrated fast-charging ports. Tested for endurance in Andhra Pradesh's warm climate with breathable air-leatherette."
      filterCategoryKey="recliners"
      categoryTiles={reclinerTiles}
      seoFaqs={faqs}
    />
  );
}
