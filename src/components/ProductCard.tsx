"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CurrencyCode, Product, ProductFinish } from "@/types";
import { formatPriceINR, formatPriceWithCurrency, getWhatsAppEnquiryUrl } from "@/data/products";

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onAddToCart?: (p: Product, finish: ProductFinish) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
}) => {
  const [selectedFinish, setSelectedFinish] = useState<ProductFinish>(product.finishes[0]);
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = product.priceOnEnquiry
    ? "Price on enquiry"
    : formatPriceWithCurrency(product.priceUSD, currency, product.priceINR);

  const whatsappUrl = getWhatsAppEnquiryUrl(
    product.name,
    product.configurations ? product.configurations[0] : undefined,
    selectedFinish.name,
    product.priceINR ? formatPriceINR(product.priceINR) : "Price guidance"
  );

  return (
    <article
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--color-card)",
        border: "1px solid var(--color-card-border)",
        borderRadius: "4px",
        transition: "all var(--transition-normal)",
        position: "relative",
        boxShadow: isHovered ? "var(--shadow-md)" : "var(--shadow-sm)",
      }}
    >
      {/* Visual Canvas Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "105%",
          overflow: "hidden",
          backgroundColor: "var(--color-canvas, #F7F3EA)",
          cursor: "pointer",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
        }}
        onClick={() => onQuickView(product)}
      >
        {/* Main Image with Zoom on Hover */}
        <Image
          src={isHovered && product.hoverImage ? product.hoverImage : product.primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: "cover",
            transition: "transform var(--transition-slow), opacity var(--transition-normal)",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* Tag / Badge */}
        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              background: "rgba(16, 43, 70, 0.9)",
              backdropFilter: "blur(4px)",
              color: "#FFFFFF",
              fontSize: "0.625rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.3rem 0.65rem",
              fontWeight: 600,
              zIndex: 2,
              borderRadius: "2px",
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from shortlist" : "Add to shortlist"}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.92)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
            transition: "transform var(--transition-fast)",
            boxShadow: "0 2px 8px rgba(16, 43, 70, 0.1)",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "var(--color-gold)" : "none"}
            stroke={isWishlisted ? "var(--color-gold)" : "var(--color-navy)"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      {/* Meta Content */}
      <div
        style={{
          padding: "1.35rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.6875rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            fontWeight: 600,
            marginBottom: "0.35rem",
          }}
        >
          <span>{product.category.toUpperCase()} · KURNOOL</span>
          {product.warranty && (
            <span style={{ color: "var(--color-text-secondary)", fontSize: "0.625rem" }}>
              15-YR WARRANTY
            </span>
          )}
        </div>

        <h3
          onClick={() => onQuickView(product)}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.35rem",
            lineHeight: 1.25,
            fontWeight: 500,
            color: "var(--color-navy)",
            marginBottom: "0.35rem",
            cursor: "pointer",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.5,
            marginBottom: "0.85rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontWeight: 300,
          }}
        >
          {product.subtitle}
        </p>

        {/* Swatches */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            marginBottom: "1rem",
          }}
        >
          {product.finishes.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFinish(f)}
              title={f.name}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: f.colorHex,
                border: selectedFinish.id === f.id ? "2px solid var(--color-navy)" : "1px solid rgba(0,0,0,0.18)",
                cursor: "pointer",
              }}
            />
          ))}
          <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", marginLeft: "0.25rem" }}>
            {selectedFinish.name}
          </span>
        </div>

        {/* Price & Rating */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--color-card-border)",
          }}
        >
          <div
            suppressHydrationWarning
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: "var(--color-burgundy, #9E151B)",
            }}
          >
            {formattedPrice}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
            }}
          >
            <span style={{ color: "var(--color-gold)" }}>★</span>
            <span style={{ fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
            <span style={{ color: "var(--color-text-muted)" }}>({product.reviewCount})</span>
          </div>
        </div>

        {/* WhatsApp Action Button */}
        <div style={{ marginTop: "0.75rem" }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem",
              fontSize: "0.75rem",
              justifyContent: "center",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>ENQUIRE ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </article>
  );
};
