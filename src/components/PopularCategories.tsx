"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCatalog } from "@/lib/catalog/context";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content/defaults";
import { useSiteContent } from "@/lib/site-content/context";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Circles are edited in Admin → Homepage sections → Popular categories,
// falling back to live category photos from Admin → Categories when not overridden.
export const PopularCategories: React.FC = () => {
  const { popularCategories } = useSiteContent();
  const catalog = useCatalog();
  const categoryImageByHref = new Map(catalog.categories.map((cat) => [cat.href, cat.image]));
  const defaultImageByHref = new Map(
    DEFAULT_SITE_CONTENT.popularCategories.items.map((item) => [item.href, item.image]),
  );

  return (
  <section className="pc-section" aria-labelledby="pc-heading">
    <motion.h2
      id="pc-heading"
      className="pc-heading"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {popularCategories.heading}
    </motion.h2>

    <ul className="pc-grid">
      {popularCategories.items.map((c, i) => {
        const defaultImage = defaultImageByHref.get(c.href);
        const catalogImage = categoryImageByHref.get(c.href);
        const imageSrc =
          catalogImage && (!defaultImage || c.image === defaultImage) ? catalogImage : c.image;
        return (
        <motion.li
          key={i}
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
        >
          <Link href={c.href} className="pc-item">
            <span className="pc-circle">
              <Image src={imageSrc} alt={c.label} fill sizes="(max-width: 640px) 30vw, 200px" style={{ objectFit: "cover" }} />
            </span>
            <span className="pc-label">{c.label}</span>
          </Link>
        </motion.li>
        );
      })}
    </ul>
  </section>
  );
};
