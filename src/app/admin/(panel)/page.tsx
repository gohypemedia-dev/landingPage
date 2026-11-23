import type { Metadata } from "next";
import Link from "next/link";

import { getPrisma } from "@/lib/server/db";
import { getSiteContentForAdmin } from "@/lib/server/site-content";
import { HOMEPAGE_SECTIONS } from "@/lib/site-content/schema";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Homepage sections" };

export default async function AdminHome() {
  // Checked here, not only in the layout: layouts do not re-run on navigation, so each page guards its own data.
  await requireAdmin();
  const [{ content, status }, mediaCount, newEnquiries] = await Promise.all([
    getSiteContentForAdmin(),
    getPrisma().mediaAsset.count(),
    getPrisma().enquiry.count({ where: { status: "NEW" } }),
  ]);

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Homepage sections</h1>
          <p className="adm-muted">Edit text, photos and videos. Changes go live as soon as you press “Save &amp; publish”.</p>
        </div>
      </header>

      <div className="adm-stats">
        <Link href="/admin/enquiries" className="adm-stat">
          <strong>{newEnquiries}</strong>
          <span>New enquiries</span>
        </Link>
        <Link href="/admin/media" className="adm-stat">
          <strong>{mediaCount}</strong>
          <span>Files in media library</span>
        </Link>
        <div className="adm-stat">
          <strong>{HOMEPAGE_SECTIONS.filter((s) => status[s.key]).length}</strong>
          <span>Sections edited</span>
        </div>
      </div>

      <p className="adm-muted">
        Sale banners (promo slides, festive offer, Add-On sale, deal strip) are under{" "}
        <Link href="/admin/offers" className="adm-link">
          Offers &amp; sales
        </Link>
        .
      </p>

      <ol className="adm-sections">
        {HOMEPAGE_SECTIONS.map((s, i) => {
          const value = content[s.key] as { enabled?: boolean };
          const hidden = value.enabled === false;
          const edited = status[s.key];
          return (
            <li key={s.key}>
              <Link href={`/admin/content/${s.key}`} className="adm-section-card">
                <span className="adm-section-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="adm-section-text">
                  <strong>{s.title}</strong>
                  <small>{s.description}</small>
                </span>
                <span className="adm-row">
                  {hidden && <span className="adm-pill adm-pill--muted">Hidden</span>}
                  {edited ? <span className="adm-pill adm-pill--ok">Edited</span> : <span className="adm-pill">Original</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
