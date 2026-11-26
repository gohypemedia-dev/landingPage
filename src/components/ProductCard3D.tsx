"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CurrencyCode, Product, ProductFinish } from "@/types";
import { formatPriceWithCurrency } from "@/data/products";

interface ProductCard3DProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onAddToCart?: (p: Product, finish: ProductFinish) => void;
}

const MAX_SWATCHES = 3;

export const ProductCard3D: React.FC<ProductCard3DProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = product.priceOnEnquiry
    ? "Price on enquiry"
    : formatPriceWithCurrency(product.priceUSD, currency, product.priceINR);

  const visibleFinishes = product.finishes.slice(0, MAX_SWATCHES);
  const extraFinishes = product.finishes.length - visibleFinishes.length;

  return (
    <article
      className="minimal-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="hover"
    >
      <button
        type="button"
        className="minimal-product-card__image"
        onClick={() => onQuickView(product)}
        aria-label={`View ${product.name}`}
      >
        <Image
          src={isHovered && product.hoverImage ? product.hoverImage : product.primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </button>

      <button
        type="button"
        className="minimal-product-card__heart"
        onClick={() => onToggleWishlist(product)}
        aria-label={isWishlisted ? "Remove from shortlist" : "Save to shortlist"}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={isWishlisted ? "var(--color-gold)" : "none"}
          stroke={isWishlisted ? "var(--color-gold)" : "var(--color-navy)"}
          strokeWidth="1.6"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <div className="minimal-product-card__meta">
        <div className="minimal-product-card__swatches">
          {visibleFinishes.map((f) => (
            <span
              key={f.id}
              title={f.name}
              className="minimal-product-card__dot"
              style={{ backgroundColor: f.colorHex }}
            />
          ))}
          {extraFinishes > 0 && <span className="minimal-product-card__more">+{extraFinishes}</span>}
        </div>
        <h3 className="minimal-product-card__name" onClick={() => onQuickView(product)}>
          {product.name}
        </h3>
        <div className="minimal-product-card__price" suppressHydrationWarning>
          {formattedPrice}
        </div>
      </div>
    </article>
  );
};
