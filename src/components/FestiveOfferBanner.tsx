"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const offers = [
  {
    seal: ["Pay", "₹5,000"],
    title: "Get Power Lift Recliner",
    worth: "₹35,000",
    note: "*On purchase of ₹1,50,000",
    image: { src: "/images/catalogue-recliner-featured.jpg", alt: "Power lift recliner" },
  },
  {
    seal: ["Get", "Free"],
    title: "Marble Coffee Table",
    worth: "₹6,500",
    note: "*On purchase of ₹1,00,000",
    image: { src: "/images/plinth-table.jpg", alt: "Marble coffee table" },
  },
];

const perks = ["Free Delivery", "Free Installation", "Easy EMI"];

const Diya = () => (
  <svg viewBox="0 0 64 48" aria-hidden="true">
    <path d="M32 4c4 6 6 10 6 13a6 6 0 0 1-12 0c0-3 2-7 6-13Z" fill="#F6C453" />
    <path d="M32 11c2 3 3 5 3 6.5a3 3 0 0 1-6 0c0-1.5 1-3.5 3-6.5Z" fill="#FFF3C4" />
    <path d="M4 28h56c-2 10-13 16-28 16S6 38 4 28Z" fill="#C5A45D" />
    <path d="M4 28h56c-.5 2-1.4 3.8-2.6 5.4H6.6C5.4 31.8 4.5 30 4 28Z" fill="#E6CB86" />
  </svg>
);

export const FestiveOfferBanner: React.FC = () => (
  <section className="fob" aria-labelledby="fob-heading">
    <motion.div
      className="fob-brand"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <span className="fob-celebrating">Celebrating</span>
      <h2 id="fob-heading">Diwali</h2>
      <span className="fob-sale">Festive Sale</span>
      <span className="fob-diyas">
        <Diya />
        <Diya />
        <Diya />
      </span>
    </motion.div>

    <div className="fob-offers">
      <p className="fob-tagline">
        Deals that shine <strong>brighter than the diyas!</strong>
      </p>
      <div className="fob-panel">
        {offers.map((o, i) => (
          <motion.article
            key={o.title}
            className="fob-offer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: EASE }}
          >
            <div className="fob-offer-text">
              <span className="fob-seal">
                <b>{o.seal[0]}</b>
                <small>{o.seal[1]}</small>
              </span>
              <span className="fob-offer-title">{o.title}</span>
              <span className="fob-worth">
                <small>Worth</small>
                {o.worth}
              </span>
              <span className="fob-note">{o.note}</span>
            </div>
            <span className="fob-offer-img">
              <Image src={o.image.src} alt={o.image.alt} fill sizes="160px" style={{ objectFit: "cover" }} />
            </span>
          </motion.article>
        ))}
      </div>
    </div>

    <div className="fob-media">
      <Image
        src="/images/mf-fluted-luxury-lounge.jpg"
        alt="Luxury lounge seating"
        fill
        sizes="(max-width: 1060px) 100vw, 28vw"
        style={{ objectFit: "cover" }}
      />
      <ul className="fob-perks">
        {perks.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <span className="fob-tnc">*T&amp;C Apply</span>
    </div>
  </section>
);
