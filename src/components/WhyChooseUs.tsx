"use client";

import React from "react";
import { motion } from "framer-motion";
import { WHY_CHOOSE_US_POINTS } from "@/data/products";

export const WhyChooseUs: React.FC = () => {
  return (
    <section
      id="why-choose-us"
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
            THE MALLIKARJUNA COMMITMENT
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
            Why Choose <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>Our Showroom?</span>
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "1rem",
              lineHeight: 1.65,
              fontWeight: 300,
            }}
          >
            Bringing genuine quality, verifiable warranties, and personalized interior guidance to Kurnool families since 1998.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2rem",
          }}
        >
          {WHY_CHOOSE_US_POINTS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--color-card-border)",
                borderRadius: "4px",
                padding: "2.25rem 1.75rem",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                transition: "all var(--transition-normal)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.borderColor = "var(--color-gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                e.currentTarget.style.borderColor = "var(--color-card-border)";
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "rgba(16, 43, 70, 0.05)",
                  border: "1px solid rgba(197, 164, 93, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  color: "var(--color-gold)",
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                }}
              >
                0{idx + 1}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.45rem",
                  fontWeight: 500,
                  color: "var(--color-navy)",
                  marginBottom: "0.6rem",
                  lineHeight: 1.25,
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
