"use client";

import { useRef } from "react";
import { useSiteContent } from "@/lib/site-content/context";

const initials = (name: string) =>
  name
    .replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/i, "")
    .split(/\s+|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// Reviews are edited in Admin → Homepage sections → Testimonials
export const Testimonials: React.FC = () => {
  const { testimonials } = useSiteContent();
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    track?.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 20), behavior: "smooth" });
  };

  return (
    <section className="tm" aria-labelledby="tm-heading">
      <h2 id="tm-heading" className="tm-heading">
        {testimonials.heading}
      </h2>

      <div className="tm-wrap">
        <button type="button" className="audo-side-arrow audo-side-arrow--prev tm-arrow" onClick={() => scroll(-1)} aria-label="Previous reviews">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div ref={trackRef} className="tm-track" data-lenis-prevent-horizontal>
          {testimonials.items.map((t, i) => (
            <article key={i} className="tm-card">
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
