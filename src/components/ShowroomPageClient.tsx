"use client";

import React from "react";
import Image from "next/image";
import { SHOWROOM_INFO, getShowroomBookingWhatsAppUrl } from "@/data/products";
import { ShopShell } from "@/components/shop/ShopShell";

// Uses the shared site shell, so the header shortlist / inquiry list work here too
export const ShowroomPageClient: React.FC = () => (
  <ShopShell>
    {() => (
      <>
        {/* Hero Section */}
        <section
          style={{
            position: "relative",
            minHeight: "560px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            overflow: "hidden",
            padding: "7.5rem 0 5rem",
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              src="/images/mf-showroom-grand-hall.jpg"
              alt="Mallikarjuna Furniture World Kurnool Grand Showroom"
              fill
              priority
              style={{ objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(16,43,70,0.85) 0%, rgba(16,43,70,0.65) 50%, rgba(16,43,70,0.92) 100%)",
              }}
            />
          </div>

          <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "860px" }}>
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
              15,000+ SQ. FT. LUXURY FURNITURE DESTINATION
            </span>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
                fontWeight: 300,
                lineHeight: 1.15,
                marginBottom: "1.25rem",
              }}
            >
              Visit Our Kurnool <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>Showroom</span>
            </h1>

            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.65,
                fontWeight: 300,
                color: "var(--color-ivory)",
                marginBottom: "2.25rem",
                opacity: 0.95,
              }}
            >
              Touch genuine Burma teakwood, test motorized zero-gravity recliners, compare cushion densities, and let our interior specialists help you furnish your dream home.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={getShowroomBookingWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ padding: "0.95rem 2rem", borderRadius: "999px", fontSize: "0.8125rem" }}
              >
                <span>Book a Showroom Visit</span>
              </a>
              <a
                href={SHOWROOM_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  padding: "0.95rem 1.75rem",
                  borderRadius: "999px",
                  fontSize: "0.8125rem",
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "#FFFFFF",
                }}
              >
                <span>OPEN IN GOOGLE MAPS</span>
              </a>
            </div>
          </div>
        </section>

        {/* Multi-Zone Experience Tour & Logistics Pavilion */}
        <section className="showroom-tour-section">
          <div className="container">
            <div className="showroom-tour-grid">
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ position: "relative", height: "230px", borderRadius: "10px", overflow: "hidden", boxShadow: "0 15px 35px rgba(16,43,70,0.12)" }}>
                  <Image
                    src="/images/mf-showroom-warehouse.jpg"
                    alt="Mallikarjuna Furniture World Multi-Floor Experience Tour and Warehouse Facility"
                    fill
                    sizes="(max-width: 992px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", bottom: "0.75rem", left: "1rem", background: "rgba(16,43,70,0.75)", backdropFilter: "blur(6px)", padding: "0.3rem 0.75rem", borderRadius: "4px", fontSize: "0.6875rem", color: "#FFFFFF", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Warehouse & Dispatch Logistics
                  </div>
                </div>
                <div style={{ position: "relative", height: "230px", borderRadius: "10px", overflow: "hidden", boxShadow: "0 15px 35px rgba(16,43,70,0.12)" }}>
                  <Image
                    src="/images/mf-showroom-gallery-wood.jpg"
                    alt="Mallikarjuna Furniture World Live Kurnool Showroom Woodcraft Gallery"
                    fill
                    sizes="(max-width: 992px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", bottom: "0.75rem", left: "1rem", background: "rgba(16,43,70,0.75)", backdropFilter: "blur(6px)", padding: "0.3rem 0.75rem", borderRadius: "4px", fontSize: "0.6875rem", color: "#FFFFFF", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Live Woodcraft & Material Studio
                  </div>
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.6875rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gold)", display: "block", marginBottom: "0.75rem" }}>
                  MULTI-FLOOR LIVING EXPERIENCE
                </span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", color: "var(--color-navy)", fontWeight: 300, lineHeight: 1.2, marginBottom: "1.25rem" }}>
                  From Raw Teakwood to Your Living Room
                </h2>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "1rem", lineHeight: 1.7, fontWeight: 300, marginBottom: "1.5rem" }}>
                  Our Kurnool premises span a complete multi-zone luxury experience: curated living galleries, an ergonomic recliner trial lounge, a 500+ fabric upholstery studio, and our state-of-the-art dispatch warehouse ensuring rapid delivery across Kurnool, Nandyal, and Dhone.
                </p>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  <div>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--color-navy)", display: "block", fontWeight: 600 }}>15,000+</span>
                    <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Sq. Ft. Display</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--color-navy)", display: "block", fontWeight: 600 }}>500+</span>
                    <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Ready Designs</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--color-navy)", display: "block", fontWeight: 600 }}>24hr</span>
                    <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Kurnool Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Showroom Amenities & Guidance */}
        <section style={{ padding: "5rem 0", backgroundColor: "var(--color-canvas)" }}>
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem" }}>
              <span
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "var(--color-gold)",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                WHAT TO EXPECT
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2.4rem",
                  color: "var(--color-navy)",
                  fontWeight: 300,
                }}
              >
                Designed for Comfort & Confidence
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.75rem",
              }}
            >
              {[
                {
                  icon: "🚗",
                  title: "Valet & Dedicated Parking",
                  desc: "Spacious private parking right at our showroom entrance for stress-free family visits.",
                },
                {
                  icon: "🛋️",
                  title: "Live Room Environments",
                  desc: "Walk through fully styled living, dining, and master bedrooms with coordinated lighting.",
                },
                {
                  icon: "📐",
                  title: "Free In-Home Measurement",
                  desc: "Our master carpenters will visit your Kurnool villa or flat to take accurate floor plan measurements.",
                },
                {
                  icon: "💳",
                  title: "0% Easy EMI Finance",
                  desc: "Instant paperless approvals via Bajaj Finserv, HDFC, and all major credit cards.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(16, 43, 70, 0.08)",
                    borderRadius: "6px",
                    padding: "2rem 1.5rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{card.icon}</div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.25rem",
                      color: "var(--color-navy)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    )}
  </ShopShell>
);
