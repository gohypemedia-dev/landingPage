"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteContent } from "@/lib/site-content/context";

// Columns and discounts are edited in Admin → Homepage sections → Add-On sale
export const AddOnSaleBanner: React.FC = () => {
  const { addOnSale } = useSiteContent();
  return (
  <section className="aos" aria-labelledby="aos-heading">
    <div className="aos-brand">
      <h2 id="aos-heading">
        <span>{addOnSale.headingTop}</span>
        <em>{addOnSale.headingAccent}</em>
      </h2>
      <p>{addOnSale.subtitle}</p>
    </div>

    <div className="aos-grid">
      {addOnSale.columns.map((c, i) => (
        <Link key={i} href={c.href} className="aos-col">
          <span className="aos-shop">
            Shop
            {c.tags.map((t, k) => (
              <b key={k}>{t}</b>
            ))}
          </span>
          <span className="aos-hero">
            <Image src={c.image.src} alt={c.image.alt} fill sizes="(max-width: 640px) 50vw, 20vw" style={{ objectFit: "cover" }} />
          </span>
          <span className="aos-addon">
            <span className="aos-addon-img">
              <Image src={c.addOnImage.src} alt={c.addOnImage.alt} fill sizes="80px" style={{ objectFit: "cover" }} />
            </span>
            <span className="aos-addon-text">
              <small>Get</small>
              <strong>
                {c.discount} <i>Off</i>
              </strong>
              <span>{c.addOnLabel}</span>
            </span>
          </span>
        </Link>
      ))}
    </div>
  </section>
  );
};
