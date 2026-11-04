"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SHOWROOM_INFO } from "@/data/products";

const shopLinks = [
  { label: "Sofas", href: "/sofas-kurnool" },
  { label: "Recliners", href: "/recliners-kurnool" },
  { label: "Beds & Cots", href: "/beds-cots-kurnool" },
  { label: "Dining Sets", href: "/dining-tables-kurnool" },
  { label: "Mattresses", href: "/mattresses-kurnool" },
  { label: "Decor", href: "/category/decor" },
  { label: "Curtains & Blinds", href: "/curtains-blinds-kurnool" },
];

const collectionLinks = [
  { label: "New Arrivals", href: "/furniture" },
  { label: "International Collection", href: "/collections/international-collection" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "Online Exclusive", href: "/collections/online-exclusive" },
  { label: "Offers", href: "/offers" },
  { label: "Our Showroom", href: "/furniture-showroom-kurnool" },
];

const helpLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Delivery & Installation", href: "/delivery-installation" },
  { label: "Returns & Cancellation", href: "/returns-cancellation" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const whatsappUrl = `https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(
  "Hello Mallikarjuna Furniture World Kurnool, I would like to know more about your furniture."
)}`;

// Newsletter sign-up. There is no email service connected yet, so a sign-up is sent to the store on WhatsApp.
// To use Mailchimp / Brevo etc. later, replace the window.open call with a request to that service.
const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (!agree) return setError("Please tick the box to agree to receive emails.");
    setError("");
    const msg = `Hello ${SHOWROOM_INFO.brandName}, please add me to your newsletter and offers list.
Email: ${email}`;
    window.open(`https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setDone(true);
  };

  return (
    <div className="fx-news">
      <div className="fx-news-copy">
        <h4 className="fx-sub">Join Our Newsletter</h4>
        <p>New arrivals, festive offers and showroom events. No spam.</p>
      </div>
      {done ? (
        <p className="fx-news-done">Thank you! Send the WhatsApp message that just opened and we&rsquo;ll add you to the list.</p>
      ) : (
        <form className="fx-news-form" onSubmit={submit} noValidate>
          <div className="fx-news-row">
            <input
              type="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              autoComplete="email"
            />
            <button type="submit">Subscribe</button>
          </div>
          <label className="fx-news-consent">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>
              I agree to receive offer emails from {SHOWROOM_INFO.brandName}. Read our <Link href="/privacy-policy">Privacy Policy</Link>.
            </span>
          </label>
          {error && (
            <p className="fx-news-error" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export const Footer: React.FC = () => (
  <footer className="fx" aria-label="Site footer">
    <div className="fx-brand">
      <Link href="/" aria-label="Mallikarjuna Furniture World - Home">
        <BrandLogo size="xl" inverted />
      </Link>
    </div>

    {/* Large tagline with a slow light sweep across the letters */}
    <p className="fx-shine" aria-label={SHOWROOM_INFO.tagline}>
      <span aria-hidden="true">{SHOWROOM_INFO.tagline}</span>
    </p>

    <div className="fx-cols">
      <nav className="fx-col" aria-label="Shop">
        <h4>Shop</h4>
        <ul>
          {shopLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="fx-col" aria-label="Collections">
        <h4>Collections</h4>
        <ul>
          {collectionLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="fx-col">
        <h4>Follow Us</h4>
        <div className="fx-social">
          <a href={SHOWROOM_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
        </div>

        <h4 className="fx-sub">Showroom Address</h4>
        <address>{SHOWROOM_INFO.address}</address>
        <a href={SHOWROOM_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="fx-inline">
          Get Directions →
        </a>
      </div>

      <div className="fx-col">
        <h4>Get in Touch</h4>
        <p>{SHOWROOM_INFO.timing}</p>
        <a href={`tel:${SHOWROOM_INFO.phone}`} className="fx-phone">
          {SHOWROOM_INFO.displayPhone}
        </a>
        <NewsletterForm />
      </div>
    </div>

    <div className="fx-bottom">
      <span>
        © 2026 <b>{SHOWROOM_INFO.brandName}</b>. All Rights Reserved.
      </span>
      <nav className="fx-legal" aria-label="Help and policies">
        {helpLinks.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  </footer>
);
