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

        {/* About & Leadership Experience Section */}
        <section className="showroom-tour-section" style={{ padding: "5rem 0", backgroundColor: "var(--color-canvas)", borderTop: "1px solid var(--color-card-border)", borderBottom: "1px solid var(--color-card-border)" }}>
          <div className="container">
            <div className="showroom-tour-grid">
              {/* Leadership / Founders Portrait Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1.25rem" }}>
                {/* Founder Card */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3 / 4",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 15px 35px rgba(16, 45, 64, 0.12)",
                    border: "1px solid var(--color-card-border)",
                    backgroundColor: "var(--color-card)",
                  }}
                >
                  <Image
                    src="/images/about-founder.jpg"
                    alt="Founder & Chairman - Mallikarjuna Furniture World Kurnool"
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, transparent 55%, rgba(16, 45, 64, 0.88) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.85rem",
                      left: "0.75rem",
                      right: "0.75rem",
                      background: "rgba(16, 45, 64, 0.88)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      padding: "0.5rem 0.65rem",
                      borderRadius: "6px",
                      border: "1px solid rgba(179, 148, 92, 0.4)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.625rem", color: "var(--color-gold)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.15rem" }}>
                      FOUNDER &amp; CHAIRMAN
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontWeight: 600, letterSpacing: "0.02em" }}>
                      Mallikarjuna Furniture World
                    </div>
                  </div>
                </div>

                {/* Director Card */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3 / 4",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 15px 35px rgba(16, 45, 64, 0.12)",
                    border: "1px solid var(--color-card-border)",
                    backgroundColor: "var(--color-card)",
                  }}
                >
                  <Image
                    src="/images/about-director.jpg"
                    alt="Managing Director & Design Leadership - Mallikarjuna Furniture World Kurnool"
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, transparent 55%, rgba(16, 45, 64, 0.88) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.85rem",
                      left: "0.75rem",
                      right: "0.75rem",
                      background: "rgba(16, 45, 64, 0.88)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      padding: "0.5rem 0.65rem",
                      borderRadius: "6px",
                      border: "1px solid rgba(179, 148, 92, 0.4)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.625rem", color: "var(--color-gold)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.15rem" }}>
                      MANAGING DIRECTOR
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontWeight: 600, letterSpacing: "0.02em" }}>
                      Leadership &amp; Design Innovation
                    </div>
                  </div>
                </div>
              </div>

              {/* About Content & Heritage Story */}
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2rem, 3.2vw, 2.65rem)",
                    color: "var(--color-navy)",
                    fontWeight: 400,
                    lineHeight: 1.2,
                    marginBottom: "1.25rem",
                  }}
                >
                  Generations of Trust, Artisan Teakwood &amp; Timeless Elegance
                </h2>
                <p
                  style={{
                    color: "var(--color-text-body)",
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    fontWeight: 400,
                    marginBottom: "1rem",
                  }}
                >
                  Founded in Kurnool with a steadfast commitment to artisan excellence, Mallikarjuna Furniture World stands as Rayalaseema&apos;s premier destination for bespoke luxury living. What began as a master woodworking studio has blossomed into a 15,000+ sq. ft. multi-floor flagship gallery, rooted in authentic Indian values, heirloom durability, and modern European aesthetics.
                </p>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    fontWeight: 300,
                    marginBottom: "1.75rem",
                  }}
                >
                  Under our founding leadership and next-generation vision, we marry hand-planed Burma teakwood joinery with imported Italian marbles, certified ergonomic recliners, and 500+ designer fabrics—curated to transform houses into enduring family sanctuaries across Kurnool, Nandyal, Dhone, and Andhra Pradesh.
                </p>

                {/* Metrics Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                    borderTop: "1px solid var(--color-card-border)",
                    paddingTop: "1.25rem",
                  }}
                >
                  <div>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.85rem", color: "var(--color-burgundy)", display: "block", fontWeight: 600, lineHeight: 1.1 }}>25+</span>
                    <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-navy)", fontWeight: 600 }}>Years of Trust</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.85rem", color: "var(--color-burgundy)", display: "block", fontWeight: 600, lineHeight: 1.1 }}>15,000+</span>
                    <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-navy)", fontWeight: 600 }}>Sq. Ft. Display</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.85rem", color: "var(--color-burgundy)", display: "block", fontWeight: 600, lineHeight: 1.1 }}>10,000+</span>
                    <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-navy)", fontWeight: 600 }}>Happy Homes</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                  <a
                    href={getShowroomBookingWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: "0.85rem 1.65rem", borderRadius: "6px", fontSize: "0.75rem" }}
                  >
                    <span>Connect with Leadership</span>
                  </a>
                  <a
                    href={SHOWROOM_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: "0.85rem 1.5rem", borderRadius: "6px", fontSize: "0.75rem" }}
                  >
                    <span>Visit Showroom</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Showroom Amenities & Guidance */}
        <section style={{ padding: "5rem 0", backgroundColor: "var(--color-canvas)" }}>
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem" }}>
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
