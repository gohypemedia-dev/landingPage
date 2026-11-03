"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Inertial page scrolling (mouse wheel / trackpad), like the reference site.
// Touch scrolling stays native; scrollable panels (drawers, modals) keep
// their own scroll thanks to allowNestedScroll.
export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      // Offset so same-page anchor jumps land below the floating navbar
      anchors: { offset: -90 },
      allowNestedScroll: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
};
