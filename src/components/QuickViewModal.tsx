"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CurrencyCode, Product, ProductFinish } from "@/types";
import { formatPriceWithCurrency, getProductPDPWhatsAppUrl, SHOWROOM_INFO } from "@/data/products";

interface QuickViewModalProps {
  product: Product | null;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToCart?: (p: Product, finish: ProductFinish, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  currency,
  onClose,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [openSection, setOpenSection] = useState<string>("overview");

  useEffect(() => {
    if (product) {
      setSelectedImage(product.primaryImage);
      setSelectedConfig(product.configurations ? product.configurations[0] : "Standard");
      setSelectedColor(product.colors ? product.colors[0].name : (product.finishes[0]?.name || "Natural"));
      setSelectedBudget(product.budgetRanges ? product.budgetRanges[1] || product.budgetRanges[0] : "₹30,000–₹60,000");
      setOpenSection("overview");
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const formattedPrice = product.priceOnEnquiry
    ? "Price on enquiry"
    : formatPriceWithCurrency(product.priceUSD, currency, product.priceINR);

  const galleryImages = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.primaryImage, product.hoverImage || product.primaryImage];

  const whatsappUrl = getProductPDPWhatsAppUrl(
    product,
    selectedConfig,
    selectedColor,
    selectedBudget
  );

  return (
    <div
      id="quick-view-backdrop"
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 20, 32, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 3vw, 2.5rem)",
        animation: "fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={onClose}
    >
      <div
        id="quick-view-modal"
        style={{
          width: "100%",
          maxWidth: "980px",
          height: "min(86vh, 670px)",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid rgba(16, 43, 70, 0.08)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.25)",
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          overflow: "hidden",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
        className="modal-grid"
      >
        {/* Mobile Sheet Drag Handle */}
        <div className="modal-drag-handle" />

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="modal-close-btn"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            color: "#111111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 30,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.backgroundColor = "#111111";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.92)";
            e.currentTarget.style.color = "#111111";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* LEFT COLUMN: Visual Media Gallery */}
        <div
          className="modal-gallery-col"
          style={{
            background: "#F5F3EF",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            borderRight: "1px solid rgba(0, 0, 0, 0.06)",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Main Visual - Fills available height cleanly with zero leftover gap */}
          <div
            className="modal-gallery-main"
            style={{
              position: "relative",
              flex: 1,
              width: "100%",
              minHeight: 0,
            }}
          >
            <Image
              src={selectedImage || product.primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />

            {/* Badge */}
            {product.badge && (
              <span
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "1rem",
                  background: "rgba(16, 43, 70, 0.88)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  color: "#FFFFFF",
                  padding: "0.3rem 0.65rem",
                  fontSize: "0.625rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  borderRadius: "4px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                {product.badge}
              </span>
            )}

            {/* Floating Shortlist Heart */}
            <button
              onClick={() => onToggleWishlist(product)}
              aria-label="Save to shortlist"
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isWishlisted ? "var(--color-gold)" : "none"}
                stroke={isWishlisted ? "var(--color-gold)" : "#111111"}
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Thumbnail Strip Docked at Bottom */}
          {galleryImages.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                background: "#FFFFFF",
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                overflowX: "auto",
                flexShrink: 0,
              }}
            >
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    position: "relative",
                    width: "48px",
                    height: "48px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: selectedImage === img ? "2px solid #111111" : "1px solid rgba(0, 0, 0, 0.1)",
                    padding: 0,
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "border-color 0.15s ease",
                  }}
                >
                  <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Details & WhatsApp Configuration Form */}
        <div
          className="modal-details-col"
          style={{
            padding: "1.75rem 2rem 2rem",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            height: "100%",
          }}
        >
          {/* Breadcrumb / Category Info (padded right so close button never collides) */}
          <div
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              fontWeight: 600,
              marginBottom: "0.4rem",
              paddingRight: "2.75rem",
            }}
          >
            {product.category} · {product.designer || "Mallikarjuna Luxury Living"}
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.55rem",
              lineHeight: 1.2,
              fontWeight: 500,
              color: "var(--color-navy)",
              marginBottom: "0.35rem",
              letterSpacing: "-0.01em",
              paddingRight: "2.5rem",
            }}
          >
            {product.name}
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#666666",
              lineHeight: 1.5,
              marginBottom: "0.85rem",
              fontWeight: 400,
            }}
          >
            {product.subtitle}
          </p>

          {/* Price guidance */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.75rem",
              paddingBottom: "0.85rem",
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "var(--color-navy)",
                letterSpacing: "-0.02em",
              }}
            >
              {formattedPrice}
            </div>

            <span
              style={{
                fontSize: "0.6875rem",
                color: "#888888",
              }}
            >
              {product.priceOnEnquiry ? "Customizable configurations" : "Starting price · Kurnool Showroom"}
            </span>
          </div>

          {/* INTERACTIVE CONFIGURATION FORM */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem", marginBottom: "1.5rem" }}>
            {/* 1. Configuration Selection */}
            {product.configurations && product.configurations.length > 0 && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#777777",
                    marginBottom: "0.35rem",
                  }}
                >
                  Choose Your Configuration:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {product.configurations.map((cfg) => {
                    const isSelected = selectedConfig === cfg;
                    return (
                      <button
                        key={cfg}
                        onClick={() => setSelectedConfig(cfg)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "6px",
                          border: isSelected ? "1.5px solid var(--color-navy)" : "1px solid #E5E5E5",
                          background: isSelected ? "var(--color-navy)" : "#FAFAFA",
                          color: isSelected ? "#FFFFFF" : "#333333",
                          fontSize: "0.6875rem",
                          fontWeight: isSelected ? 600 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {cfg}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Preferred Colour Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#777777",
                    marginBottom: "0.35rem",
                  }}
                >
                  Preferred Colour / Finish:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", alignItems: "center" }}>
                  {product.colors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.3rem 0.65rem",
                          borderRadius: "999px",
                          border: isSelected ? "1.5px solid var(--color-navy)" : "1px solid #E5E5E5",
                          background: isSelected ? "rgba(16, 43, 70, 0.05)" : "#FFFFFF",
                          fontSize: "0.6875rem",
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? "var(--color-navy)" : "#444444",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span
                          style={{
                            width: "9px",
                            height: "9px",
                            borderRadius: "50%",
                            backgroundColor: c.hex,
                            border: "1px solid rgba(0,0,0,0.15)",
                            display: "inline-block",
                          }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Budget Range Selection */}
            {product.budgetRanges && product.budgetRanges.length > 0 && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#777777",
                    marginBottom: "0.35rem",
                  }}
                >
                  Budget Range:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {product.budgetRanges.map((b) => {
                    const isSelected = selectedBudget === b;
                    return (
                      <button
                        key={b}
                        onClick={() => setSelectedBudget(b)}
                        style={{
                          padding: "0.35rem 0.7rem",
                          borderRadius: "6px",
                          border: isSelected ? "1.5px solid var(--color-gold)" : "1px solid #E5E5E5",
                          background: isSelected ? "var(--color-gold)" : "#FAFAFA",
                          color: isSelected ? "#FFFFFF" : "#333333",
                          fontSize: "0.6875rem",
                          fontWeight: isSelected ? 600 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PRIMARY CONVERSION CTA: Enquire on WhatsApp */}
          <div style={{ marginBottom: "1.5rem" }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{
                width: "100%",
                padding: "0.75rem 1.25rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                justifyContent: "center",
                borderRadius: "8px",
                backgroundColor: "var(--color-whatsapp)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(24, 134, 75, 0.25)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(24, 134, 75, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(24, 134, 75, 0.25)";
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Enquire on WhatsApp</span>
            </a>
            <p
              style={{
                fontSize: "0.6875rem",
                color: "#888888",
                textAlign: "center",
                marginTop: "0.35rem",
              }}
            >
              Prefills product name, configuration & colour directly to our Kurnool showroom sales team.
            </p>
          </div>

          {/* EXPANDABLE INFORMATION ACCORDIONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderTop: "1px solid rgba(0, 0, 0, 0.06)", paddingTop: "0.85rem" }}>
            {/* Overview */}
            <div style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", paddingBottom: "0.4rem" }}>
              <button
                onClick={() => setOpenSection(openSection === "overview" ? "" : "overview")}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#222222",
                  cursor: "pointer",
                  padding: "0.35rem 0",
                }}
              >
                <span>Product Overview</span>
                <span style={{ fontSize: "1rem", color: "#888888" }}>{openSection === "overview" ? "−" : "+"}</span>
              </button>
              {openSection === "overview" && (
                <div style={{ fontSize: "0.75rem", color: "#555555", lineHeight: 1.6, paddingTop: "0.35rem" }}>
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", paddingBottom: "0.4rem" }}>
              <button
                onClick={() => setOpenSection(openSection === "specs" ? "" : "specs")}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#222222",
                  cursor: "pointer",
                  padding: "0.35rem 0",
                }}
              >
                <span>Specifications & Dimensions</span>
                <span style={{ fontSize: "1rem", color: "#888888" }}>{openSection === "specs" ? "−" : "+"}</span>
              </button>
              {openSection === "specs" && (
                <div style={{ fontSize: "0.75rem", color: "#555555", lineHeight: 1.6, paddingTop: "0.35rem" }}>
                  <div style={{ marginBottom: "0.4rem" }}>
                    <strong>Dimensions:</strong> {product.dimensions}
                  </div>
                  <div style={{ marginBottom: "0.4rem" }}>
                    <strong>Materials:</strong> {product.materials}
                  </div>
                  <ul style={{ paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Warranty & Care */}
            <div style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", paddingBottom: "0.4rem" }}>
              <button
                onClick={() => setOpenSection(openSection === "warranty" ? "" : "warranty")}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#222222",
                  cursor: "pointer",
                  padding: "0.35rem 0",
                }}
              >
                <span>Warranty & Quality Guarantee</span>
                <span style={{ fontSize: "1rem", color: "#888888" }}>{openSection === "warranty" ? "−" : "+"}</span>
              </button>
              {openSection === "warranty" && (
                <div style={{ fontSize: "0.75rem", color: "#555555", lineHeight: 1.6, paddingTop: "0.35rem" }}>
                  <p>
                    {product.warranty || "15-Year Teakwood Termite & Borer Replacement Guarantee."}
                  </p>
                  <p style={{ marginTop: "0.35rem" }}>
                    Every joint, fastener, and cushion foam is inspected in Kurnool before dispatch.
                  </p>
                </div>
              )}
            </div>

            {/* Showroom Availability */}
            <div style={{ paddingBottom: "0.4rem" }}>
              <button
                onClick={() => setOpenSection(openSection === "showroom" ? "" : "showroom")}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#222222",
                  cursor: "pointer",
                  padding: "0.35rem 0",
                }}
              >
                <span>Showroom Display & Delivery</span>
                <span style={{ fontSize: "1rem", color: "#888888" }}>{openSection === "showroom" ? "−" : "+"}</span>
              </button>
              {openSection === "showroom" && (
                <div style={{ fontSize: "0.75rem", color: "#555555", lineHeight: 1.6, paddingTop: "0.35rem" }}>
                  <p>
                    <strong>Location:</strong> {SHOWROOM_INFO.address}
                  </p>
                  <p style={{ marginTop: "0.2rem" }}>
                    <strong>Hours:</strong> {SHOWROOM_INFO.timing}
                  </p>
                  <p style={{ marginTop: "0.2rem" }}>
                    <strong>Availability:</strong> {product.availability || "On live display for testing in showroom."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
