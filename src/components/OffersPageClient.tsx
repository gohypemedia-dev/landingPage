"use client";

import React from "react";
import { PromotionsSection } from "@/components/PromotionsSection";
import { WhatsAppCTABanner } from "@/components/WhatsAppCTABanner";
import { ShopShell } from "@/components/shop/ShopShell";

// Uses the shared site shell, so the header shortlist / inquiry list work here too
export const OffersPageClient: React.FC = () => (
  <ShopShell>
    {() => (
      <>
        {/* Hero Banner */}
        <section
          style={{
            padding: "7.5rem 0 3.5rem",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid rgba(16, 43, 70, 0.08)",
            textAlign: "center",
          }}
        >
          <div className="container" style={{ maxWidth: "780px", margin: "0 auto" }}>
            <span
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "var(--color-gold)",
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              SEASONAL PRIVILEGES & INCENTIVES
            </span>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.4rem, 4.5vw, 3.75rem)",
                fontWeight: 300,
                color: "var(--color-navy)",
                lineHeight: 1.15,
                marginBottom: "1rem",
              }}
            >
              Exclusive Kurnool Showroom <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>Offers</span>
            </h1>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "1.0625rem",
                lineHeight: 1.65,
                fontWeight: 300,
              }}
            >
              Furnish your entire home with authentic Burma teakwood and Italian marble while enjoying bundled showroom savings, complimentary delivery, and zero-interest EMI options.
            </p>
          </div>
        </section>

        {/* Promotions Grid */}
        <PromotionsSection />

        {/* Consultation Banner */}
        <WhatsAppCTABanner />
      </>
    )}
  </ShopShell>
);
