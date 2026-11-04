import type { Metadata } from "next";
import Link from "next/link";
import { SHOWROOM_INFO } from "@/data/products";
import { InfoPage } from "@/components/shop/InfoPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | Mallikarjuna Furniture World Kurnool",
  description: "Terms for using the Mallikarjuna Furniture World website and buying furniture from our Kurnool showroom.",
};

// DRAFT: review with a legal advisor and fill in the [bracketed] details before publishing.
export default function TermsPage() {
  return (
    <InfoPage title="Terms & Conditions" updated="3 November 2026">
      <p>
        This website is operated by [registered business name], trading as {SHOWROOM_INFO.brandName}, {SHOWROOM_INFO.address}
        {" "}(GSTIN: [GSTIN]). By using this website you agree to these terms.
      </p>

      <h2>Enquiries, not online orders</h2>
      <p>
        This website shows our furniture and lets you send enquiries. No order is placed and no payment is taken on the website. An order is confirmed
        only when our team confirms the product, price, delivery date and payment terms with you, and you accept them.
      </p>

      <h2>Prices and offers</h2>
      <ul>
        <li>Prices shown are indicative and may change. The final price is the one confirmed by our team at the time of order.</li>
        <li>Offers, coupon codes and No Cost EMI are subject to their own terms, validity dates and bank eligibility.</li>
      </ul>

      <h2>Product images and descriptions</h2>
      <p>
        Colours, wood grain and textures can look different on screens, and natural materials vary from piece to piece. Small differences from the
        photos are not considered defects. Custom sizes and finishes are made to the specifications you confirm.
      </p>

      <h2>Delivery, returns and warranty</h2>
      <p>
        See our <Link href="/delivery-installation">Delivery &amp; Installation</Link> and{" "}
        <Link href="/returns-cancellation">Returns &amp; Cancellation</Link> pages. Warranty terms for each product are shared at the time of purchase and
        on the product page.
      </p>

      <h2>Use of this website</h2>
      <p>
        The content, photos and designs on this website belong to {SHOWROOM_INFO.brandName} or are used with permission, and may not be copied for
        commercial use without our written consent.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Disputes are subject to the jurisdiction of the courts in Kurnool, Andhra Pradesh.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? <Link href="/contact">Contact us</Link>.
      </p>
    </InfoPage>
  );
}
