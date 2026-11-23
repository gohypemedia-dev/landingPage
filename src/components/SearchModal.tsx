"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { CurrencyCode, Product } from "@/types";
import { formatPriceWithCurrency } from "@/data/products";
import { useCatalog } from "@/lib/catalog/context";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onSelectProduct: (p: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  currency,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { products: PRODUCTS } = useCatalog();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return PRODUCTS.slice(0, 5);
    const q = searchTerm.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.designer.toLowerCase().includes(q) ||
        p.materials.toLowerCase().includes(q)
    );
  }, [searchTerm, PRODUCTS]);

  if (!isOpen) return null;

  return (
    <div
      id="search-modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(16, 43, 70, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 60,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "5rem 1rem 2rem",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        id="search-modal-card"
        className="search-modal-card"
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#FFFFFF",
          borderRadius: "6px",
          boxShadow: "0 25px 60px rgba(16, 43, 70, 0.3)",
          border: "1px solid rgba(16, 43, 70, 0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            paddingBottom: "1rem",
            borderBottom: "1.5px solid var(--color-navy)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search sofas, teak beds, recliners, marble dining..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: "none",
              fontSize: "1.125rem",
              fontFamily: "var(--font-sans)",
              outline: "none",
              color: "var(--color-navy)",
              background: "transparent",
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.125rem",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Quick Search Suggestions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
            margin: "1.25rem 0 1.5rem",
          }}
        >
          <span style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-gold)", fontWeight: 700 }}>
            POPULAR SEARCHES:
          </span>
          {["Teakwood Bed", "Zero-Gravity Recliner", "Italian Marble", "Contemporary Sofa", "Curtains"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              style={{
                background: "rgba(16, 43, 70, 0.05)",
                border: "1px solid rgba(16, 43, 70, 0.1)",
                padding: "0.3rem 0.65rem",
                borderRadius: "30px",
                fontSize: "0.75rem",
                color: "var(--color-navy)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div>
          <div
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              marginBottom: "0.85rem",
              fontWeight: 600,
            }}
          >
            {searchTerm ? `RESULTS (${filteredProducts.length})` : "RECOMMENDED IN KURNOOL SHOWROOM"}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
              maxHeight: "360px",
              overflowY: "auto",
            }}
          >
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto",
                  gap: "1rem",
                  alignItems: "center",
                  padding: "0.75rem",
                  background: "#FAF8F5",
                  border: "1px solid rgba(16, 43, 70, 0.08)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background var(--transition-fast)",
                }}
              >
                <div style={{ position: "relative", width: "60px", height: "60px", backgroundColor: "#EFECE6", borderRadius: "3px", overflow: "hidden" }}>
                  <Image src={p.primaryImage} alt={p.name} fill style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.0625rem", color: "var(--color-navy)", fontWeight: 500 }}>
                    {p.name}
                  </h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    {p.category.toUpperCase()} • {p.materials.split(",")[0]}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-navy)" }}>
                  {p.priceOnEnquiry ? "Enquire" : formatPriceWithCurrency(p.priceUSD, currency, p.priceINR)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
