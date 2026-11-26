"use server";

import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { z } from "zod";

import { categorySchema, productSchema, slugify } from "@/lib/catalog/schema";
import {
  CATALOG_TAG,
  CatalogError,
  deleteCategory,
  deleteProduct,
  getCatalogForAdmin,
  importCatalog,
  saveCategory,
  saveProduct,
} from "@/lib/server/catalog";
import { getPrisma } from "@/lib/server/db";
import { getR2Env } from "@/lib/server/env";
import { assertAdmin, UnauthorizedError } from "@/lib/server/session";
import { getSiteContentForAdmin, resetSection, saveSection, SITE_CONTENT_TAG } from "@/lib/server/site-content";
import { deleteObject } from "@/lib/server/storage";
import { isMediaContentType, MEDIA_TYPES, maxBytesFor, type MediaItem } from "@/lib/media";
import { isSiteContentKey, SITE_CONTENT_SECTIONS, siteContentSchemas, type SiteContent } from "@/lib/site-content/schema";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; message: string };

function failure(error: unknown, fallback: string): { ok: false; message: string } {
  if (error instanceof UnauthorizedError || error instanceof CatalogError) return { ok: false, message: error.message };
  console.error(`[admin] ${fallback}`, error);
  return { ok: false, message: fallback };
}

function issueMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Check the form and try again.";
  const where = issue.path.length ? ` (${issue.path.join(" → ")})` : "";
  return `${issue.message}${where}`;
}

// ── Website content ─────────────────────────────────────────────────────────

function siteContentChanged() {
  try {
    updateTag(SITE_CONTENT_TAG);
  } catch {}
  try {
    revalidateTag(SITE_CONTENT_TAG, "default");
  } catch {}
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

export async function saveSectionAction(key: unknown, value: unknown): Promise<ActionResult> {
  if (!isSiteContentKey(key)) return { ok: false, message: "Unknown section." };
  const parsed = siteContentSchemas[key].safeParse(value);
  if (!parsed.success) return { ok: false, message: issueMessage(parsed.error) };

  try {
    const user = await assertAdmin();
    await saveSection(key, parsed.data as SiteContent[typeof key], user.id);
    siteContentChanged();
    return { ok: true };
  } catch (error) {
    return failure(error, "The section could not be saved. Try again.");
  }
}

/** Shows or hides a section without opening its editor (the on/off switches on Offers & sales). */
export async function setSectionEnabledAction(key: unknown, enabled: unknown): Promise<ActionResult> {
  if (!isSiteContentKey(key) || typeof enabled !== "boolean") return { ok: false, message: "Unknown section." };
  try {
    const user = await assertAdmin();
    const { content } = await getSiteContentForAdmin();
    const current = content[key] as Record<string, unknown>;
    if (!("enabled" in current)) return { ok: false, message: "This section can't be switched off." };
    const parsed = siteContentSchemas[key].safeParse({ ...current, enabled });
    if (!parsed.success) return { ok: false, message: issueMessage(parsed.error) };
    await saveSection(key, parsed.data as SiteContent[typeof key], user.id);
    siteContentChanged();
    return { ok: true };
  } catch (error) {
    return failure(error, "The section could not be updated. Try again.");
  }
}

export async function resetSectionAction(key: unknown): Promise<ActionResult> {
  if (!isSiteContentKey(key)) return { ok: false, message: "Unknown section." };
  try {
    await assertAdmin();
    await resetSection(key);
    siteContentChanged();
    return { ok: true };
  } catch (error) {
    return failure(error, "The section could not be reset. Try again.");
  }
}

// ── Products & categories ───────────────────────────────────────────────────

/** Fills an empty web address from the name, so admins don't have to invent slugs. */
function withSlug(value: unknown, slugKey: "id" | "slug", nameKey: "name" | "label") {
  if (!value || typeof value !== "object") return value;
  const v = value as Record<string, unknown>;
  const current = typeof v[slugKey] === "string" ? v[slugKey].trim() : "";
  return current ? v : { ...v, [slugKey]: slugify(typeof v[nameKey] === "string" ? v[nameKey] : "") };
}

const originalKey = (v: unknown) => (typeof v === "string" && v ? v : null);

function catalogChanged() {
  try {
    updateTag(CATALOG_TAG);
  } catch {}
  try {
    revalidateTag(CATALOG_TAG, "default");
  } catch {}
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/sofas-kurnool", "page");
  revalidatePath("/recliners-kurnool", "page");
  revalidatePath("/beds-cots-kurnool", "page");
  revalidatePath("/dining-tables-kurnool", "page");
  revalidatePath("/curtains-blinds-kurnool", "page");
  revalidatePath("/furniture", "page");
}

export async function saveProductAction(originalId: unknown, value: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = productSchema.safeParse(withSlug(value, "id", "name"));
  if (!parsed.success) return { ok: false, message: issueMessage(parsed.error) };
  try {
    const user = await assertAdmin();
    const id = await saveProduct(originalKey(originalId), parsed.data, user.id);
    catalogChanged();
    return { ok: true, data: { id } };
  } catch (error) {
    return failure(error, "The product could not be saved. Try again.");
  }
}

export async function deleteProductAction(id: unknown): Promise<ActionResult> {
  if (typeof id !== "string" || !id) return { ok: false, message: "Unknown product." };
  try {
    const user = await assertAdmin();
    await deleteProduct(id, user.id);
    catalogChanged();
    return { ok: true };
  } catch (error) {
    return failure(error, "The product could not be deleted. Try again.");
  }
}

export async function saveCategoryAction(originalSlug: unknown, value: unknown): Promise<ActionResult<{ slug: string }>> {
  const parsed = categorySchema.safeParse(withSlug(value, "slug", "label"));
  if (!parsed.success) return { ok: false, message: issueMessage(parsed.error) };
  try {
    const user = await assertAdmin();
    const slug = await saveCategory(originalKey(originalSlug), parsed.data, user.id);
    catalogChanged();
    return { ok: true, data: { slug } };
  } catch (error) {
    return failure(error, "The category could not be saved. Try again.");
  }
}

export async function deleteCategoryAction(slug: unknown): Promise<ActionResult> {
  if (typeof slug !== "string" || !slug) return { ok: false, message: "Unknown category." };
  try {
    const user = await assertAdmin();
    await deleteCategory(slug, user.id);
    catalogChanged();
    return { ok: true };
  } catch (error) {
    return failure(error, "The category could not be deleted. Try again.");
  }
}

export async function importCatalogAction(): Promise<ActionResult> {
  try {
    const user = await assertAdmin();
    await importCatalog(user.id);
    catalogChanged();
    return { ok: true };
  } catch (error) {
    return failure(error, "The catalog could not be copied into the database. Try again.");
  }
}

// ── Media library ───────────────────────────────────────────────────────────

const toMediaItem = (m: {
  id: string;
  url: string;
  kind: "IMAGE" | "VIDEO";
  fileName: string;
  alt: string;
  size: number;
  createdAt: Date;
}): MediaItem => ({
  id: m.id,
  url: m.url,
  kind: m.kind,
  fileName: m.fileName,
  alt: m.alt,
  size: m.size,
  createdAt: m.createdAt.toISOString(),
});

const registerSchema = z.object({
  objectKey: z.string().regex(/^(uploads\/)?(images|videos)\/\d{4}\/[0-9a-f-]{36}\.[a-z0-9]+$/),
  contentType: z.string().refine(isMediaContentType, "Unsupported file type"),
  size: z.number().int().positive(),
  fileName: z.string().trim().min(1).max(200),
});

/** Records a file the browser has just uploaded. The public URL is derived here, never trusted from the client. */
export async function registerMediaAction(input: unknown): Promise<ActionResult<MediaItem>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: issueMessage(parsed.error) };
  const { objectKey, contentType, size, fileName } = parsed.data;
  if (!isMediaContentType(contentType)) return { ok: false, message: "Unsupported file type" };
  if (size > maxBytesFor(contentType)) return { ok: false, message: "File is too large." };

  try {
    const user = await assertAdmin();
    const r2 = getR2Env();
    const url = objectKey.startsWith("uploads/")
      ? `/${objectKey}`
      : `${r2!.R2_PUBLIC_URL.replace(/\/$/, "")}/${objectKey}`;

    const asset = await getPrisma().mediaAsset.create({
      data: {
        objectKey,
        url,
        kind: MEDIA_TYPES[contentType].kind,
        contentType,
        size,
        fileName,
        alt: fileName.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " "),
        uploadedById: user.id,
      },
    });
    revalidatePath("/admin/media");
    return { ok: true, data: toMediaItem(asset) };
  } catch (error) {
    return failure(error, "The upload could not be saved. Try again.");
  }
}

export async function listMediaAction(kind?: "IMAGE" | "VIDEO"): Promise<ActionResult<MediaItem[]>> {
  try {
    await assertAdmin();
    const rows = await getPrisma().mediaAsset.findMany({
      where: kind ? { kind } : undefined,
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return { ok: true, data: rows.map(toMediaItem) };
  } catch (error) {
    return failure(error, "The media library could not be loaded.");
  }
}

export async function updateMediaAltAction(id: unknown, alt: unknown): Promise<ActionResult> {
  const parsed = z.object({ id: z.string().min(1), alt: z.string().trim().max(300) }).safeParse({ id, alt });
  if (!parsed.success) return { ok: false, message: issueMessage(parsed.error) };
  try {
    await assertAdmin();
    await getPrisma().mediaAsset.update({ where: { id: parsed.data.id }, data: { alt: parsed.data.alt } });
    return { ok: true };
  } catch (error) {
    return failure(error, "The description could not be saved.");
  }
}

/** Deletes a file unless a homepage section still uses it (pass force to delete anyway). */
export async function deleteMediaAction(id: unknown, force = false): Promise<ActionResult<{ usedIn?: string[] }>> {
  if (typeof id !== "string") return { ok: false, message: "Unknown file." };
  try {
    await assertAdmin();
    const asset = await getPrisma().mediaAsset.findUnique({ where: { id } });
    if (!asset) return { ok: true };

    if (!force) {
      const { content } = await getSiteContentForAdmin();
      const usedIn = SITE_CONTENT_SECTIONS.filter((s) => JSON.stringify(content[s.key]).includes(asset.url)).map(
        (s) => s.title,
      );
      const { catalog } = await getCatalogForAdmin();
      usedIn.push(
        ...catalog.products.filter((p) => JSON.stringify(p).includes(asset.url)).map((p) => `Product: ${p.name}`),
        ...catalog.categories.filter((c) => c.image === asset.url).map((c) => `Category: ${c.label}`),
      );
      if (usedIn.length) return { ok: true, data: { usedIn } };
    }

    await deleteObject(asset.objectKey);
    await getPrisma().mediaAsset.delete({ where: { id } });
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (error) {
    return failure(error, "The file could not be deleted.");
  }
}

// ── Enquiries ───────────────────────────────────────────────────────────────

export async function updateEnquiryStatusAction(id: unknown, status: unknown): Promise<ActionResult> {
  const parsed = z
    .object({ id: z.string().min(1), status: z.enum(["NEW", "CONTACTED", "CLOSED"]) })
    .safeParse({ id, status });
  if (!parsed.success) return { ok: false, message: "Invalid status." };
  try {
    await assertAdmin();
    await getPrisma().enquiry.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return failure(error, "The enquiry could not be updated.");
  }
}

export async function deleteEnquiryAction(id: unknown): Promise<ActionResult> {
  if (typeof id !== "string") return { ok: false, message: "Unknown enquiry." };
  try {
    await assertAdmin();
    await getPrisma().enquiry.deleteMany({ where: { id } });
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return failure(error, "The enquiry could not be deleted.");
  }
}
