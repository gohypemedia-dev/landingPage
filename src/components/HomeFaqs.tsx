"use client";

import { useState } from "react";
import { useSiteContent } from "@/lib/site-content/context";

// Questions are edited in Admin → Homepage sections → FAQs
export const HomeFaqs: React.FC = () => {
  const { faqs } = useSiteContent();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="hf" aria-labelledby="hf-heading">
      <h2 id="hf-heading" className="tm-heading">
        {faqs.heading}
      </h2>

      <div className="hf-list">
        {faqs.items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={`hf-item${isOpen ? " is-open" : ""}`}>
              <h3>
                <button
                  type="button"
                  className="hf-q"
                  aria-expanded={isOpen}
                  aria-controls={`hf-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{f.question}</span>
                  <span className="hf-icon" aria-hidden="true" />
                </button>
              </h3>
              {/* Height animates via grid rows 0fr → 1fr; the text fades and slides in as it opens */}
              <div id={`hf-a-${i}`} className="hf-a" role="region" aria-hidden={!isOpen}>
                <div className="hf-a-inner">
                  <p>{f.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
