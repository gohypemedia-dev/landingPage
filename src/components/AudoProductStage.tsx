"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CurrencyCode, Product, ProductFinish } from "@/types";
import { formatPriceWithCurrency, getWhatsAppEnquiryUrl } from "@/data/products";
import { CollectionKey, collectionHref, getCollectionProducts } from "@/data/collections";

interface AudoProductStageProps {
  currency: CurrencyCode;
  wishlistIds: string[];
  onToggleWishlist: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onAddToCart?: (p: Product, f: ProductFinish) => void;
  collection?: CollectionType;
  title: string;
  /** Show these products instead of a homepage collection (used on category & product pages) */
  products?: Product[];
}

type CollectionType = CollectionKey;

// Interactive 3D Card within the stage (also reused on category & product pages)
export const AudoCardItem: React.FC<{
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onAddToCart?: (p: Product, f: ProductFinish) => void;
  showDivider: boolean;
}> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  showDivider,
}) => {
  const [selectedFinish, setSelectedFinish] = useState<ProductFinish>(product.finishes[0]);
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = formatPriceWithCurrency(product.priceUSD, currency, product.priceINR);

  return (
    <div
      style={{
        position: "relative",
        borderRight: showDivider ? "1px solid #ECEAE5" : "none",
        background: "#FFFFFF",
      }}
      className="audo-card-col"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onQuickView(product)}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
        }}
      >
        {/* Full-bleed Edge-to-Edge Product Visual Canvas */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            backgroundColor: "#F7F5F0",
          }}
        >
          {/* Main Image with Smooth Micro-zoom on Hover */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transform: isHovered ? "scale(1.03)" : "scale(1)",
              transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Image
              src={selectedFinish.image || (isHovered && product.hoverImage ? product.hoverImage : product.primaryImage)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* Floating Wishlist Heart Icon Overlaid on Image */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            aria-label={isWishlisted ? "Remove from shortlist" : "Save to shortlist"}
            style={{
              position: "absolute",
              top: "0.875rem",
              right: "0.875rem",
              zIndex: 10,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: "1px solid rgba(16, 43, 70, 0.08)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isWishlisted ? "var(--color-gold)" : "#102B46",
              transition: "transform 0.2s ease, background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "var(--color-gold)" : "none"}
              stroke={isWishlisted ? "var(--color-gold)" : "currentColor"}
              strokeWidth="1.8"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Card Details & Actions Area */}
        <div
          style={{
            padding: "18px 12px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          {/* Finish Swatches */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              height: "12px",
              marginBottom: "8px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {product.finishes.slice(0, 3).map((f) => {
              const isSelected = selectedFinish.id === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFinish(f)}
                  aria-label={`Select finish ${f.name}`}
                  title={f.name}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: f.colorHex || "#C8B89A",
                    border: "none",
                    outline: isSelected ? "1.5px solid #111111" : "none",
                    outlineOffset: "1.5px",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.15s ease",
                  }}
                />
              );
            })}
            {product.finishes.length > 3 && (
              <span style={{ fontSize: "9px", color: "#111111", lineHeight: 1, marginLeft: "1px" }}>
                +{product.finishes.length - 3}
              </span>
            )}
          </div>

          {/* Title in tracked uppercase */}
          <h3
            style={{
              margin: "0 0 5px",
              maxWidth: "100%",
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              lineHeight: 1.25,
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#111111",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div
            suppressHydrationWarning
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              lineHeight: 1.25,
              letterSpacing: "0.04em",
              color: "#9A9A9A",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            {formattedPrice}
          </div>

          {/* Actions: WhatsApp on the left, add to inquiry list on the right */}
          <div className="card-actions" onClick={(e) => e.stopPropagation()}>
            <a
              href={getWhatsAppEnquiryUrl(product.name, undefined, selectedFinish.name, formattedPrice)}
              target="_blank"
              rel="noopener noreferrer"
              className="card-action card-action--wa"
              aria-label={`Enquire about ${product.name} on WhatsApp`}
              title="Enquire on WhatsApp"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Inquiry</span>
            </a>
            {onAddToCart && (
              <button
                type="button"
                className="card-action card-action--add"
                onClick={() => onAddToCart(product, selectedFinish)}
                aria-label={`Add ${product.name} to inquiry list`}
                title="Add to inquiry list"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18M12 10v6M9 13h6" />
                </svg>
                <span>Add to List</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AudoProductStage: React.FC<AudoProductStageProps> = ({
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  collection = "new",
  title,
  products,
}) => {
  const [index, setIndex] = useState(0);

  const [VISIBLE, setVisible] = useState(3);

  useEffect(() => {
    const update = () => setVisible(window.innerWidth <= 640 ? 1 : window.innerWidth <= 992 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const tabProducts = React.useMemo(() => {
    if (products) return products;
    return getCollectionProducts(collection);
  }, [collection, products]);

  const maxIndex = Math.max(0, tabProducts.length - VISIBLE);
  const clamped = Math.min(index, maxIndex);

  // Homepage rows auto-advance while on screen (phones, laptops and desktops), so visitors see there are more products.
  // Any swipe or arrow tap pauses auto-play for a few seconds, and hovering with a mouse pauses it entirely.
  const sectionRef = React.useRef<HTMLElement>(null);
  const lastTouch = React.useRef(0);
  const [inView, setInView] = useState(false);
  const [tick, setTick] = useState(0);
  const hovering = React.useRef(false);
  const autoPlay = !products;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !autoPlay) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (!autoPlay || !inView || maxIndex === 0) return;
    const id = setTimeout(() => {
      if (hovering.current || Date.now() - lastTouch.current < 5000) setTick((t) => t + 1); // hovered or recently touched: wait
      else setIndex(clamped >= maxIndex ? 0 : clamped + 1);
    }, VISIBLE === 1 ? 3500 : 1500); // phones keep a gentler pace; laptops/desktops move every 1.5s
    return () => clearTimeout(id);
  }, [autoPlay, inView, clamped, maxIndex, tick, VISIBLE]);

  // Swipe / drag the track sideways to move one card at a time.
  const swipeStart = React.useRef<number | null>(null);
  // A swipe ends with a click on the card underneath; skip that click so it doesn't open the product
  const didSwipe = React.useRef(false);
  const onSwipeStart = (e: React.PointerEvent) => {
    swipeStart.current = e.clientX;
    didSwipe.current = false;
  };
  const onSwipeEnd = (e: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) < 40) return;
    didSwipe.current = true;
    setIndex(dx < 0 ? Math.min(maxIndex, clamped + 1) : Math.max(0, clamped - 1));
  };

  return (
    <section
      ref={sectionRef}
      onPointerDownCapture={() => (lastTouch.current = Date.now())}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      id={products ? undefined : `audo-product-stage-${collection}`} style={{ padding: 0, backgroundColor: "var(--color-canvas)" }}>
      <div className="audo-stage-container" style={{ background: "#FFFFFF", overflow: "hidden" }}>
        {/* Header Row: Title */}
        <div className="audo-header-row">
          <h2 className="audo-tab-btn is-active">{title}</h2>
        </div>

        {/* Sliding product track, with minimal side arrows centred on the images */}
        <div className="audo-track-wrap" style={{ "--stage-visible": VISIBLE } as React.CSSProperties}>
        <button
          type="button"
          onClick={() => setIndex(Math.max(0, clamped - 1))}
          disabled={clamped === 0}
          aria-label="Previous products"
          className="audo-side-arrow audo-side-arrow--prev"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setIndex(Math.min(maxIndex, clamped + 1))}
          disabled={clamped >= maxIndex}
          aria-label="Next products"
          className="audo-side-arrow audo-side-arrow--next"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <div
          style={{ overflow: "hidden", touchAction: "pan-y" }}
          onPointerDown={onSwipeStart}
          onPointerUp={onSwipeEnd}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          <motion.div
            className="audo-stage-grid"
            initial={false}
            animate={{ x: `-${(clamped * 100) / tabProducts.length}%` }}
            transition={{ duration: VISIBLE === 1 ? 0.75 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", width: `${(tabProducts.length * 100) / VISIBLE}%`, alignItems: "flex-start" }}
          >
            {tabProducts.map((product, idx) => (
              <div key={product.id} style={{ width: `${100 / tabProducts.length}%`, display: "flex", flexDirection: "column" }}>
                <AudoCardItem
                  product={product}
                  currency={currency}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickView={(p) => !didSwipe.current && onQuickView(p)}
                  onAddToCart={onAddToCart}
                  showDivider={idx < tabProducts.length - 1}
                />
              </div>
            ))}
          </motion.div>
        </div>
        </div>

        {/* Mobile progress, like the reference: 01 / 06 and a bar */}
        <div className="audo-progress">
          <span>
            {String(clamped + 1).padStart(2, "0")} / {String(maxIndex + 1).padStart(2, "0")}
          </span>
          <div className="audo-progress__bar">
            <motion.div
              className="audo-progress__fill"
              animate={{ width: `${((clamped + 1) / (maxIndex + 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Bottom Row: View All (collection page on the homepage rows, all furniture elsewhere) */}
        <div
          style={{
            borderTop: "1px solid #ECEAE5",
            padding: "1.5rem 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link
            href={products ? "/furniture" : collectionHref(collection)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#111111",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span>{products ? "Shop All" : "View All"}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
