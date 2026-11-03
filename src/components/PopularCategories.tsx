"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SHOP_CATEGORIES } from "@/data/categories";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Same list as the Shop menu; each circle opens its own category page
const categories = SHOP_CATEGORIES.filter((c) => c.inCircles !== false);

export const PopularCategories: React.FC = () => (
  <section className="pc-section" aria-labelledby="pc-heading">
    <motion.h2
      id="pc-heading"
      className="pc-heading"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      Popular Categories
    </motion.h2>

    <ul className="pc-grid">
      {categories.map((c, i) => (
        <motion.li
          key={c.label}
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
        >
          <Link href={c.href} className="pc-item">
            <span className="pc-circle">
              <Image src={c.image} alt={c.label} fill sizes="(max-width: 640px) 30vw, 200px" style={{ objectFit: "cover" }} />
            </span>
            <span className="pc-label">{c.label}</span>
          </Link>
        </motion.li>
      ))}
    </ul>
  </section>
);
