"use client";

import Image from "next/image";

export const bestsellerSlides = [
  {
    title: ["Pieces Everyone’s", "Bringing Home"],
    cta: "Shop Bestsellers",
    href: "/collections/best-sellers",
    left: { src: "/images/catalogue-recliner-featured.jpg", alt: "Recliner sofa in a warm living room" },
    right: { src: "/images/bedroom-space.jpg", alt: "Wooden bed with premium linen" },
  },
];

type BestsellerSlide = (typeof bestsellerSlides)[number];

// One dark editorial slide; the arrows and autoplay come from PromoCarousel.
export const BestsellerBanner: React.FC<{ slide: BestsellerSlide; priority?: boolean }> = ({ slide, priority }) => (
  <section className="bsb" aria-label={slide.cta}>
    <div className="bsb-media bsb-media--left">
      <Image src={slide.left.src} alt={slide.left.alt} fill sizes="45vw" style={{ objectFit: "cover" }} priority={priority} />
    </div>
    <div className="bsb-media bsb-media--right">
      <Image src={slide.right.src} alt={slide.right.alt} fill sizes="45vw" style={{ objectFit: "cover" }} />
    </div>

    <a href={slide.href} className="bsb-copy">
      <span className="bsb-rule" aria-hidden="true" />
      <h2>
        {slide.title[0]}
        <br />
        {slide.title[1]}
      </h2>
    </a>
  </section>
);
