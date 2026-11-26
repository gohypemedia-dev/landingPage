"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content/context";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Seconds left: until local midnight (the deal "resets" every day), or until the
// end time set in Admin → Offers & sales (entered in India time).
const secondsLeft = (mode: "daily" | "until", endsAt: string) => {
  const now = new Date();
  let end: Date;
  if (mode === "until") {
    end = new Date(`${endsAt}:00+05:30`);
  } else {
    end = new Date(now);
    end.setHours(24, 0, 0, 0);
  }
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
};

const pad = (n: number) => String(n).padStart(2, "0");

// Shared with the product page trust strip
export const TRUST_BADGES = [
  {
    label: "100% Secure Payment",
    short: "Secure Payment",
    icon: (
      <>
        <path d="M24 4 8 10v12c0 10.2 6.8 18.8 16 22 9.2-3.2 16-11.8 16-22V10L24 4Z" fill="currentColor" stroke="none" />
        <path d="m17 24 5 5 10-10" stroke="var(--trust-ink, #102D40)" strokeWidth="3.2" />
      </>
    ),
  },
  {
    label: "Thousands of Happy Homes",
    short: "Happy Homes",
    icon: (
      <>
        <path d="M24 5 4 21h5v21h30V21h5L24 5Z" fill="currentColor" stroke="none" />
        <path
          d="M24 36s-7-4.4-7-9.2a3.8 3.8 0 0 1 7-2 3.8 3.8 0 0 1 7 2C31 31.6 24 36 24 36Z"
          fill="var(--trust-ink, #102D40)"
          stroke="none"
        />
      </>
    ),
  },
  {
    label: "International Furniture",
    short: "International",
    icon: (
      <>
        <path d="M11 13h26a4 4 0 0 1 4 4v6H7v-6a4 4 0 0 1 4-4Z" fill="currentColor" stroke="none" />
        <path d="M6 22a4 4 0 0 1 4 4v3h28v-3a4 4 0 1 1 8 0v11H2V26a4 4 0 0 1 4-4Z" fill="currentColor" stroke="none" />
        <path d="M8 37v5M40 37v5" strokeWidth="3" />
      </>
    ),
  },
  {
    label: "Unbeatable Price",
    short: "Best Price",
    icon: (
      <>
        <path d="M25 4h17v17L22 41a3.5 3.5 0 0 1-5 0L7 31a3.5 3.5 0 0 1 0-5L25 4Z" fill="currentColor" stroke="none" />
        <circle cx="34" cy="12" r="3.2" fill="var(--trust-ink, #102D40)" stroke="none" />
      </>
    ),
  },
  {
    label: "No Cost EMI",
    short: "No Cost EMI",
    icon: (
      <>
        <path
          d="M24.00 3.00 L27.55 6.15 L32.04 4.60 L34.11 8.87 L38.85 9.15 L39.13 13.89 L43.40 15.96 L41.85 20.45 L45.00 24.00 L41.85 27.55 L43.40 32.04 L39.13 34.11 L38.85 38.85 L34.11 39.13 L32.04 43.40 L27.55 41.85 L24.00 45.00 L20.45 41.85 L15.96 43.40 L13.89 39.13 L9.15 38.85 L8.87 34.11 L4.60 32.04 L6.15 27.55 L3.00 24.00 L6.15 20.45 L4.60 15.96 L8.87 13.89 L9.15 9.15 L13.89 8.87 L15.96 4.60 L20.45 6.15Z"
          fill="currentColor"
          stroke="none"
        />
        <text x="24" y="28.6" textAnchor="middle" fontSize="12.5" fontWeight="800" fontFamily="var(--font-sans)" fill="var(--trust-ink, #102D40)" stroke="none">
          0%
        </text>
      </>
    ),
  },
];

// Sale text and banks are edited in Admin → Homepage sections → Deal strip
export const DealBanner: React.FC = () => {
  const { dealBanner: d } = useSiteContent();
  const [left, setLeft] = useState<number | null>(null);
  const mode = d.timerMode;

  useEffect(() => {
    if (mode === "off") return;
    const tick = () => setLeft(secondsLeft(mode, d.timerEndsAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [mode, d.timerEndsAt]);

  // Days appear only when more than a day is left; a finished countdown is hidden.
  const days = left === null ? 0 : Math.floor(left / 86400);
  const timer: [string, string][] =
    left === null
      ? [["--", "Hrs"], ["--", "Mins"], ["--", "Secs"]]
      : [
          ...(days > 0 ? ([[String(days), days === 1 ? "Day" : "Days"]] as [string, string][]) : []),
          [pad(Math.floor((left % 86400) / 3600)), "Hrs"],
          [pad(Math.floor((left % 3600) / 60)), "Mins"],
          [pad(left % 60), "Secs"],
        ];
  const showTimer = mode !== "off" && !(mode === "until" && left === 0);

  return (
    <section className="deal" aria-label="Current offers">
      {/* Limited time deal strip */}
      <div className="deal-strip">
        <div className="deal-strip-inner">
          <div className="deal-timer-group">
            {showTimer && (
              <div>
                <span className="deal-eyebrow">{d.eyebrow}</span>
                <div className="deal-timer" role="timer" aria-live="off">
                  {timer.map(([v, unit]) => (
                    <span key={unit} className="deal-timer-box">
                      <strong>{v}</strong>
                      <small>{unit}</small>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="deal-sale">
              <span className="deal-sale-badge">{d.saleBadge}</span>
              <span className="deal-sale-off">{d.saleOff}</span>
            </div>
          </div>

          <p className="deal-cashback">
            <strong>{d.cashbackBold}</strong> {d.cashbackText}
          </p>

          <div className="deal-emi">
            <span className="deal-emi-title">{d.emiTitle} <span className="deal-emi-on">{d.emiOn}</span></span>
            <span className="deal-banks">
              {d.banks.map((b, i) => (
                <span key={i} className="deal-bank">{b}</span>
              ))}
              {d.banksMore && <span className="deal-bank-more">{d.banksMore}</span>}
            </span>
            <span className="deal-tnc">{d.terms}</span>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <ul className="deal-trust">
        {TRUST_BADGES.map((t, i) => (
          <motion.li
            key={t.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
          >
            <span className="deal-trust-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {t.icon}
              </svg>
            </span>
            <span className="deal-trust-label">
              <span className="deal-trust-full">{t.label}</span>
              <span className="deal-trust-short">{t.short}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};
