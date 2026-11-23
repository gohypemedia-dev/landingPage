/* eslint-disable @next/next/no-img-element -- thumbnails of arbitrary URLs */

import type { Metadata } from "next";
import Link from "next/link";

import { SectionSwitch } from "@/components/admin/SectionSwitch";
import { getSiteContentForAdmin, type SectionStatus } from "@/lib/server/site-content";
import { requireAdmin } from "@/lib/server/session";
import { DEAL_TIMER_MODES, OFFER_SECTIONS, type SiteContent } from "@/lib/site-content/schema";

export const metadata: Metadata = { title: "Offers & sales" };

const Thumb = ({ src }: { src: string }) => (src ? <img src={src} alt="" className="adm-offer-thumb" /> : null);

const endsAt = (value: string) =>
  new Date(`${value}:00+05:30`).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

/** What each offer banner currently says, so it can be checked without opening the editor. */
function Summary({ content, sectionKey }: { content: SiteContent; sectionKey: string }) {
  switch (sectionKey) {
    case "promoSlides": {
      const s = content.promoSlides;
      return (
        <ul className="adm-offer-items">
          {s.slides.map((slide, i) => (
            <li key={i}>
              <Thumb src={slide.left.src} />
              <span>
                <strong>
                  {slide.titleLine1} {slide.titleLine2}
                </strong>
                <small>{slide.href}</small>
              </span>
            </li>
          ))}
        </ul>
      );
    }
    case "festiveOffer": {
      const f = content.festiveOffer;
      return (
        <>
          <p className="adm-offer-headline">
            {f.heading} · <strong>{f.saleLabel}</strong>
          </p>
          <ul className="adm-offer-items">
            {f.offers.map((o, i) => (
              <li key={i}>
                <Thumb src={o.image.src} />
                <span>
                  <strong>{o.title}</strong>
                  <small>{o.worth}</small>
                </span>
              </li>
            ))}
          </ul>
        </>
      );
    }
    case "addOnSale": {
      const a = content.addOnSale;
      return (
        <>
          <p className="adm-offer-headline">
            {a.headingTop} <strong>{a.headingAccent}</strong> · {a.subtitle}
          </p>
          <ul className="adm-offer-items">
            {a.columns.map((c, i) => (
              <li key={i}>
                <Thumb src={c.image.src} />
                <span>
                  <strong>Shop {c.tags.join(", ")}</strong>
                  <small>
                    Get <b>{c.discount} off</b> {c.addOnLabel}
                  </small>
                </span>
              </li>
            ))}
          </ul>
        </>
      );
    }
    case "dealBanner": {
      const d = content.dealBanner;
      const timer =
        d.timerMode === "until" && d.timerEndsAt
          ? `Counts down to ${endsAt(d.timerEndsAt)}${new Date(`${d.timerEndsAt}:00+05:30`) < new Date() ? " (ended, so hidden)" : ""}`
          : DEAL_TIMER_MODES.find((m) => m.value === d.timerMode)?.label;
      return (
        <dl className="adm-offer-facts">
          <dt>Sale</dt>
          <dd>
            {d.saleBadge} · <strong>{d.saleOff}</strong>
          </dd>
          <dt>Countdown</dt>
          <dd>{timer}</dd>
          <dt>Cashback</dt>
          <dd>
            <strong>{d.cashbackBold}</strong> {d.cashbackText}
          </dd>
          <dt>EMI</dt>
          <dd>
            {d.emiTitle} {d.emiOn} {d.banks.join(", ")} {d.banksMore}
          </dd>
          <dt>Terms</dt>
          <dd>{d.terms}</dd>
        </dl>
      );
    }
    default:
      return null;
  }
}

export default async function OffersPage() {
  // Checked here, not only in the layout: layouts do not re-run on navigation, so each page guards its own data.
  await requireAdmin();
  const { content, status } = await getSiteContentForAdmin();

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Offers &amp; sales</h1>
          <p className="adm-muted">
            The sale banners on the homepage. Switch one on or off here, or press Edit to change its text, photos and
            discounts.
          </p>
        </div>
      </header>

      <div className="adm-offers">
        {OFFER_SECTIONS.map((s) => {
          const value = content[s.key] as { enabled?: boolean };
          const edited: SectionStatus | undefined = status[s.key];
          return (
            <article key={s.key} className="adm-offer">
              <header className="adm-offer-head">
                <div>
                  <h2>{s.title}</h2>
                  <small className="adm-muted">
                    {s.description} ·{" "}
                    {edited ? `Edited ${new Date(edited.updatedAt).toLocaleDateString("en-IN")}` : "Original design"}
                  </small>
                </div>
                <span className="adm-row">
                  <SectionSwitch sectionKey={s.key} enabled={value.enabled !== false} title={s.title} />
                  <Link href={`/admin/content/${s.key}`} className="adm-btn adm-btn--small adm-btn--primary">
                    Edit
                  </Link>
                </span>
              </header>
              <div className={value.enabled === false ? "adm-offer-body is-hidden" : "adm-offer-body"}>
                <Summary content={content} sectionKey={s.key} />
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
