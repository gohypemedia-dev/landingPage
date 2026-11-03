"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SHOWROOM_INFO } from "@/data/products";

const cards = [
  {
    heading: "About",
    image: "/images/mf-showroom-grand-hall.jpg",
    alt: "Inside the Casablanca Sofas showroom",
    title: "Kurnool's furniture showroom since 1998",
    text: "Casablanca Sofas brings sofas, recliners, beds, dining sets, mattresses and curtains under one roof, so you can see, sit and compare before you buy.",
    cta: "Read More",
    href: "/furniture-showroom-kurnool",
    external: false,
    map: undefined as string | undefined,
  },
  {
    heading: "International Collection",
    image: "/images/mf-showroom-warehouse.jpg",
    alt: "International furniture on display in the showroom",
    title: "Designed abroad, ready to see in Kurnool.",
    text: "Scandinavian designs, Italian marble, German recliner mechanisms and Belgian linen, on display at our showroom.",
    cta: "Explore Collection",
    href: "/collections/international-collection",
    external: false,
    map: undefined,
  },
  {
    heading: "Visit Us",
    image: "/images/showroom-kurnool-main.jpg",
    alt: "Casablanca Sofas showroom in Kurnool",
    title: "Our Kurnool Showroom",
    text: `${SHOWROOM_INFO.address}. ${SHOWROOM_INFO.timing}.`,
    cta: "Get Directions",
    href: SHOWROOM_INFO.googleMapsUrl,
    external: true,
    map: SHOWROOM_INFO.mapEmbedUrl,
  },
];

export const StoryCards: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setIsMobile(window.innerWidth <= 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = cards.length - 1;
  const clamped = Math.min(index, maxIndex);

  const swipeStart = useRef<number | null>(null);
  const onSwipeStart = (e: React.PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onSwipeEnd = (e: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) < 35) return;
    if (dx < 0) {
      setIndex((prev) => Math.min(maxIndex, prev + 1));
    } else {
      setIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const renderCard = (c: (typeof cards)[0]) => (
    <article className="story-card" style={{ width: "100%", height: "100%" }}>
      <h2 className="story-heading">{c.heading}</h2>
      <div className="story-img">
        {c.map ? (
          <iframe
            src={c.map}
            title="Showroom location on Google Maps"
            className="story-map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <Image src={c.image} alt={c.alt} fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: "cover" }} />
        )}
      </div>
      <h3 className="story-title">{c.title}</h3>
      <p className="story-text">{c.text}</p>
      {c.external ? (
        <a href={c.href} target="_blank" rel="noopener noreferrer" className="story-link">
          {c.cta} <span aria-hidden="true">→</span>
        </a>
      ) : (
        <Link href={c.href} className="story-link">
          {c.cta} <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );

  return (
    <section className="story" aria-label="About Casablanca Sofas">
      {mounted && isMobile ? (
        <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
          {/* Sliding track */}
          <div
            style={{ overflow: "hidden", touchAction: "pan-y", width: "100%" }}
            onPointerDown={onSwipeStart}
            onPointerUp={onSwipeEnd}
            onPointerCancel={() => (swipeStart.current = null)}
          >
            <motion.div
              className="story-mobile-track"
              initial={false}
              animate={{ x: `-${clamped * 100}%` }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "flex-start",
              }}
            >
              {cards.map((c) => (
                <div
                  key={c.heading}
                  style={{
                    width: "100%",
                    minWidth: "100%",
                    flexShrink: 0,
                    padding: "0 0.25rem",
                  }}
                >
                  {renderCard(c)}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Progress bar & navigation arrows */}
          <div
            className="story-mobile-controls"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.25rem 0.25rem 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, marginRight: "1rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  color: "#555555",
                  whiteSpace: "nowrap",
                }}
              >
                {String(clamped + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
              </span>
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  height: "2px",
                  background: "#E4E4E4",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    background: "#111111",
                  }}
                  animate={{ width: `${((clamped + 1) / cards.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
                disabled={clamped === 0}
                aria-label="Previous story"
                className="audo-arrow"
                style={{ width: "34px", height: "34px" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIndex((prev) => Math.min(maxIndex, prev + 1))}
                disabled={clamped >= maxIndex}
                aria-label="Next story"
                className="audo-arrow audo-arrow--next"
                style={{ width: "34px", height: "34px" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="story-grid">
          {cards.map((c) => (
            <div key={c.heading}>{renderCard(c)}</div>
          ))}
        </div>
      )}
    </section>
  );
};
