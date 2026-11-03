"use client";

import { useRef } from "react";
import { PRODUCTS, REVIEWS } from "@/data/products";
// Placeholder reviews — replace with genuine ones before launch (see src/data/sampleReviews.ts)
import { SAMPLE_REVIEWS } from "@/data/sampleReviews";

const SAMPLE_PRODUCT_IDS = [
  "aurelia-wave-sofa",
  "cloudcomfort-motorized-recliner",
  "serenity-tufted-king-bed",
  "italian-marble-dining-table",
  "bespoke-motorized-curtains",
];

const testimonials = [
  ...REVIEWS.map((r) => ({ id: r.id, author: r.author, product: r.productName, rating: r.rating, comment: r.comment })),
  ...SAMPLE_PRODUCT_IDS.flatMap((id) => {
    const review = SAMPLE_REVIEWS[id]?.[0];
    const product = PRODUCTS.find((p) => p.id === id);
    return review && product ? [{ id: review.id, author: review.author, product: product.name, rating: review.rating, comment: review.comment }] : [];
  }),
];

const initials = (name: string) =>
  name
    .replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/i, "")
    .split(/\s+|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export const Testimonials: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    track?.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 20), behavior: "smooth" });
  };

  return (
    <section className="tm" aria-labelledby="tm-heading">
      <h2 id="tm-heading" className="tm-heading">
        What Our Customers Say
      </h2>

      <div className="tm-wrap">
        <button type="button" className="audo-side-arrow audo-side-arrow--prev tm-arrow" onClick={() => scroll(-1)} aria-label="Previous reviews">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div ref={trackRef} className="tm-track" data-lenis-prevent-horizontal>
          {testimonials.map((t) => (
            <article key={t.id} className="tm-card">
              <span className="tm-avatar" aria-hidden="true">
                {initials(t.author)}
              </span>
              <strong className="tm-name">{t.author}</strong>
              <span className="tm-product">for {t.product}</span>
              <span className="tm-stars" aria-label={`${t.rating} out of 5`}>
                {"★★★★★".slice(0, Math.round(t.rating))}
                <span className="tm-stars-off">{"★★★★★".slice(Math.round(t.rating))}</span>
              </span>
              <p className="tm-quote">“{t.comment}”</p>
            </article>
          ))}
        </div>

        <button type="button" className="audo-side-arrow audo-side-arrow--next tm-arrow" onClick={() => scroll(1)} aria-label="Next reviews">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
};
