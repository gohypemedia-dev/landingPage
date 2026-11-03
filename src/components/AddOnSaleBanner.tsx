"use client";

import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    tags: ["Sofa", "Recliner"],
    href: "/sofas-kurnool",
    image: { src: "/images/mf-signature-curved-living.jpg", alt: "Sofa and recliner set" },
    addOn: { label: "On Coffee Table", src: "/images/plinth-table.jpg", alt: "Coffee table" },
  },
  {
    tags: ["Dining"],
    href: "/dining-tables-kurnool",
    image: { src: "/images/dining-space.jpg", alt: "Dining table set" },
    addOn: { label: "On Side Board & Crockery Unit", src: "/images/mf-showroom-gallery-wood.jpg", alt: "Wooden crockery unit" },
  },
  {
    tags: ["Bed"],
    href: "/beds-cots-kurnool",
    image: { src: "/images/796767853_18093958568640692_8492671734547745348_n.webp", alt: "Wooden bed" },
    addOn: { label: "On Mattress, Bedside Table or Wardrobe", src: "/images/bedroom-space.jpg", alt: "Mattress and bedside table" },
  },
  {
    tags: ["Curtains"],
    href: "/curtains-blinds-kurnool",
    image: { src: "/images/banner-living.jpg", alt: "Living room curtains" },
    addOn: { label: "On Decor & Lamps", src: "/images/hashira-lamp.jpg", alt: "Designer lamp" },
  },
];

export const AddOnSaleBanner: React.FC = () => (
  <section className="aos" aria-labelledby="aos-heading">
    <div className="aos-brand">
      <h2 id="aos-heading">
        <span>Add-On</span>
        <em>Sale</em>
      </h2>
      <p>Buy the hero piece, save on what completes the room.</p>
    </div>

    <div className="aos-grid">
      {columns.map((c) => (
        <Link key={c.href} href={c.href} className="aos-col">
          <span className="aos-shop">
            Shop
            {c.tags.map((t) => (
              <b key={t}>{t}</b>
            ))}
          </span>
          <span className="aos-hero">
            <Image src={c.image.src} alt={c.image.alt} fill sizes="(max-width: 640px) 50vw, 20vw" style={{ objectFit: "cover" }} />
          </span>
          <span className="aos-addon">
            <span className="aos-addon-img">
              <Image src={c.addOn.src} alt={c.addOn.alt} fill sizes="80px" style={{ objectFit: "cover" }} />
            </span>
            <span className="aos-addon-text">
              <small>Get</small>
              <strong>
                10% <i>Off</i>
              </strong>
              <span>{c.addOn.label}</span>
            </span>
          </span>
        </Link>
      ))}
    </div>
  </section>
);
