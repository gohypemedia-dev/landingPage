"use client";

import React from "react";
import { motion } from "framer-motion";
import { SHOWROOM_INFO, getWhatsAppEnquiryUrl } from "@/data/products";

export const WhatsAppCTABanner: React.FC = () => {
  return (
    <section
      id="whatsapp-cta-banner"
      style={{
        padding: "6rem 0",
        backgroundColor: "var(--color-navy)",
        color: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Warm Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "350px",
          background: "radial-gradient(ellipse, rgba(197, 164, 93, 0.15) 0%, rgba(16, 43, 70, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: "780px", margin: "0 auto" }}
        >
          <span
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "var(--color-gold)",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            PERSONALIZED SALES & CUSTOM CONSULTATION
          </span>

          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
              fontWeight: 300,
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              letterSpacing: "-0.015em",
            }}
          >
            Let&apos;s Find the Right <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>Furniture for You.</span>
          </h2>

          <p
            style={{
              fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
              lineHeight: 1.7,
              color: "rgba(247, 243, 234, 0.88)",
              marginBottom: "2.5rem",
              fontWeight: 300,
            }}
          >
            Tell us what you need, and our Kurnool team can help with custom dimensions, fabric swatches,
            quotations, and showroom appointments.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
            <a
              href={getWhatsAppEnquiryUrl("General Website Guidance & Pricing")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{
                padding: "1rem 2.25rem",
                fontSize: "0.875rem",
                letterSpacing: "0.08em",
                borderRadius: "999px",
                boxShadow: "0 8px 30px rgba(24, 134, 75, 0.45)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Send Inquiry</span>
            </a>

            <a
              href="tel:+919849012345"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2rem",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#FFFFFF",
                borderRadius: "999px",
                fontSize: "0.8125rem",
                letterSpacing: "0.1em",
                fontWeight: 600,
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <span>CALL {SHOWROOM_INFO.displayPhone}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
