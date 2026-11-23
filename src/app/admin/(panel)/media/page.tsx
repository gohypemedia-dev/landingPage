import type { Metadata } from "next";

import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getPrisma } from "@/lib/server/db";
import { getStorageMode } from "@/lib/server/storage";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Media library" };

const STORAGE_NOTES = {
  r2: null,
  local:
    "Cloudflare R2 is not connected yet, so uploads are saved to public/uploads on this computer (development only). Add the R2_* settings to .env before going live.",
  unavailable: "Uploads are disabled: add the R2_* settings to the server environment to enable them.",
} as const;

export default async function MediaPage() {
  // Checked here, not only in the layout: layouts do not re-run on navigation, so each page guards its own data.
  await requireAdmin();
  const rows = await getPrisma().mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
  const items = rows.map((m) => ({
    id: m.id,
    url: m.url,
    kind: m.kind,
    fileName: m.fileName,
    alt: m.alt,
    size: m.size,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Media library</h1>
          <p className="adm-muted">Upload photos and videos here, then pick them in any homepage section.</p>
        </div>
      </header>
      <MediaLibrary initial={items} storageNote={STORAGE_NOTES[getStorageMode()]} />
    </>
  );
}
