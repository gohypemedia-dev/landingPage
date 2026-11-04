"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  SHOWROOM_INFO,
  getShowroomBookingWhatsAppUrl,
} from "@/data/products";

interface ShowroomHotspot {
  id: string;
  top: string;
  left: string;
  xPercent: number;
  yPercent: number;
  label: string;
  sub: string;
  category: string;
  features: string[];
}

const SHOWROOM_HOTSPOTS: ShowroomHotspot[] = [
  {
    id: "living-suite",
    top: "68%",
    left: "25%",
    xPercent: 25,
    yPercent: 68,
    label: "Living & Recliner Pavilion",
    sub: "Curved modular sectionals, chesterfields & German-motor recliners",
    category: "ZONE 01 · LUXURY SEATING",
    features: [
      "German OKIN dual-motor recliners",
      "High-resilience 40+ density foam",
      "200+ Italian leather & velvet swatches",
    ],
  },
  {
    id: "dining-teak",
    top: "52%",
    left: "67%",
    xPercent: 67,
    yPercent: 52,
    label: "Dining & Teakwood Gallery",
    sub: "Imported Italian marble dining suites & 100% solid Burma teak beds",
    category: "ZONE 02 · DINING & BEDS",
    features: [
      "Natural Italian Calacatta & Onyx marble",
      "Kiln-dried Grade-A Burma teakwood",
      "Custom 6, 8 & 10-seater configurations",
    ],
  },
  {
    id: "bespoke-studio",
    top: "32%",
    left: "44%",
    xPercent: 44,
    yPercent: 32,
    label: "Architectural 3D Design Studio",
    sub: "In-store architects ready to map your floor plan and customize dimensions",
    category: "ZONE 03 · 3D BESPOKE",
    features: [
      "Complimentary on-screen 3D room rendering",
      "Custom sizing to the exact inch",
      "Complete home decor palette coordination",
    ],
  },
];

const SHOWROOM_METRICS = [
  {
    value: "15,000+",
    unit: "SQ. FT.",
    title: "Palatial 2-Floor Luxury Floor",
    desc: "Rayalaseema's largest experiential gallery",
    icon: "✦",
  },
  {
    value: "300+",
    unit: "MODELS",
    title: "Live Living & Dining Suites",
    desc: "Ready to test, touch & customize",
    icon: "❖",
  },
  {
    value: "1-ON-1",
    unit: "3D STUDIO",
    title: "Free In-Store Room Planning",
    desc: "Architectural rendering with specialists",
    icon: "◈",
  },
  {
    value: "48 HR",
    unit: "EXPRESS",
    title: "White-Glove Kurnool Dispatch",
    desc: "Direct workshop warranty & installation",
    icon: "⚡",
  },
];

export const ShowroomExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const showcaseCardRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);

  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [isHoveringInfo, setIsHoveringInfo] = useState(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll Parallax telemetry
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax Transforms
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["-120px", "120px"]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.015, 0.045, 0.045, 0.015]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  // Image internal parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.08, 1.18]);

  // Differential Column Scroll Speeds (Continuous physical depth)
  const leftColY = useTransform(scrollYProgress, [0, 1], [22, -22]);
  const rightColY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const metricsY = useTransform(scrollYProgress, [0, 1], [25, -25]);

  // Header scroll lift
  const headerY = useTransform(scrollYProgress, [0, 0.3], [24, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [0.55, 1]);

  // Interactive 3D Card Tilt Physics (Mouse movement tracking)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 200, mass: 0.55 };
  const cardRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const cardRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  // Dynamic Specular Glare Coordinates
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["12%", "88%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["12%", "88%"]);

  // Right Info Card Subtle 3D Tilt
  const infoMouseX = useMotionValue(0);
  const infoMouseY = useMotionValue(0);
  const infoRotateX = useSpring(useTransform(infoMouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const infoRotateY = useSpring(useTransform(infoMouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  // Mouse Handlers for Showcase Canvas
  const handleShowcaseMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showcaseCardRef.current) return;
    const rect = showcaseCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleShowcaseMouseEnter = () => {
    setIsHoveringCard(true);
  };

  const handleShowcaseMouseLeave = () => {
    setIsHoveringCard(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Mouse Handlers for Info Card
  const handleInfoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!infoCardRef.current) return;
    const rect = infoCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    infoMouseX.set(x);
    infoMouseY.set(y);
  };

  const handleInfoMouseLeave = () => {
    setIsHoveringInfo(false);
    infoMouseX.set(0);
    infoMouseY.set(0);
  };

  // Safe Popover hover management with grace timer
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

  const handleCopyAddress = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${SHOWROOM_INFO.address}, Landmark: ${SHOWROOM_INFO.landmark}`
        );
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2400);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="showroom"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "6.5rem 0 6rem",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid var(--color-card-border)",
      }}
    >
      {/* 1. Background Parallax Typographic Watermark */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "4%",
          left: "-5%",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(5rem, 12vw, 11rem)",
          fontWeight: 300,
          letterSpacing: "0.14em",
          color: "var(--color-navy)",
          opacity: watermarkOpacity,
          textTransform: "uppercase",
          userSelect: "none",
          pointerEvents: "none",
          x: watermarkX,
          zIndex: 0,
        }}
      >
        MALLIKARJUNA KURNOOL · 15,000 SQ. FT.
      </motion.div>

      {/* 2. Ambient Parallax Glow Orbs */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          left: "-6%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197, 164, 93, 0.12) 0%, rgba(197, 164, 93, 0) 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          y: orb1Y,
          zIndex: 0,
        }}
      />
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "6%",
          right: "-4%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 43, 70, 0.08) 0%, rgba(16, 43, 70, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          y: orb2Y,
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Top Header with 3D Scroll Lift & WhatsApp Action */}
        <motion.div
          style={{
            y: headerY,
            opacity: headerOpacity,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "3.25rem",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
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
                VISIT US IN PERSON · BELLARY ROAD, KURNOOL
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.2rem, 4vw, 3.45rem)",
                fontWeight: 300,
                color: "var(--color-navy)",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Experience It in <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>Person</span>
            </h2>
          </div>

          <a
            href={getShowroomBookingWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{
              borderRadius: "999px",
              padding: "0.85rem 2rem",
              boxShadow: "0 8px 24px rgba(24, 134, 75, 0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.65rem",
              textDecoration: "none",
            }}
          >
            <span>Plan Your Showroom Visit</span>
            <span style={{ fontSize: "1.1rem" }}>→</span>
          </a>
        </motion.div>

        {/* 2-Column Split: Interactive 3D Parallax Canvas + Editorial Glide Card */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 0.85fr",
            gap: "3rem",
            alignItems: "start",
          }}
          className="showroom-grid"
        >
          {/* LEFT: Grand Showroom Showcase with 3D Tilt & Parallax Layering */}
          <motion.div
            style={{
              y: leftColY,
              position: "relative",
              perspective: "1200px",
              transformStyle: "preserve-3d",
              overflow: "visible", // CRITICAL: Never clip hotspot popovers!
            }}
          >
            {/* Interactive 3D Tilt Wrapper */}
            <motion.div
              ref={showcaseCardRef}
              onMouseMove={handleShowcaseMouseMove}
              onMouseEnter={handleShowcaseMouseEnter}
              onMouseLeave={handleShowcaseMouseLeave}
              style={{
                position: "relative",
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformStyle: "preserve-3d",
                transition: isHoveringCard ? "none" : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
                overflow: "visible",
              }}
            >
              {/* Inner Clipped Box (Masks the Parallax Image cleanly within 16px border-radius) */}
              <div
                style={{
                  position: "relative",
                  height: "530px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(197, 164, 93, 0.35)",
                  boxShadow: isHoveringCard
                    ? "0 32px 75px rgba(16, 43, 70, 0.22), 0 0 0 1px rgba(197, 164, 93, 0.55)"
                    : "0 20px 50px rgba(16, 43, 70, 0.12), 0 0 0 1px rgba(197, 164, 93, 0.25)",
                  transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                  transform: "translateZ(0px)",
                }}
              >
                {/* Scroll-Driven Parallax Image Container */}
                <motion.div
                  style={{
                    position: "absolute",
                    inset: "-15% 0",
                    y: imageY,
                    scale: imageScale,
                  }}
                >
                  <Image
                    src="/images/showroom-kurnool-main.jpg"
                    alt="Mallikarjuna Furniture World 15,000 Sq. Ft. Luxury Furniture Showroom Kurnool"
                    fill
                    sizes="(max-width: 992px) 100vw, 65vw"
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
                      "linear-gradient(180deg, rgba(16, 43, 70, 0.12) 0%, rgba(16, 43, 70, 0.22) 42%, rgba(16, 43, 70, 0.9) 100%)",
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
                    opacity: isHoveringCard ? 0.35 : 0,
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
                    color: "#FFFFFF",
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
                    <span>15,000+ SQ. FT. LUXURY EXPERIENCE ZONE</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.6rem, 2.5vw, 2.15rem)",
                      fontWeight: 400,
                      lineHeight: 1.2,
                      margin: 0,
                      textShadow: "0 3px 14px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Rayalaseema&apos;s Largest Furniture Destination
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
                {SHOWROOM_HOTSPOTS.map((spot) => {
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
                        aria-label={spot.label}
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
                            : "0 6px 20px rgba(0, 0, 0, 0.35)",
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
                              animation: "showroomPing 2.4s cubic-bezier(0, 0, 0.2, 1) infinite",
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
                              background: "rgba(16, 43, 70, 0.96)",
                              backdropFilter: "blur(18px)",
                              color: "#FFFFFF",
                              padding: "1.35rem 1.45rem",
                              borderRadius: "14px",
                              border: "1px solid rgba(197, 164, 93, 0.45)",
                              boxShadow:
                                "0 24px 60px rgba(0, 0, 0, 0.55), 0 0 25px rgba(197, 164, 93, 0.15)",
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
                              {spot.label}
                            </h4>
                            <p
                              style={{
                                fontSize: "0.78125rem",
                                color: "rgba(247, 243, 234, 0.85)",
                                margin: "0 0 0.85rem",
                                lineHeight: 1.45,
                              }}
                            >
                              {spot.sub}
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
                              href={getShowroomBookingWhatsAppUrl(undefined, undefined, spot.label)}
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
                              <span>INQUIRE THIS ZONE</span>
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

          {/* RIGHT: Showroom Info & Schedule Card with 3D Tilt & Editorial Parallax Glide */}
          <motion.div
            style={{
              y: rightColY,
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              ref={infoCardRef}
              onMouseMove={handleInfoMouseMove}
              onMouseEnter={() => setIsHoveringInfo(true)}
              onMouseLeave={handleInfoMouseLeave}
              style={{
                rotateX: infoRotateX,
                rotateY: infoRotateY,
                transformStyle: "preserve-3d",
                transition: isHoveringInfo ? "none" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
                background: "var(--color-canvas)",
                border: "1px solid rgba(197, 164, 93, 0.35)",
                borderRadius: "16px",
                padding: "2.65rem 2.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.45rem",
                boxShadow: isHoveringInfo
                  ? "0 28px 65px rgba(16, 43, 70, 0.14), 0 0 0 1px rgba(197, 164, 93, 0.45)"
                  : "0 16px 45px rgba(16, 43, 70, 0.08), 0 0 0 1px rgba(197, 164, 93, 0.2)",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Live Showroom Open Indicator with Dual Pulse Ring */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  width: "fit-content",
                  background: "rgba(24, 134, 75, 0.08)",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(24, 134, 75, 0.2)",
                }}
              >
                <div style={{ position: "relative", width: "9px", height: "9px" }}>
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      backgroundColor: "#18864B",
                      boxShadow: "0 0 10px rgba(24, 134, 75, 0.8)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      inset: "-4px",
                      borderRadius: "50%",
                      border: "1.5px solid rgba(24, 134, 75, 0.6)",
                      animation: "showroomPing 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#18864B",
                  }}
                >
                  SHOWROOM OPEN TODAY · UNTIL 9:00 PM
                </span>
              </div>

              {/* Showroom Address & Copy Action */}
              <div>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "0.4rem",
                  }}
                >
                  SHOWROOM ADDRESS
                </span>
                <h4
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.35rem",
                    color: "var(--color-navy)",
                    fontWeight: 400,
                    marginBottom: "0.45rem",
                  }}
                >
                  Mallikarjuna Furniture World Showroom
                </h4>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                    margin: "0 0 0.5rem",
                  }}
                >
                  {SHOWROOM_INFO.address}
                  <br />
                  <span style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>
                    Landmark: {SHOWROOM_INFO.landmark}
                  </span>
                </p>

                {/* Quick Copy Address Button */}
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: copiedAddress ? "#18864B" : "var(--color-gold)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    transition: "color 0.2s ease",
                  }}
                >
                  <span>{copiedAddress ? "✓ Address Copied to Clipboard" : "📋 Copy Full Address"}</span>
                </button>
              </div>

              {/* Business Hours & Assistance Note */}
              <div
                style={{
                  borderTop: "1px solid rgba(16, 43, 70, 0.08)",
                  paddingTop: "1.25rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "0.35rem",
                  }}
                >
                  BUSINESS HOURS
                </span>
                <div style={{ fontSize: "1rem", color: "var(--color-navy)", fontWeight: 600 }}>
                  {SHOWROOM_INFO.timing}
                </div>
                <div style={{ fontSize: "0.78125rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                  Experienced interior specialists on floor to assist you
                </div>
              </div>

              {/* Direct Contact & Telephony */}
              <div
                style={{
                  borderTop: "1px solid rgba(16, 43, 70, 0.08)",
                  paddingTop: "1.25rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "0.35rem",
                  }}
                >
                  DIRECT CONTACT
                </span>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-navy)" }}>
                  <a
                    href={`tel:${SHOWROOM_INFO.phone}`}
                    style={{ color: "var(--color-navy)", textDecoration: "none" }}
                  >
                    {SHOWROOM_INFO.displayPhone}
                  </a>
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
                  WhatsApp: {SHOWROOM_INFO.displayWhatsApp}
                </div>
              </div>

              {/* Action Buttons: Get Directions & Book Visit */}
              <div
                style={{
                  display: "flex",
                  gap: "0.85rem",
                  marginTop: "0.5rem",
                }}
              >
                <a
                  href={SHOWROOM_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    padding: "0.85rem 1rem",
                    textAlign: "center",
                    fontSize: "0.78125rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  📍 Get Directions
                </a>

                <a
                  href={getShowroomBookingWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                  style={{
                    flex: 1.25,
                    padding: "0.85rem 1.15rem",
                    textAlign: "center",
                    fontSize: "0.78125rem",
                    borderRadius: "8px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Book Visit
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3. Floating 3D Experience Metrics Ribbon (Parallax Scroll Lift) */}
        <motion.div
          style={{
            y: metricsY,
            marginTop: "3.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem",
          }}
          className="showroom-metrics-grid"
        >
          {SHOWROOM_METRICS.map((metric, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(197, 164, 93, 0.3)",
                borderRadius: "12px",
                padding: "1.35rem 1.25rem",
                boxShadow: "0 10px 28px rgba(16, 43, 70, 0.05)",
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
                  alignItems: "baseline",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.75rem",
                    fontWeight: 600,
                    color: "var(--color-navy)",
                    lineHeight: 1,
                  }}
                >
                  {metric.value}
                </span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "var(--color-gold)",
                  }}
                >
                  {metric.unit}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-navy)",
                  lineHeight: 1.3,
                }}
              >
                {metric.title}
              </div>
              <div
                style={{
                  fontSize: "0.71875rem",
                  color: "var(--color-text-muted)",
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
