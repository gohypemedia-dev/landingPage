"use client";

import { useEffect, useRef, useState } from "react";

interface PromoCarouselProps {
  label: string;
  slides: React.ReactNode[];
  interval?: number;
}

// Banners are laid out at a desktop width and scaled down to fit narrower screens.
// Phones use a narrower layout width so the scaled banner stays taller and easier to see.
const designWidth = (viewportWidth: number) => (viewportWidth <= 640 ? 860 : 1200);

// All slides share one grid cell, so the carousel takes the tallest slide's height and never jumps.
export const PromoCarousel: React.FC<PromoCarouselProps> = ({ label, slides, interval = 4500 }) => {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [stageWidth, setStageWidth] = useState(1200);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);

  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length);

  // Restarts on every slide change, so a manual click gets a full interval before auto-advancing.
  useEffect(() => {
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearTimeout(id);
  }, [index, interval, slides.length]);

  // Scale the fixed-width stage to the available width and reserve its scaled height
  useEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!viewport || !stage) return;
    const update = () => {
      const w = designWidth(viewport.clientWidth);
      const s = Math.min(1, viewport.clientWidth / w);
      setStageWidth(w);
      setScale(s);
      setHeight(s < 1 ? stage.offsetHeight * s : undefined);
    };
    const ro = new ResizeObserver(update);
    ro.observe(viewport);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const scaled = scale < 1;

  return (
    <div
      className="pcar"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerDown={(e) => (swipeStart.current = e.clientX)}
      onPointerUp={(e) => {
        if (swipeStart.current === null) return;
        const dx = e.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      <div ref={viewportRef} className="pcar-viewport" style={{ height }}>
        <div
          ref={stageRef}
          className={`pcar-stage${stageWidth < 1000 ? " pcar-stage--compact" : ""}`}
          style={scaled ? { width: stageWidth, transform: `scale(${scale})`, transformOrigin: "top left" } : undefined}
        >
          <div className="pcar-track">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`pcar-slide${i === index ? " is-active" : ""}`}
                aria-roledescription="slide"
                aria-hidden={i !== index}
                inert={i !== index}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button type="button" className="bsb-arrow bsb-arrow--prev" onClick={() => go(-1)} aria-label="Previous offer">
        ‹
      </button>
      <button type="button" className="bsb-arrow bsb-arrow--next" onClick={() => go(1)} aria-label="Next offer">
        ›
      </button>

      <div className="bsb-dots pcar-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === index ? "is-active" : undefined}
            onClick={() => setIndex(i)}
            aria-label={`Go to offer ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  );
};
