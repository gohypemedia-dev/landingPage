import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/shop/InfoPage";

export const metadata: Metadata = {
  title: "Returns & Cancellation | Casablanca Sofas Kurnool",
  description: "Cancellation, return and replacement policy for furniture bought from Casablanca Sofas, Kurnool.",
};

// DRAFT: confirm time limits and refund terms with the store before publishing.
export default function ReturnsPage() {
  return (
    <InfoPage title="Returns & Cancellation" updated="3 November 2026">
      <h2>Damaged or wrong item</h2>
      <p>
        If a piece arrives damaged, defective or different from what you ordered, tell us at delivery or within [48 hours] with photos. We will repair
        or replace it, or arrange a refund if a replacement is not possible.
      </p>

      <h2>Change of mind</h2>
      <p>
        Because furniture is large and often made or finished to order, we do not accept returns for a change of mind once a piece has been delivered.
        We encourage you to see and try pieces at our showroom before ordering.
      </p>

      <h2>Cancelling an order</h2>
      <ul>
        <li>In-stock pieces: you can cancel before dispatch. [Refund terms for any advance paid.]</li>
        <li>Custom or made-to-order pieces: once production has started, the order cannot be cancelled. [Advance payment terms.]</li>
      </ul>

      <h2>Refunds</h2>
      <p>Approved refunds are paid back to the original payment method within [X] working days.</p>

      <h2>Warranty claims</h2>
      <p>Manufacturing defects covered by warranty are repaired or replaced as per the warranty terms shared at purchase.</p>

      <h2>Need help?</h2>
      <p>
        <Link href="/contact">Contact us</Link> with your order details and photos, and our team will help.
      </p>
    </InfoPage>
  );
}
