"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { CurrencyCode, Product, ProductFinish } from "@/types";
import { PRODUCTS, formatPriceWithCurrency } from "@/data/products";

interface AtmosphereShowcaseProps {
  currency: CurrencyCode;
  onQuickView: (p: Product) => void;
  onAddToCart?: (p: Product, f: ProductFinish) => void;
  /** Rendered between the second and third banner (the Inspiration carousel). */
  children?: React.ReactNode;
}

interface BannerData {
  id: string;
  index: string;
  title: string;
  desc: string;
  href: string;
  linkText: string;
  image: string;
  alt: string;
  objectPosition: string;
  /** Average tone of the photo, painted behind it so nothing ever flashes white. */
  bg: string;
  /** Side the title + copy sit on; the product column takes the other side. */
  side: "left" | "right";
  products: Product[];
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const COLUMN_SPEED = 60; // px per second, drifting upward on desktop
const REEL_SPEED = 44; // px per second, drifting sideways on mobile
const COPIES = 4;

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

// A looping track that drifts on its own and can be dragged / flicked by hand.
// After a flick it eases back to the gentle drift, so it never stops.
const AutoDragTrack: React.FC<{
  axis: "x" | "y";
  speed: number;
  /** Pixels of clear space before the first item (keeps it below the nav bar). */
  inset?: number;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ axis, speed, inset = 0, active, className, children }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const base = reduceMotion ? 0 : speed;
  const s = useRef({ offset: 0, vel: speed, period: 0, dragging: false, last: 0, lastT: 0, moved: 0 });

  // Length of one copy of the items, so the loop can wrap invisibly.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const cs = getComputedStyle(track);
      const gap = parseFloat(axis === "y" ? cs.rowGap : cs.columnGap) || 0;
      const total = axis === "y" ? track.scrollHeight : track.scrollWidth;
      s.current.period = (total + gap) / COPIES;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [axis]);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const st = s.current;
      const track = trackRef.current;
      if (track) {
        if (!st.dragging) {
          st.offset += st.vel * dt;
          st.vel += (base - st.vel) * Math.min(dt * 2.2, 1);
        }
        if (st.period > 0) st.offset = ((st.offset % st.period) + st.period) % st.period;
        const pos = inset - st.period - st.offset;
        track.style.transform =
          axis === "y" ? `translate3d(0, ${pos}px, 0)` : `translate3d(${pos}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, axis, base, inset]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const st = s.current;
    const read = (ev: { clientX: number; clientY: number }) => (axis === "y" ? ev.clientY : ev.clientX);
    st.dragging = true;
    st.moved = 0;
    st.last = read(e);
    st.lastT = performance.now();
    st.vel = 0;

    const move = (ev: PointerEvent) => {
      const pos = read(ev);
      const now = performance.now();
      const d = st.last - pos;
      st.offset += d;
      st.moved += Math.abs(d);
      const dt = Math.max((now - st.lastT) / 1000, 0.001);
      st.vel = st.vel * 0.7 + (d / dt) * 0.3;
      st.last = pos;
      st.lastT = now;
    };
    const up = () => {
      st.dragging = false;
      if (performance.now() - st.lastT > 90) st.vel = base;
      st.vel = Math.max(-3500, Math.min(3500, st.vel));
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  return (
    <div
      className={className}
      onPointerDown={onPointerDown}
      // A drag must not count as a click on the card underneath.
      onClickCapture={(e) => {
        if (s.current.moved > 6) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      style={{ touchAction: axis === "y" ? "none" : "pan-y", userSelect: "none", cursor: "grab" }}
    >
      <div ref={trackRef} className={`atm-loop is-${axis}`}>
        {Array.from({ length: COPIES }, (_, i) => (
          <React.Fragment key={i}>{children}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

const BannerProductCard: React.FC<{
  product: Product;
  currency: CurrencyCode;
  onQuickView: (p: Product) => void;
}> = ({ product, currency, onQuickView }) => (
  <div className="atm-card" onClick={() => onQuickView(product)}>
    <div className="atm-card__image">
      <Image
        src={product.primaryImage}
        alt={product.name}
        fill
        sizes="400px"
        draggable={false}
        style={{ objectFit: "contain" }}
      />
    </div>
    <div className="atm-card__meta">
      <h3 className="atm-card__name">{product.name}</h3>
      <div className="atm-card__price" suppressHydrationWarning>
        {product.priceOnEnquiry
          ? "Price on enquiry"
          : formatPriceWithCurrency(product.priceUSD, currency, product.priceINR)}
      </div>
    </div>
  </div>
);

// Each letter of the title fades up in turn once the banner is on screen.
const SplitTitle: React.FC<{ text: string; show: boolean }> = ({ text, show }) => (
  <h2 className="atm-title" aria-label={text}>
    {Array.from(text).map((ch, i) => (
      <motion.span
        key={i}
        aria-hidden="true"
        className="atm-letter"
        initial={false}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={show ? { duration: 0.85, delay: 0.1 + i * 0.075, ease: EASE } : { duration: 0.3 }}
      >
        {ch === " " ? " " : ch}
      </motion.span>
    ))}
  </h2>
);

// A banner scrolls with the page like any other section. Inside it the photo
// drifts slowly (parallax), the title reveals letter by letter, and the product
// column keeps moving by itself until you grab it.
const AtmosphereBanner: React.FC<{
  data: BannerData;
  currency: CurrencyCode;
  onQuickView: (p: Product) => void;
}> = ({ data, currency, onQuickView }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const inView = useInView(frameRef, { margin: "160px 0px 160px 0px" });
  const [revealed, setRevealed] = useState(false);

  // Reveal as the banner settles into view; reset only after it has left.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) setRevealed(true);
        else if (entry.intersectionRatio < 0.03) setRevealed(false);
      },
      { threshold: [0, 0.03, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const isLeft = data.side === "left";
  const cards = data.products.map((p) => (
    <BannerProductCard key={p.id} product={p} currency={currency} onQuickView={onQuickView} />
  ));

  return (
    <section ref={sectionRef} className="atm-banner" aria-label={data.title}>
      <div ref={frameRef} className="atm-frame" style={{ backgroundColor: data.bg }}>
        <motion.div className="atm-image" style={{ y: imageY }}>
          <Image
            src={data.image}
            alt={data.alt}
            fill
            loading="eager"
            fetchPriority="low"
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: data.objectPosition }}
          />
        </motion.div>
        <div className="atm-shade" aria-hidden="true" />

        <div className={`atm-title-block ${isLeft ? "is-left" : "is-right"}`}>
          <SplitTitle text={data.title} show={revealed} />
        </div>

        <motion.div
          className={`atm-copy-block ${isLeft ? "is-left" : "is-right"}`}
          initial={false}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={revealed ? { duration: 0.8, delay: 0.55, ease: EASE } : { duration: 0.3 }}
        >
          <p className="atm-copy">
            <span className="atm-bullet" aria-hidden="true" />
            {data.desc}
          </p>
          <Link href={data.href} className="atm-shop-btn">
            <span>{data.linkText}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {isMobile ? (
          <div className="atm-mobile-reel" data-cursor="drag">
            <AutoDragTrack axis="x" speed={REEL_SPEED} active={inView} className="atm-reel-viewport">
              {cards}
            </AutoDragTrack>
          </div>
        ) : (
          <div className={`atm-col-wrap ${isLeft ? "is-right" : "is-left"}`} data-cursor="drag">
            <AutoDragTrack axis="y" speed={COLUMN_SPEED} inset={96} active={inView} className="atm-col-viewport">
              {cards}
            </AutoDragTrack>
          </div>
        )}
      </div>
    </section>
  );
};

// Ids first (in order), then anything else to fill the column; a product whose
// photo is the banner photo itself is skipped so it never repeats on the page.
const pick = (ids: string[], bannerImage: string, count = 6): Product[] => {
  const out: Product[] = [];
  const add = (p?: Product) => {
    if (p && p.primaryImage !== bannerImage && !out.some((x) => x.id === p.id)) out.push(p);
  };
  ids.forEach((id) => add(PRODUCTS.find((p) => p.id === id)));
  PRODUCTS.forEach((p) => out.length < count && add(p));
  return out;
};

export const AtmosphereShowcase: React.FC<AtmosphereShowcaseProps> = ({ currency, onQuickView, children }) => {
  const livingImage = "/images/banner-living.jpg";
  const bedroomImage = "/images/bedroom-space.jpg";
  const officeImage = "/images/dining-space.jpg";
  const diningImage = "/images/lookbook.jpg";

  const banners: BannerData[] = [
    {
      id: "living",
      index: "01",
      title: "Living.",
      desc: "Handcrafted modular seating, German motorized recliners, and curved statement loungers.",
      href: "/sofas-kurnool",
      linkText: "Shop Living",
      image: livingImage,
      alt: "Living Atmosphere Mallikarjuna Furniture World",
      objectPosition: "center 55%",
      bg: "#85705C",
      side: "left",
      products: pick(
        [
          "contemporary-comfort-sofa",
          "cloudcomfort-motorized-recliner",
          "aurelia-wave-sofa",
          "royal-navy-tufted-suite",
          "penthouse-modular-sectional",
          "elysian-grand-living-suite",
        ],
        livingImage
      ),
    },
    {
      id: "bedroom",
      index: "02",
      title: "Bedroom.",
      desc: "Solid Burma teakwood king cots with German gas-lift hydraulic storage and custom headboards.",
      href: "/beds-cots-kurnool",
      linkText: "Shop Bedroom",
      image: bedroomImage,
      alt: "Bedroom Atmosphere Mallikarjuna Furniture World",
      objectPosition: "center 60%",
      bg: "#9E8B76",
      side: "right",
      products: pick(["serenity-tufted-king-bed", "bespoke-motorized-curtains", "heritage-teakwood-king-cot"], bedroomImage),
    },
    {
      id: "office",
      index: "03",
      title: "Office.",
      desc: "Statement lounge seating and stone-top tables for studies, home offices and executive suites.",
      href: "/furniture",
      linkText: "Shop Office",
      image: officeImage,
      alt: "Office Atmosphere Mallikarjuna Furniture World",
      objectPosition: "center 55%",
      bg: "#524535",
      side: "left",
      products: pick(["cloudcomfort-motorized-recliner", "plinth-natural-stone-table", "contemporary-comfort-sofa"], officeImage),
    },
    {
      id: "dining",
      index: "04",
      title: "Dining.",
      desc: "Monolithic Italian marble and solid teak dining tables with sculptural ergonomic chairs.",
      href: "/dining-tables-kurnool",
      linkText: "Shop Dining",
      image: diningImage,
      alt: "Dining Atmosphere Mallikarjuna Furniture World",
      objectPosition: "center 60%",
      bg: "#86745F",
      side: "right",
      products: pick(["italian-marble-dining-table", "plinth-natural-stone-table", "penthouse-modular-sectional"], diningImage),
    },
  ];

  return (
    <div id="atmosphere-showcases" className="atm-wrap">
      <AtmosphereBanner data={banners[0]} currency={currency} onQuickView={onQuickView} />
      <AtmosphereBanner data={banners[1]} currency={currency} onQuickView={onQuickView} />
      {children}
      <AtmosphereBanner data={banners[2]} currency={currency} onQuickView={onQuickView} />
      <AtmosphereBanner data={banners[3]} currency={currency} onQuickView={onQuickView} />
    </div>
  );
};
