import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/server/db";
import { isDatabaseConfigured } from "@/lib/server/env";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content/defaults";
import {
  isSiteContentKey,
  siteContentSchemas,
  type SiteContent,
  type SiteContentKey,
} from "@/lib/site-content/schema";

export const SITE_CONTENT_TAG = "site-content";

type Row = { key: string; value: unknown };

/** Stored overrides on top of the defaults. Rows that no longer match their schema are ignored. */
function mergeRows(rows: Row[]): SiteContent {
  const content = structuredClone(DEFAULT_SITE_CONTENT) as Record<SiteContentKey, unknown>;
  for (const row of rows) {
    if (!isSiteContentKey(row.key)) continue;
    const parsed = siteContentSchemas[row.key].safeParse(row.value);
    if (parsed.success) content[row.key] = parsed.data;
    else console.warn(`[site-content] stored "${row.key}" no longer matches its schema; using the default`);
  }
  return content as SiteContent;
}

/**
 * Content for the public site. Cached until an admin saves (updateTag), so the
 * homepage stays static and fast. If the database is unreachable the defaults
 * are served and cached only briefly, so the site recovers on its own.
 */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(SITE_CONTENT_TAG);

  if (!isDatabaseConfigured()) {
    cacheLife("minutes");
    return DEFAULT_SITE_CONTENT;
  }

  try {
    const rows = await getPrisma().siteContent.findMany({ select: { key: true, value: true } });
    cacheLife("max");
    return mergeRows(rows);
  } catch (error) {
    console.error("[site-content] database read failed; serving defaults", error);
    cacheLife("minutes");
    return DEFAULT_SITE_CONTENT;
  }
}

export type SectionStatus = { updatedAt: string; updatedBy: string | null } | null;

/** Fresh (uncached) read for the admin, with who last edited each section. */
export async function getSiteContentForAdmin() {
  const rows = await getPrisma().siteContent.findMany();
  const editorIds = [...new Set(rows.map((r) => r.updatedById).filter((id): id is string => !!id))];
  const editors = editorIds.length
    ? await getPrisma().user.findMany({ where: { id: { in: editorIds } }, select: { id: true, name: true } })
    : [];
  const nameById = new Map(editors.map((u) => [u.id, u.name]));

  const status = Object.fromEntries(
    rows
      .filter((r) => isSiteContentKey(r.key))
      .map((r) => [r.key, { updatedAt: r.updatedAt.toISOString(), updatedBy: r.updatedById ? nameById.get(r.updatedById) ?? null : null }]),
  ) as Partial<Record<SiteContentKey, SectionStatus>>;

  return { content: mergeRows(rows), status };
}

export async function saveSection<K extends SiteContentKey>(key: K, value: SiteContent[K], userId: string) {
  const json = value as Prisma.InputJsonValue;
  await getPrisma().siteContent.upsert({
    where: { key },
    create: { key, value: json, updatedById: userId },
    update: { value: json, updatedById: userId },
  });
}

export async function resetSection(key: SiteContentKey) {
  await getPrisma().siteContent.deleteMany({ where: { key } });
}
