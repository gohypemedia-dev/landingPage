import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/shop/InfoPage";

export const metadata: Metadata = {
  title: "Delivery & Installation | Casablanca Sofas Kurnool",
  description: "Delivery areas, timelines and installation for furniture from Casablanca Sofas, Kurnool.",
};

// DRAFT: confirm areas, charges and timelines with the store before publishing.
export default function DeliveryPage() {
  return (
    <InfoPage title="Delivery & Installation" updated="3 November 2026">
      <h2>Where we deliver</h2>
      <p>
        We deliver across Kurnool and nearby towns in Rayalaseema. For other locations, send us your pincode and we will confirm whether we can deliver
        and any charges.
      </p>

      <h2>Delivery time</h2>
      <ul>
        <li>Pieces in stock at the showroom: usually within [X] days of order confirmation.</li>
        <li>Made-to-order and custom pieces: the timeline is confirmed with you when you order.</li>
      </ul>
      <p>We will call you before delivery to agree a convenient date and time.</p>

      <h2>Charges</h2>
      <p>[Free delivery within Kurnool city / charges for other areas]. Any charges are confirmed before your order is final.</p>

      <h2>Installation</h2>
      <p>
        Our team unpacks, assembles and places the furniture in your room, and takes away the packaging. Please make sure doorways, stairs and lifts
        have enough space for large pieces; let us know in advance if access is tight.
      </p>

      <h2>At delivery</h2>
      <p>
        Please check the furniture when it is delivered and tell our team straight away about any damage or missing parts. See{" "}
        <Link href="/returns-cancellation">Returns &amp; Cancellation</Link> for what happens next.
      </p>
    </InfoPage>
  );
}
