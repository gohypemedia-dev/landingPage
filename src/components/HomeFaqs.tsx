"use client";

import { useState } from "react";
import { SHOWROOM_INFO } from "@/data/products";

const faqs = [
  {
    q: "How do I buy a product from the website?",
    a: "Add the pieces you like to your Inquiry List, or tap Inquiry on any product. Our team will confirm the price, finish, size and delivery date with you on WhatsApp before anything is finalised.",
  },
  {
    q: "Can I see the furniture before buying?",
    a: `Yes. Most designs are on display at our Kurnool showroom, open ${SHOWROOM_INFO.timing}. You can sit on the sofas, try the recliners and check fabrics and wood finishes in person.`,
  },
  {
    q: "Can I customise the size, fabric or colour?",
    a: "Yes. Most sofas, beds and dining sets can be made in different sizes, fabrics, leatherettes and wood finishes. Share your room size and preferences on WhatsApp and we will suggest the best options.",
  },
  {
    q: "Do you deliver and install the furniture?",
    a: "Yes. We deliver and install across Kurnool and nearby towns in Rayalaseema. For other locations, message us with your pincode and we will confirm delivery charges and timelines.",
  },
  {
    q: "Is No Cost EMI available?",
    a: "Yes. No Cost EMI for 3 and 6 months is available on select bank cards for purchases of ₹5,000 and above. Terms and conditions apply; our team will share the eligible banks when you enquire.",
  },
  {
    q: "What warranty do I get?",
    a: "Warranty depends on the product and is listed on each product page under More Information. Our solid teakwood frames come with a 15-year frame warranty.",
  },
];

export const HomeFaqs: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="hf" aria-labelledby="hf-heading">
      <h2 id="hf-heading" className="tm-heading">
        Frequently Asked Questions
      </h2>

      <div className="hf-list">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={`hf-item${isOpen ? " is-open" : ""}`}>
              <h3>
                <button
                  type="button"
                  className="hf-q"
                  aria-expanded={isOpen}
                  aria-controls={`hf-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="hf-icon" aria-hidden="true" />
                </button>
              </h3>
              {/* Height animates via grid rows 0fr → 1fr; the text fades and slides in as it opens */}
              <div id={`hf-a-${i}`} className="hf-a" role="region" aria-hidden={!isOpen}>
                <div className="hf-a-inner">
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
