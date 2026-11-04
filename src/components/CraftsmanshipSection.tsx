"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { SHOWROOM_INFO, getWhatsAppEnquiryUrl } from "@/data/products";

interface CraftHotspot {
  id: string;
  top: string;
  left: string;
  xPercent: number;
  yPercent: number;
  title: string;
  category: string;
  desc: string;
  features: string[];
}

const CRAFT_HOTSPOTS: CraftHotspot[] = [
  {
    id: "joinery",
    top: "64%",
    left: "68%",
    xPercent: 68,
    yPercent: 64,
    title: "Mortise & Tenon Joinery",
    category: "ARTISANAL TECHNIQUE",
    desc: "Interlocking precision wooden dowels engineered without reliance on metal brackets, eliminating creaks and wobbling over decades.",
    features: [
      "Zero-wobble structural lock",
      "Hand-planed and aligned by master carpenters",
      "Immune to seasonal thermal contraction",
    ],
  },
  {
    id: "teak",
    top: "38%",
    left: "34%",
    xPercent: 34,
    yPercent: 38,
    title: "Kiln-Seasoned Burma Teak",
    category: "CORE TIMBER SPECIFICATION",
    desc: "Chemically treated Grade-A mature teakwood stabilized to under 12% moisture content to withstand severe Indian monsoons and dry summers.",
    features: [
      "15-year formal termite-proof warranty",
      "Naturally rich in preservative teak oils",
      "100% solid core — zero MDF or particle board",
    ],
  },
];

const CRAFT_METRICS = [
  {
    value: "15 YEARS",
    label: "STRUCTURAL GUARANTEE",
    desc: "Termite & borer replacement warranty",
    icon: "✦",
  },
  {
    value: "GRADE-A",
    label: "BURMA TEAKWOOD",
    desc: "Kiln-seasoned < 12% moisture",
    icon: "❖",
  },
  {
    value: "25,000",
    label: "TESTED CYCLES",
    desc: "German OKIN silent motor actuators",
    icon: "⚙",
  },
  {
    value: "40+ DENSITY",
    label: "VIRGIN COLD FOAM",
    desc: "Zero-sag lifetime comfort shape",
    icon: "◈",
  },
];

export const CraftsmanshipSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsColRef = useRef<HTMLDivElement>(null);
  const showcaseCardRef = useRef<HTMLDivElement>(null);

  const [activePillar, setActivePillar] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Parallax Scroll Tracking for overall section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Dedicated Scroll Tracking for the Craftsmanship Pillar Cards Column
  const { scrollYProgress: cardsScrollProgress } = useScroll({
    target: cardsColRef,
    offset: ["start end", "end start"],
  });

  // Parallax Transforms
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["-100px", "100px"]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.015, 0.045, 0.045, 0.015]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [-85, 85]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [70, -70]);

  // Image internal parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.16, 1.06, 1.16]);

  // Differential Column Parallax Speeds & Exit/Entry Dynamics
  // Left column (Pillar cards): When user scrolls down, moves upward and disappears; when scrolling back up, reappears
  const leftColY = useTransform(
    cardsScrollProgress,
    [0, 0.22, 0.44, 0.72, 0.95],
    [30, 0, 0, -140, -190]
  );
  const leftColOpacity = useTransform(
    cardsScrollProgress,
    [0, 0.18, 0.44, 0.70, 0.95],
    [0.2, 1, 1, 0, 0]
  );
  const leftColPointerEvents = useTransform(cardsScrollProgress, (v) =>
    v > 0.70 ? "none" : "auto"
  );

  // Individual Pillar Cards Scroll-linked Micro Transforms (Cascading upward exit & downward re-entry)
  const card0Y = useTransform(cardsScrollProgress, [0.42, 0.64], [0, -40]);
  const card0Opacity = useTransform(cardsScrollProgress, [0.42, 0.62], [1, 0]);

  const card1Y = useTransform(cardsScrollProgress, [0.45, 0.67], [0, -40]);
  const card1Opacity = useTransform(cardsScrollProgress, [0.45, 0.65], [1, 0]);

  const card2Y = useTransform(cardsScrollProgress, [0.48, 0.70], [0, -40]);
  const card2Opacity = useTransform(cardsScrollProgress, [0.48, 0.68], [1, 0]);

  const card3Y = useTransform(cardsScrollProgress, [0.51, 0.73], [0, -40]);
  const card3Opacity = useTransform(cardsScrollProgress, [0.51, 0.71], [1, 0]);

  const cardMotionValues = [
    { y: card0Y, opacity: card0Opacity },
    { y: card1Y, opacity: card1Opacity },
    { y: card2Y, opacity: card2Opacity },
    { y: card3Y, opacity: card3Opacity },
  ];

  const rightColY = useTransform(scrollYProgress, [0, 1], [45, -45]);
  const metricsY = useTransform(scrollYProgress, [0, 1], [22, -22]);

  // Header 3D Scroll Perspective Lift
  const headerY = useTransform(scrollYProgress, [0, 0.3], [28, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [0.5, 1]);

  // 3D Mouse Tracking Physics on Workshop Showcase Canvas
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 200, mass: 0.55 };
  const cardRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const cardRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  // Specular Light Glare Coordinates
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["12%", "88%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["12%", "88%"]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showcaseCardRef.current) return;
    const rect = showcaseCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleCanvasMouseEnter = () => {
    setIsHoveringCanvas(true);
  };

  const handleCanvasMouseLeave = () => {
    setIsHoveringCanvas(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleHotspotMouseEnter = (id: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setActiveHotspot(id);
  };

  const handleHotspotMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setActiveHotspot(null);
    }, 240);
  };

  const handlePopoverMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const pillars = [
    {
      title: "Mature Burma Teakwood",
      tag: "15-YEAR GUARANTEE",
      desc: "Every cot, dining table, and sofa frame is handcrafted from chemically treated, kiln-seasoned Grade-A Burma teakwood. Backed by our formal 15-year termite-proof replacement guarantee.",
      specs: ["Kiln-dried < 12% moisture", "100% Solid core lumber", "Natural beeswax polish"],
    },
    {
      title: "Italian Natural Stone & Marble",
      tag: "STAIN-SHIELD NANO SEAL",
      desc: "Natural Kunis Breccia and Italian Onyx marble tops treated with 3-layer nanotechnology to resist stains from hot curries, oil, and citrus while preserving geologic mineral veining.",
      specs: ["Zero-stain nanocoat", "Hand-beveled 20mm profile", "Bookmatched mineral patterns"],
    },
    {
      title: "German OKIN Recliner Mechanisms",
      tag: "5-YEAR MOTOR WARRANTY",
      desc: "German engineered silent motorized linear actuators tested for 25,000 smooth cycles. Zero-gravity multi-angle ergonomic relief with USB fast charging.",
      specs: ["Ultra-quiet < 42dB operation", "Heavy-gauge alloy linkage", "Integrated USB-C power"],
    },
    {
      title: "High-Resilience Cold-Cure Foam",
      tag: "40-DENSITY COMFORT",
      desc: "High-density virgin cold-cure foam paired with pocketed steel springs ensures that sofa cushions maintain structured architectural shape without sagging over decades.",
      specs: ["40+ kg/m³ virgin density", "Independent pocket coils", "Breathable micro-cellular core"],
    },
  ];

  return (
    <section
      ref={containerRef}
      id="craftsmanship"
      style={{
        padding: "7.5rem 0 8rem",
        backgroundColor: "var(--color-navy)",
        color: "#FAF8F5",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 1. Background Parallax Typographic Watermark */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "5%",
          left: "-4%",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(5rem, 11vw, 10rem)",
          fontWeight: 300,
          letterSpacing: "0.14em",
          color: "rgba(255, 255, 255, 0.03)",
          textTransform: "uppercase",
          userSelect: "none",
          pointerEvents: "none",
          x: watermarkX,
          opacity: watermarkOpacity,
          zIndex: 0,
        }}
      >
        SEASONED TEAK · HANDMADE JOINERY · MALLIKARJUNA
      </motion.div>

      {/* 2. Ambient Parallax Glow Orbs */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "12%",
          right: "-5%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197, 164, 93, 0.14) 0%, rgba(16, 43, 70, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          y: orb1Y,
          zIndex: 0,
        }}
      />
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-6%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(24, 134, 75, 0.08) 0%, rgba(16, 43, 70, 0) 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          y: orb2Y,
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Editorial Pull Quote Header with 3D Scroll Lift */}
        <motion.div
          style={{
            y: headerY,
            opacity: headerOpacity,
            textAlign: "center",
            maxWidth: "960px",
            margin: "0 auto 4.75rem",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--color-gold)",
              }}
            />
            <span
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "var(--color-gold)",
              }}
            >
              SHOWROOM PHILOSOPHY & ARTISANAL TRUTH
            </span>
          </div>

          <blockquote
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.85rem, 3.6vw, 2.95rem)",
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
              color: "#FAF8F5",
              margin: "0 0 1.5rem",
              textShadow: "0 2px 14px rgba(0, 0, 0, 0.4)",
            }}
          >
            “True luxury in furniture comes not from excessive ornament, but from the{" "}
            <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>purity of seasoned teak</span>,
            uncompromising joinery, and comfort that endures through generations.”
          </blockquote>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-sand)",
            }}
          >
            <span>MALLIKARJUNA FURNITURE WORLD</span>
            <span style={{ color: "var(--color-gold)" }}>·</span>
            <span>KURNOOL, ANDHRA PRADESH</span>
          </div>
        </motion.div>

        {/* 2-Column Split: 3D Interactive Pillars + 3D Parallax Workshop Canvas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.08fr",
            gap: "3.75rem",
            alignItems: "start",
          }}
          className="craftsmanship-grid"
        >
          {/* LEFT: 4 Interactive Pillars with 3D Elevation & Spec Highlights */}
          <div ref={cardsColRef} style={{ position: "relative" }}>
            <motion.div
              style={{
                y: leftColY,
                opacity: leftColOpacity,
                pointerEvents: leftColPointerEvents,
                display: "flex",
                flexDirection: "column",
                gap: "1.15rem",
              }}
            >
              {pillars.map((p, idx) => {
                const isActive = activePillar === idx;
                const cardMotion = cardMotionValues[idx] || cardMotionValues[0];
                return (
                  <motion.div
                    key={idx}
                    style={{
                      y: cardMotion.y,
                      opacity: cardMotion.opacity,
                    }}
                  >
                    <motion.div
                      onClick={() => setActivePillar(idx)}
                      whileHover={{ y: -3, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        padding: "1.65rem 1.75rem",
                        borderRadius: "10px",
                        background: isActive
                          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(197, 164, 93, 0.06) 100%)"
                          : "rgba(255, 255, 255, 0.025)",
                        border: isActive
                          ? "1px solid var(--color-gold)"
                          : "1px solid rgba(255, 255, 255, 0.08)",
                        boxShadow: isActive
                          ? "0 16px 36px rgba(0, 0, 0, 0.35), 0 0 20px rgba(197, 164, 93, 0.15)"
                          : "none",
                        cursor: "pointer",
                        transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Active Pillar Left Accent Bar */}
                      {isActive && (
                        <motion.div
                          layoutId="activePillarBar"
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            width: "3px",
                            background: "var(--color-gold)",
                            boxShadow: "0 0 10px var(--color-gold)",
                          }}
                        />
                      )}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.6rem",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.35rem",
                            color: isActive ? "var(--color-gold)" : "#FAF8F5",
                            fontWeight: 400,
                            margin: 0,
                            lineHeight: 1.25,
                          }}
                        >
                          {p.title}
                        </h3>

                        <span
                          style={{
                            fontSize: "0.5625rem",
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: "var(--color-gold)",
                            border: "1px solid rgba(197, 164, 93, 0.45)",
                            background: "rgba(197, 164, 93, 0.08)",
                            padding: "0.25rem 0.65rem",
                            borderRadius: "999px",
                            fontWeight: 700,
                          }}
                        >
                          {p.tag}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          color: isActive ? "rgba(250, 248, 245, 0.9)" : "rgba(250, 248, 245, 0.65)",
                          fontWeight: 300,
                          margin: "0 0 0.85rem",
                        }}
                      >
                        {p.desc}
                      </p>

                      {/* Micro Specs List */}
                      <div
                        style={{
                          display: "flex",
                          gap: "0.65rem",
                          flexWrap: "wrap",
                          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                          paddingTop: "0.75rem",
                        }}
                      >
                        {p.specs.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: "0.6875rem",
                              color: isActive ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.45)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <span style={{ color: "var(--color-gold)" }}>✓</span>
                            <span>{spec}</span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* RIGHT: High-Resolution Workshop Showcase Canvas with 3D Tilt & Parallax */}
          <motion.div
            style={{
              y: rightColY,
              position: "relative",
              perspective: "1200px",
              transformStyle: "preserve-3d",
              overflow: "visible", // CRITICAL: Never clip hotspot popovers!
            }}
          >
            {/* Interactive 3D Tilt Frame */}
            <motion.div
              ref={showcaseCardRef}
              onMouseMove={handleCanvasMouseMove}
              onMouseEnter={handleCanvasMouseEnter}
              onMouseLeave={handleCanvasMouseLeave}
              style={{
                position: "relative",
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformStyle: "preserve-3d",
                transition: isHoveringCanvas ? "none" : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
                overflow: "visible",
              }}
            >
              {/* Inner Clipped Box (Masks Parallax Image within 16px radius) */}
              <div
                style={{
                  position: "relative",
                  height: "560px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(197, 164, 93, 0.35)",
                  boxShadow: isHoveringCanvas
                    ? "0 32px 75px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(197, 164, 93, 0.55)"
                    : "0 22px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(197, 164, 93, 0.2)",
                  transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                  transform: "translateZ(0px)",
                }}
              >
                {/* Scroll-Driven Parallax Image Container */}
                <motion.div
                  style={{
                    position: "absolute",
                    inset: "-14% 0",
                    y: imageY,
                    scale: imageScale,
                  }}
                >
                  <Image
                    src="/images/craft-workshop.jpg"
                    alt="Mallikarjuna Furniture World Teakwood Workshop and Joinery"
                    fill
                    sizes="(max-width: 992px) 100vw, 55vw"
                    style={{ objectFit: "cover" }}
                    priority={false}
                  />
                </motion.div>

                {/* Cinematic Depth Gradient Vignette */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(16, 43, 70, 0.15) 0%, rgba(16, 43, 70, 0.25) 45%, rgba(16, 43, 70, 0.88) 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Dynamic Specular Glare Sheen Reflection Layer */}
                <motion.div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 10,
                    opacity: isHoveringCanvas ? 0.35 : 0,
                    transition: "opacity 0.4s ease",
                    background: useTransform(
                      [glareX, glareY],
                      ([gx, gy]) =>
                        `radial-gradient(circle 420px at ${gx} ${gy}, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 55%, transparent 80%)`
                    ),
                    mixBlendMode: "overlay",
                  }}
                />

                {/* 3D Depth Floating Typography Overlay */}
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: "2.25rem",
                    left: "2.25rem",
                    right: "2.25rem",
                    transform: "translateZ(55px)",
                    pointerEvents: "none",
                    zIndex: 12,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.55rem",
                      fontSize: "0.6875rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--color-gold)",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                      background: "rgba(16, 43, 70, 0.8)",
                      backdropFilter: "blur(12px)",
                      padding: "0.35rem 0.85rem",
                      borderRadius: "999px",
                      border: "1px solid rgba(197, 164, 93, 0.45)",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <span style={{ color: "#E0C078" }}>✦</span>
                    <span>RAYALASEEMA CRAFTSMANSHIP</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.5rem, 2.2vw, 1.95rem)",
                      color: "#FAF8F5",
                      fontWeight: 400,
                      margin: 0,
                      lineHeight: 1.25,
                      textShadow: "0 3px 14px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Traditional Mortise & Tenon Wood Joinery
                  </h3>
                </motion.div>
              </div>

              {/* 3D FLOATING HOTSPOTS LAYER: Outside inner clip box to ensure popovers NEVER get clipped! */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 40,
                  transform: "translateZ(75px)",
                  transformStyle: "preserve-3d",
                }}
              >
                {CRAFT_HOTSPOTS.map((spot) => {
                  const isActive = activeHotspot === spot.id;
                  const isTopHalf = spot.yPercent <= 48;
                  const isRightHalf = spot.xPercent >= 60;
                  const isLeftHalf = spot.xPercent <= 32;

                  return (
                    <div
                      key={spot.id}
                      style={{
                        position: "absolute",
                        top: spot.top,
                        left: spot.left,
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "auto",
                        zIndex: isActive ? 60 : 30,
                      }}
                      onMouseEnter={() => handleHotspotMouseEnter(spot.id)}
                      onMouseLeave={handleHotspotMouseLeave}
                    >
                      {/* Interactive 3D Hotspot Button */}
                      <button
                        type="button"
                        onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                        aria-label={spot.title}
                        aria-expanded={isActive}
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background: isActive ? "var(--color-navy)" : "rgba(255, 255, 255, 0.98)",
                          border: isActive ? "2px solid #E0C078" : "2px solid var(--color-gold)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: isActive
                            ? "0 0 24px rgba(197, 164, 93, 0.8), 0 8px 24px rgba(0,0,0,0.5)"
                            : "0 6px 20px rgba(0, 0, 0, 0.4)",
                          position: "relative",
                          padding: 0,
                          transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
                          transform: isActive ? "scale(1.12)" : "scale(1)",
                        }}
                      >
                        {/* Animated Radar Pulse Rings */}
                        {!isActive && (
                          <span
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              inset: "-8px",
                              borderRadius: "50%",
                              border: "1.5px solid rgba(197, 164, 93, 0.85)",
                              animation: "craftPing 2.4s cubic-bezier(0, 0, 0.2, 1) infinite",
                              pointerEvents: "none",
                            }}
                          />
                        )}

                        {/* Button Icon: + or ✕ */}
                        <span
                          style={{
                            color: isActive ? "#FFFFFF" : "var(--color-navy)",
                            fontSize: isActive ? "1rem" : "1.2rem",
                            fontWeight: 700,
                            lineHeight: 1,
                            transition: "transform 0.25s ease",
                          }}
                        >
                          {isActive ? "✕" : "+"}
                        </span>
                      </button>

                      {/* 3D Elevated Popover Card (Unclipped, fully visible) */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: isTopHalf ? 14 : -14 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: isTopHalf ? 10 : -10 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            onMouseEnter={handlePopoverMouseEnter}
                            onMouseLeave={handleHotspotMouseLeave}
                            style={{
                              position: "absolute",
                              ...(isTopHalf
                                ? { top: "calc(100% + 14px)" }
                                : { bottom: "calc(100% + 14px)" }),
                              ...(isRightHalf
                                ? { right: "-16px" }
                                : isLeftHalf
                                ? { left: "-16px" }
                                : { left: "50%", transform: "translateX(-50%)" }),
                              background: "rgba(10, 26, 44, 0.97)",
                              backdropFilter: "blur(18px)",
                              color: "#FFFFFF",
                              padding: "1.35rem 1.45rem",
                              borderRadius: "14px",
                              border: "1px solid rgba(197, 164, 93, 0.45)",
                              boxShadow:
                                "0 24px 60px rgba(0, 0, 0, 0.65), 0 0 25px rgba(197, 164, 93, 0.15)",
                              width: "310px",
                              maxWidth: "calc(90vw - 32px)",
                              zIndex: 100,
                              pointerEvents: "auto",
                              transformStyle: "preserve-3d",
                              transform: "translateZ(30px)",
                            }}
                          >
                            {/* Header row: Category + Close Button */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "0.45rem",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.625rem",
                                  letterSpacing: "0.18em",
                                  textTransform: "uppercase",
                                  color: "var(--color-gold)",
                                  fontWeight: 700,
                                }}
                              >
                                {spot.category}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveHotspot(null);
                                }}
                                aria-label="Close details"
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "rgba(255, 255, 255, 0.6)",
                                  fontSize: "0.85rem",
                                  cursor: "pointer",
                                  padding: "2px 6px",
                                }}
                              >
                                ✕
                              </button>
                            </div>

                            {/* Title & Description */}
                            <h4
                              style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "1.15rem",
                                fontWeight: 400,
                                marginBottom: "0.35rem",
                                color: "#FFFFFF",
                                lineHeight: 1.25,
                              }}
                            >
                              {spot.title}
                            </h4>
                            <p
                              style={{
                                fontSize: "0.78125rem",
                                color: "rgba(247, 243, 234, 0.85)",
                                margin: "0 0 0.85rem",
                                lineHeight: 1.45,
                              }}
                            >
                              {spot.desc}
                            </p>

                            {/* Key Highlights with Gold Bullets */}
                            <div
                              style={{
                                borderTop: "1px solid rgba(197, 164, 93, 0.25)",
                                paddingTop: "0.75rem",
                                marginBottom: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.35rem",
                              }}
                            >
                              {spot.features.map((feat, i) => (
                                <div
                                  key={i}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "0.45rem",
                                    fontSize: "0.71875rem",
                                    color: "rgba(255, 255, 255, 0.9)",
                                  }}
                                >
                                  <span style={{ color: "var(--color-gold)", fontSize: "0.75rem" }}>✓</span>
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>

                            {/* Direct WhatsApp CTA Button */}
                            <a
                              href={getWhatsAppEnquiryUrl(spot.title)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-whatsapp"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                width: "100%",
                                padding: "0.65rem 1rem",
                                fontSize: "0.71875rem",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                borderRadius: "6px",
                                textAlign: "center",
                                textDecoration: "none",
                              }}
                            >
                              <span>INQUIRE ABOUT THIS SPEC</span>
                              <span style={{ fontSize: "0.9rem" }}>→</span>
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3. Floating 3D Artisanal Guarantee Ribbon (Parallax Scroll Lift) */}
        <motion.div
          style={{
            y: metricsY,
            marginTop: "4.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem",
          }}
          className="craftsmanship-metrics-grid"
        >
          {CRAFT_METRICS.map((metric, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(197, 164, 93, 0.3)",
                borderRadius: "12px",
                padding: "1.45rem 1.35rem",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.65rem",
                    fontWeight: 600,
                    color: "var(--color-gold)",
                    lineHeight: 1,
                  }}
                >
                  {metric.value}
                </span>
                <span style={{ color: "rgba(197, 164, 93, 0.6)", fontSize: "1.1rem" }}>{metric.icon}</span>
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "#FAF8F5",
                  lineHeight: 1.3,
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  fontSize: "0.71875rem",
                  color: "rgba(250, 248, 245, 0.65)",
                  lineHeight: 1.4,
                }}
              >
                {metric.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};
