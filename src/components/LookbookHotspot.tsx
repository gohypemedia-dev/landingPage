"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CurrencyCode, Product } from "@/types";
import {
  LOOKBOOK_ROOMS,
  formatPriceWithCurrency,
  getWhatsAppEnquiryUrl,
} from "@/data/products";
import { useCatalog } from "@/lib/catalog/context";

interface LookbookHotspotProps {
  currency: CurrencyCode;
  onQuickView: (p: Product) => void;
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Slide geometry (percent of the stage) for the centre slide and its neighbours.
const SLOT_DESKTOP = {
  center: { left: "23%", width: "54%", top: "19%", height: "62%", opacity: 1 },
  prev: { left: "0%", width: "17%", top: "0%", height: "100%", opacity: 1 },
  next: { left: "83%", width: "17%", top: "0%", height: "100%", opacity: 1 },
  farPrev: { left: "-20%", width: "17%", top: "0%", height: "100%", opacity: 0 },
  farNext: { left: "103%", width: "17%", top: "0%", height: "100%", opacity: 0 },
};

const SLOT_MOBILE = {
  center: { left: "6%", width: "88%", top: "3%", height: "94%", opacity: 1 },
  prev: { left: "-82%", width: "84%", top: "3%", height: "94%", opacity: 0.35 },
  next: { left: "98%", width: "84%", top: "3%", height: "94%", opacity: 0.35 },
  farPrev: { left: "-160%", width: "84%", top: "3%", height: "94%", opacity: 0 },
  farNext: { left: "180%", width: "84%", top: "3%", height: "94%", opacity: 0 },
};

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const LookbookHotspot: React.FC<LookbookHotspotProps> = ({ currency, onQuickView }) => {
  const { products: PRODUCTS } = useCatalog();
  const rooms = LOOKBOOK_ROOMS;
  const total = rooms.length;
  const [active, setActive] = useState(0);
  const [openHotspot, setOpenHotspot] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sectionRef = useRef<HTMLElement>(null);
  const drag = useRef({ down: false, startX: 0, moved: false });
  const inView = useInView(sectionRef, { amount: 0.4 });

  // Slides advance on their own; hovering, dragging or an open pin holds them still.
  useEffect(() => {
    if (!inView || hovering || openHotspot) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % total);
    }, 5500);
    return () => window.clearInterval(id);
  }, [inView, hovering, openHotspot, total]);

  const go = (index: number) => {
    setOpenHotspot(null);
    setActive(((index % total) + total) % total);
  };

  const relOf = (i: number) => {
    const half = Math.floor(total / 2);
    return ((i - active + total + half) % total) - half;
  };

  const slotFor = (rel: number) => {
    const slot = isMobile ? SLOT_MOBILE : SLOT_DESKTOP;
    if (rel === 0) return slot.center;
    if (rel === -1) return slot.prev;
    if (rel === 1) return slot.next;
    return rel < 0 ? slot.farPrev : slot.farNext;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (drag.current.down && Math.abs(e.clientX - drag.current.startX) > 6) drag.current.moved = true;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { down: true, startX: e.clientX, moved: false };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.down = false;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="lookbook-inspiration" ref={sectionRef} className="insp-frame">
      <motion.div
        className="insp-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <h2>Inspiration</h2>
        <p>
          Inspire a more creative way of living through good design that is good to everyone.
          Tap the + pins to explore the pieces in each room.
        </p>
      </motion.div>

      <div
        className="insp-stage"
        data-cursor="drag"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Inspiration rooms"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(active + 1);
          if (e.key === "ArrowLeft") go(active - 1);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          drag.current.down = false;
          setHovering(false);
        }}
        onPointerEnter={() => setHovering(true)}
      >
        {rooms.map((room, i) => {
          const rel = relOf(i);
          const isCenter = rel === 0;
          return (
            <motion.div
              key={room.id}
              className="insp-slide"
              initial={false}
              animate={slotFor(rel)}
              transition={{ duration: 0.85, ease: EASE }}
              style={{ zIndex: isCenter ? 2 : 1, pointerEvents: Math.abs(rel) > 1 ? "none" : "auto" }}
              onClick={() => {
                if (drag.current.moved) return;
                if (!isCenter) go(i);
                else setOpenHotspot(null);
              }}
            >
              <div className="insp-slide__img">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 900px) 100vw, 60vw"
                  style={{ objectFit: "cover" }}
                  draggable={false}
                />
              </div>

              {isCenter &&
                room.hotspots.map((hs) => {
                  const product = PRODUCTS.find((p) => p.id === hs.productId);
                  const isOpen = openHotspot === hs.id;
                  const below = hs.yPercent < 50;
                  return (
                    <div
                      key={hs.id}
                      className="insp-hotspot"
                      style={{ top: `${hs.yPercent}%`, left: `${hs.xPercent}%`, zIndex: isOpen ? 20 : 5 }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="insp-hotspot__btn"
                        aria-label={`View ${hs.title}`}
                        aria-expanded={isOpen}
                        onClick={() => setOpenHotspot(isOpen ? null : hs.id)}
                      >
                        <span style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            className={`insp-popover ${below ? "is-below" : "is-above"}`}
                            initial={{ opacity: 0, y: below ? -6 : 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: below ? -6 : 6 }}
                            transition={{ duration: 0.22, ease: EASE }}
                          >
                            {product && (
                              <div className="insp-popover__img">
                                <Image
                                  src={product.primaryImage}
                                  alt={hs.title}
                                  fill
                                  sizes="220px"
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                            )}
                            <div className="insp-popover__name">{hs.title}</div>
                            <div className="insp-popover__price" suppressHydrationWarning>
                              {formatPriceWithCurrency(hs.priceUSD, currency, product?.priceINR)}
                            </div>
                            <div className="insp-popover__actions">
                              {product && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenHotspot(null);
                                    onQuickView(product);
                                  }}
                                >
                                  Quick View
                                </button>
                              )}
                              <a
                                href={getWhatsAppEnquiryUrl(
                                  hs.title,
                                  undefined,
                                  undefined,
                                  formatPriceWithCurrency(hs.priceUSD, currency, product?.priceINR)
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                WhatsApp
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </motion.div>
          );
        })}

      </div>

      <div className="insp-caption">
        <AnimatePresence mode="wait">
          <motion.div
            key={rooms[active].id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{rooms[active].title}</h3>
            <span>{rooms[active].subtitle}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="insp-progress">
        <span>
          {pad(active + 1)} / {pad(total)}
        </span>
        <div className="insp-progress__bar">
          <motion.div
            className="insp-progress__fill"
            animate={{ width: `${((active + 1) / total) * 100}%` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
        </div>
      </div>
    </section>
  );
};
