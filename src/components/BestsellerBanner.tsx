"use client";

import Image from "next/image";
import type { SiteContent } from "@/lib/site-content/schema";

// Slides are edited in Admin → Homepage sections → Promo slides
type BestsellerSlide = SiteContent["promoSlides"]["slides"][number];

// One dark editorial slide; the arrows and autoplay come from PromoCarousel.
export const BestsellerBanner: React.FC<{ slide: BestsellerSlide; priority?: boolean }> = ({ slide, priority }) => (
  <section className="bsb" aria-label={slide.label}>
    <div className="bsb-media bsb-media--left">
      <Image src={slide.left.src} alt={slide.left.alt} fill sizes="45vw" style={{ objectFit: "cover" }} priority={priority} />
    </div>
    <div className="bsb-media bsb-media--right">
      <Image src={slide.right.src} alt={slide.right.alt} fill sizes="45vw" style={{ objectFit: "cover" }} />
    </div>

    <a href={slide.href} className="bsb-copy">
      <span className="bsb-rule" aria-hidden="true" />
      <h2>
        {slide.titleLine1}
        <br />
        {slide.titleLine2}
      </h2>
    </a>
  </section>
);
