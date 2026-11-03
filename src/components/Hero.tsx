"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// The three lines of hero copy live here so they are easy to change.
const HERO_EYEBROW = "NEW ARRIVALS";
const HERO_TITLE = "New Designs.";
const HERO_CTA = "Shop Now";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export const Hero: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Scroll-linked cinematic scale & depth transition
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const videoRadius = useTransform(scrollYProgress, [0, 1], ["0px", "28px"]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0px", "-45px"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
    [desktopVideoRef.current, mobileVideoRef.current].forEach((video) => {
      if (video) {
        video.defaultMuted = true;
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Handled browser autoplay restrictions gracefully
          });
        }
      }
    });
  }, []);

  return (
    <section id="hero" ref={containerRef} className="hero-section">
      {/* Scroll-Linked 3D Cinematic Video Stage */}
      <motion.div
        className="hero-video-wrapper"
        style={{
          scale: isMounted ? videoScale : 1,
          borderRadius: isMounted ? videoRadius : "0px",
          y: isMounted ? videoY : "0%",
          transformOrigin: "center center",
          overflow: "hidden",
        }}
      >
        {/* Desktop Landscape Video (16:9 / 1280x720) */}
        <video
          ref={desktopVideoRef}
          src="/hero.mp4"
          poster="/images/hero.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="hero-video-element hero-video-desktop"
        />

        {/* Mobile Portrait Video (9:16 / 720x1280 story.mp4) */}
        <video
          ref={mobileVideoRef}
          src="/story.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="hero-video-element hero-video-mobile"
        />

        {/* Ambient Film Vignette Gradient */}
        <div className="hero-video-overlay" />
      </motion.div>

      {/* Centred hero copy: eyebrow, large title, one button */}
      <div className="hero-content-container">
        <motion.div
          style={{
            y: isMounted ? textY : "0px",
            opacity: isMounted ? textOpacity : 1,
          }}
          className="hero-text-block"
        >
          <motion.span
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            {HERO_EYEBROW}
          </motion.span>

          <h1 className="hero-title" aria-label={HERO_TITLE}>
            {Array.from(HERO_TITLE).map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="hero-letter"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease: EASE }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.div className="hero-cta-wrap" style={{ opacity: isMounted ? textOpacity : 1 }}>
          <motion.a
            href="/collections/new-designs"
            id="hero-shop-now-btn"
            className="hero-cta-btn"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
          >
            <span>{HERO_CTA}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
