"use client";

import React from "react";
import { motion } from "framer-motion";
import { REVIEWS } from "@/data/products";

export const CustomerReviews: React.FC = () => {
  return (
    <section
      id="reviews"
      style={{
        padding: "6.5rem 0",
        backgroundColor: "var(--color-canvas)",
        borderBottom: "1px solid var(--color-card-border)",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 3.5rem" }}>
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
            VERIFIED KURNOOL TESTIMONIALS
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 3.8vw, 3.25rem)",
              fontWeight: 300,
              color: "var(--color-navy)",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            Trusted by Families Across <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>Rayalaseema</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "1rem",
              lineHeight: 1.65,
              fontWeight: 300,
            }}
          >
            Hear from Kurnool doctors, villa owners, and homeowners who chose Mallikarjuna Furniture World for their living spaces.
          </p>
        </div>

        {/* 3 Reviews Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {REVIEWS.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--color-card-border)",
                borderRadius: "4px",
                padding: "2.25rem 2rem",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Stars & Location */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ color: "var(--color-gold)", fontSize: "1rem" }}>
                  {"★".repeat(rev.rating)}
                </div>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {rev.location}
                </span>
              </div>

              {/* Review Text */}
              <p
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.7,
                  color: "var(--color-text-main)",
                  fontStyle: "italic",
                  marginBottom: "1.5rem",
                  flex: 1,
                  fontWeight: 300,
                }}
              >
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Author & Product */}
              <div style={{ borderTop: "1px solid rgba(16, 43, 70, 0.08)", paddingTop: "1rem" }}>
                <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-navy)" }}>
                  {rev.author}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                  {rev.role}
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--color-gold)",
                    fontWeight: 600,
                    marginTop: "0.25rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Selected: {rev.productName}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
