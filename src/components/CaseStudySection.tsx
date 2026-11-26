"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface CaseStudyItem {
  id: string;
  image: string;
  alt: string;
  objectPosition: string;
}

const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "modern-luxury-sofas",
    image: "/images/case-study-sofas.jpg",
    alt: "Modern luxury curved bouclé sofa in a sunlit contemporary living room",
    objectPosition: "center 65%",
  },
  {
    id: "premium-recliners",
    image: "/images/case-study-recliners.jpg",
    alt: "Premium motorized leather and bouclé recliners in an upscale media lounge",
    objectPosition: "center 60%",
  },
  {
    id: "designer-chairs",
    image: "/images/case-study-chairs.jpg",
    alt: "Sculptural solid teakwood and ivory bouclé designer lounge chairs",
    objectPosition: "center 55%",
  },
  {
    id: "contemporary-coffee-tables",
    image: "/images/case-study-coffee-tables.jpg",
    alt: "Contemporary monolithic travertine and fluted walnut coffee table",
    objectPosition: "center 60%",
  },
];

// Append first item for seamless right-to-left continuous looping
const SLIDES: CaseStudyItem[] = [...CASE_STUDIES, CASE_STUDIES[0]];
const TOTAL_ITEMS = CASE_STUDIES.length;
const SLIDE_INTERVAL_MS = 4000;
const TRANSITION_DURATION_MS = 900;

export const CaseStudySection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const resetTimerRef = useRef<number | null>(null);

  // Auto-advance slider
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      if (document.hidden) return;
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  // When reaching the cloned slide (index === TOTAL_ITEMS), seamlessly reset to index 0
  const handleTransitionEnd = () => {
    if (currentIndex >= TOTAL_ITEMS) {
      setIsTransitioning(false);
      setCurrentIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  // Safety fallback if transitionend does not fire
  useEffect(() => {
    if (currentIndex >= TOTAL_ITEMS) {
      resetTimerRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }, TRANSITION_DURATION_MS + 60);

      return () => {
        if (resetTimerRef.current !== null) {
          window.clearTimeout(resetTimerRef.current);
        }
      };
    }
  }, [currentIndex]);

  return (
    <section className="cs-section" aria-labelledby="cs-heading">
      <h2 id="cs-heading" className="cs-heading">
        Our Projects
      </h2>

      <div className="cs-stage" aria-live="polite">
        <div
          className="cs-track"
          style={{
            transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
            transition: isTransitioning
              ? `transform ${TRANSITION_DURATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {SLIDES.map((item, index) => {
            const isClone = index === TOTAL_ITEMS;
            const slideKey = isClone ? `${item.id}-clone` : item.id;
            const isActive = (currentIndex % TOTAL_ITEMS) === (index % TOTAL_ITEMS);

            return (
              <div
                key={slideKey}
                className={`cs-slide${isActive ? " is-active" : ""}`}
                aria-hidden={!isActive}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="100vw"
                  priority={index <= 1}
                  loading={index <= 1 ? "eager" : "lazy"}
                  style={{
                    objectFit: "cover",
                    objectPosition: item.objectPosition,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
