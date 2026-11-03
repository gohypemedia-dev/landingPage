import type { Metadata } from "next";
import { SHOWROOM_INFO } from "@/data/products";
import { InfoPage } from "@/components/shop/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Casablanca Sofas Kurnool",
  description: "How Casablanca Sofas collects, uses and protects the personal information you share with us.",
};

// DRAFT: review with a legal advisor and fill in the [bracketed] details before publishing.
export default function PrivacyPolicyPage() {
  return (
    <InfoPage title="Privacy Policy" updated="3 November 2026">
      <p>
        This policy explains how {SHOWROOM_INFO.brandName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information when you use this website or contact
        us. We follow the Digital Personal Data Protection Act, 2023 and other applicable Indian laws.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Details you share in an enquiry: your name, phone number, and the products, sizes or finishes you are interested in.</li>
        <li>Messages you send us on WhatsApp, phone or email.</li>
        <li>Delivery details (address and contact number) if you place an order with us.</li>
        <li>Your email address, if you join our newsletter. We use it only to send offers and updates, and you can ask us to remove it at any time.</li>
      </ul>
      <p>
        This website does not ask you to create an account and does not take payments online. Items you add to your Inquiry List or shortlist stay in your
        browser and are not sent to us until you choose to send an enquiry.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your enquiry and share prices, availability and product details.</li>
        <li>To arrange showroom visits, delivery and installation.</li>
        <li>To provide after-sales service and handle warranty requests.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>WhatsApp and other services</h2>
      <p>
        Enquiry buttons on this site open WhatsApp with a pre-filled message. Messages sent through WhatsApp are also handled under WhatsApp&rsquo;s own privacy
        policy. Maps on this site are provided by Google Maps.
      </p>

      <h2>How long we keep it</h2>
      <p>We keep enquiry and order details only as long as needed for the purposes above, and for any period required by tax or other laws.</p>

      <h2>Your rights</h2>
      <p>
        You can ask us to access, correct or delete your personal information, or withdraw consent to being contacted, by writing to the contact below.
      </p>

      <h2>Contact for privacy questions</h2>
      <p>
        [Name of grievance officer]
        <br />
        {SHOWROOM_INFO.brandName}, {SHOWROOM_INFO.address}
        <br />
        Email: <a href={`mailto:${SHOWROOM_INFO.email}`}>{SHOWROOM_INFO.email}</a> · Phone: {SHOWROOM_INFO.displayPhone}
      </p>
    </InfoPage>
  );
}
