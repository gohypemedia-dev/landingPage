"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Portrait 9:16 reels. When a look is the front card it plays, in this order of preference:
//   instagram: a public Instagram reel link, e.g. "https://www.instagram.com/reel/ABC123xyz/" (Instagram's own embed player)
//   video:     a video file in /public, e.g. "/reels/my-reel.mp4"
// Otherwise (and on the side cards) the poster image is shown.
const looks: { title: string; href: string; poster: string; video?: string; instagram?: string }[] = [
  { title: "Power Recliners", href: "/recliners-kurnool", poster: "/images/catalogue-recliner-featured.jpg" },
  { title: "Wooden Queen Bed", href: "/beds-cots-kurnool", poster: "/images/796767853_18093958568640692_8492671734547745348_n.webp" },
  { title: "Family Dining Sets", href: "/dining-tables-kurnool", poster: "/images/dining-space.jpg" },
  { title: "Signature Living", href: "/sofas-kurnool", poster: "/images/hero.jpg", video: "/story.mp4" },
  { title: "Fluted Lounge Sofa", href: "/sofas-kurnool", poster: "/images/mf-fluted-luxury-lounge.jpg" },
  { title: "Bedroom Makeover", href: "/beds-cots-kurnool", poster: "/images/bedroom-space.jpg" },
  { title: "Curtains & Blinds", href: "/curtains-blinds-kurnool", poster: "/images/banner-living.jpg" },
];

// "https://www.instagram.com/reel/ABC123/?igsh=..." -> "https://www.instagram.com/reel/ABC123/embed/"
const instagramEmbed = (url: string) => {
  const m = url.match(/instagram\.com\/(reel|reels|p)\/([A-Za-z0-9_-]+)/);
  return m ? `https://www.instagram.com/${m[1] === "p" ? "p" : "reel"}/${m[2]}/embed/` : null;
};

// Card width and how far each side card sits from the centre, per screen size
const layoutFor = (w: number) => (w <= 640 ? { card: 210, spread: 72 } : w <= 1100 ? { card: 250, spread: 135 } : { card: 290, spread: 175 });

export const ShopByLook: React.FC = () => {
  // The video reel ("Signature Living") stays in front until the visitor moves the carousel
  const [active, setActive] = useState(() => Math.max(0, looks.findIndex((l) => l.video || l.instagram)));
  const [muted, setMuted] = useState(true);
  const [layout, setLayout] = useState({ card: 290, spread: 175 });
  const swipeStart = useRef<number | null>(null);

  const go = (dir: number) => setActive((i) => (i + dir + looks.length) % looks.length);

  useEffect(() => {
    const update = () => setLayout(layoutFor(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cardHeight = Math.round((layout.card * 16) / 9);

  return (
    <section
      id="shop-by-look"
      className="sbl"
      aria-labelledby="sbl-heading"
    >
      <div className="audo-header-row sbl-head">
        <h2 id="sbl-heading" className="audo-tab-btn is-active">
          Shop By Look
        </h2>
      </div>

      <div
        className="sbl-stage"
        style={{ height: cardHeight + 70 }}
        aria-roledescription="carousel"
        onPointerDown={(e) => (swipeStart.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipeStart.current === null) return;
          const dx = e.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        {looks.map((look, i) => {
          // Shortest distance around the loop, so cards fan out on both sides
          let d = i - active;
          if (d > looks.length / 2) d -= looks.length;
          if (d < -looks.length / 2) d += looks.length;
          const dist = Math.abs(d);
          const isActive = d === 0;

          return (
            <motion.div
              key={look.title}
              className={`sbl-card${isActive ? " is-active" : ""}`}
              initial={false}
              animate={{ x: d * layout.spread, scale: 1 - dist * 0.13, opacity: dist > 3 ? 0 : 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ width: layout.card, marginLeft: -layout.card / 2, zIndex: 10 - dist, pointerEvents: dist > 3 ? "none" : "auto" }}
              onClick={() => !isActive && setActive(i)}
              aria-hidden={!isActive}
            >
              <div className="sbl-media" style={{ height: cardHeight }}>
                {isActive && look.instagram && instagramEmbed(look.instagram) ? (
                  <iframe
                    src={instagramEmbed(look.instagram)!}
                    title={`${look.title} on Instagram`}
                    className="sbl-ig"
                    loading="lazy"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : isActive && look.video ? (
                  <video src={look.video} poster={look.poster} autoPlay muted={muted} loop playsInline />
                ) : (
                  <Image src={look.poster} alt={look.title} fill sizes="300px" style={{ objectFit: "cover" }} />
                )}
                {(look.video || look.instagram) && !(isActive && look.instagram) && (
                  <span className="sbl-badge" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Reel
                  </span>
                )}
                {isActive && look.video && (
                  <button type="button" className="sbl-mute" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute reel" : "Mute reel"}>
                    {muted ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5 6 9H2v6h4l5 4V5ZM23 9l-6 6M17 9l6 6" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5 6 9H2v6h4l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
                      </svg>
                    )}
                  </button>
                )}
                {!(isActive && look.instagram) && <span className="sbl-title">{look.title}</span>}
              </div>
              {/* Shop Now only on the front card */}
              {isActive && (
                <Link href={look.href} className="sbl-shop">
                  Shop Now <span aria-hidden="true">→</span>
                </Link>
              )}
            </motion.div>
          );
        })}

        <button type="button" className="audo-side-arrow audo-side-arrow--prev sbl-arrow" onClick={() => go(-1)} aria-label="Previous look">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button type="button" className="audo-side-arrow audo-side-arrow--next sbl-arrow" onClick={() => go(1)} aria-label="Next look">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
};
