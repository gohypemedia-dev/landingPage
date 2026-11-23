import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import type { Prisma } from "@/generated/prisma/client";
import { DEFAULT_CATALOG } from "@/lib/catalog/defaults";
import {
  categorySchema,
  productSchema,
  toCategory,
  toCategoryInput,
  toProduct,
  toProductInput,
  type Catalog,
  type CategoryInput,
  type ProductInput,
} from "@/lib/catalog/schema";
import { getPrisma } from "@/lib/server/db";
import { isDatabaseConfigured } from "@/lib/server/env";

export const CATALOG_TAG = "catalog";

/** A problem the admin can fix (shown to them as is). */
export class CatalogError extends Error {}

type Db = Prisma.TransactionClient | ReturnType<typeof getPrisma>;
type ProductRow = { id: string; data: unknown };
type CategoryRow = { slug: string; position: number; data: unknown };

/** What goes in the `data` column: everything except the fields stored in their own columns. */
const without = <T extends object>(value: T, keys: (keyof T)[]) =>
  Object.fromEntries(Object.entries(value).filter(([k]) => !keys.includes(k as keyof T))) as Prisma.InputJsonValue;
const productData = (input: ProductInput) => without(input, ["id"]);
const categoryData = (input: CategoryInput) => without(input, ["slug", "position"]);

/** Rows → storefront catalog. Rows that no longer match their schema are skipped (and logged). */
function rowsToCatalog(products: ProductRow[], categories: CategoryRow[]): Catalog {
  const out: Catalog = { products: [], categories: [] };
  for (const row of categories) {
    const parsed = categorySchema.safeParse({ ...(row.data as object), slug: row.slug, position: row.position });
    if (parsed.success) out.categories.push(toCategory(parsed.data));
    else console.warn(`[catalog] category "${row.slug}" is invalid and was skipped`, parsed.error.issues[0]);
  }
  for (const row of products) {
    const parsed = productSchema.safeParse({ ...(row.data as object), id: row.id });
    if (parsed.success) out.products.push(toProduct(parsed.data));
    else console.warn(`[catalog] product "${row.id}" is invalid and was skipped`, parsed.error.issues[0]);
  }
  return out;
}

async function loadRows(db: Db) {
  const [products, categories] = await Promise.all([
    db.product.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }] }),
    db.category.findMany({ orderBy: [{ position: "asc" }, { slug: "asc" }] }),
  ]);
  return { products, categories, imported: products.length > 0 || categories.length > 0 };
}

/**
 * Products and categories for the public site. Cached until an admin saves
 * (updateTag), like the homepage content. Until the catalog has been copied
 * into the database, or while it is unreachable, the built-in catalog is shown.
 */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag(CATALOG_TAG);

  if (!isDatabaseConfigured()) {
    cacheLife("minutes");
    return DEFAULT_CATALOG;
  }

  try {
    const { products, categories, imported } = await loadRows(getPrisma());
    cacheLife("max");
    return imported ? rowsToCatalog(products, categories) : DEFAULT_CATALOG;
  } catch (error) {
    console.error("[catalog] database read failed; serving the built-in catalog", error);
    cacheLife("minutes");
    return DEFAULT_CATALOG;
  }
}

/** Fresh (uncached) read for the admin. `imported` is false while the built-in catalog is in use. */
export async function getCatalogForAdmin() {
  const { products, categories, imported } = await loadRows(getPrisma());
  if (!imported) return { catalog: DEFAULT_CATALOG, imported, updatedAt: {} as Record<string, string> };
  const updatedAt = Object.fromEntries([
    ...products.map((p) => [`product:${p.id}`, p.updatedAt.toISOString()]),
    ...categories.map((c) => [`category:${c.slug}`, c.updatedAt.toISOString()]),
  ]);
  return { catalog: rowsToCatalog(products, categories), imported, updatedAt };
}

/**
 * The first change made in the admin copies the built-in catalog into the
 * database, so editing one product never makes the others disappear.
 */
async function ensureImported(tx: Prisma.TransactionClient, userId: string) {
  const [products, categories] = await Promise.all([tx.product.count(), tx.category.count()]);
  if (products > 0 || categories > 0) return;
  await tx.category.createMany({
    data: DEFAULT_CATALOG.categories.map((c) => {
      const input = toCategoryInput(c);
      return { slug: input.slug, position: input.position, data: categoryData(input), updatedById: userId };
    }),
  });
  await tx.product.createMany({
    data: DEFAULT_CATALOG.products.map((p, i) => ({
      id: p.id,
      position: (i + 1) * 10,
      data: productData(toProductInput(p)),
      updatedById: userId,
    })),
  });
}

const transaction = <T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) =>
  getPrisma().$transaction(fn, { maxWait: 10_000, timeout: 20_000 });

export async function importCatalog(userId: string) {
  await transaction((tx) => ensureImported(tx, userId));
}

/** Creates a product (originalId null) or updates one. Returns the product's id. */
export async function saveProduct(originalId: string | null, input: ProductInput, userId: string) {
  return transaction(async (tx) => {
    await ensureImported(tx, userId);

    // Keep only categories that still exist.
    const known = new Set((await tx.category.findMany({ select: { slug: true } })).map((c) => c.slug));
    const value: ProductInput = { ...input, categories: input.categories.filter((s) => known.has(s)) };

    if (originalId === null) {
      if (await tx.product.findUnique({ where: { id: value.id }, select: { id: true } })) {
        throw new CatalogError(`A product with the web address “${value.id}” already exists. Choose another.`);
      }
      const last = await tx.product.aggregate({ _max: { position: true } });
      await tx.product.create({
        data: { id: value.id, position: (last._max.position ?? 0) + 10, data: productData(value), updatedById: userId },
      });
      return value.id;
    }

    const updated = await tx.product.updateMany({
      where: { id: originalId },
      data: { data: productData({ ...value, id: originalId }), updatedById: userId },
    });
    if (updated.count === 0) throw new CatalogError("This product no longer exists. It may have been deleted.");
    return originalId;
  });
}

export async function deleteProduct(id: string, userId: string) {
  await transaction(async (tx) => {
    await ensureImported(tx, userId);
    await tx.product.deleteMany({ where: { id } });
  });
}

/** Creates a category (originalSlug null) or updates one. Returns its slug. */
export async function saveCategory(originalSlug: string | null, input: CategoryInput, userId: string) {
  return transaction(async (tx) => {
    await ensureImported(tx, userId);

    if (originalSlug === null) {
      if (await tx.category.findUnique({ where: { slug: input.slug }, select: { slug: true } })) {
        throw new CatalogError(`A category with the web address “${input.slug}” already exists. Choose another.`);
      }
      await tx.category.create({
        data: { slug: input.slug, position: input.position, data: categoryData(input), updatedById: userId },
      });
      return input.slug;
    }

    const updated = await tx.category.updateMany({
      where: { slug: originalSlug },
      data: { position: input.position, data: categoryData(input), updatedById: userId },
    });
    if (updated.count === 0) throw new CatalogError("This category no longer exists. It may have been deleted.");
    return originalSlug;
  });
}

/** Deletes a category and removes it from every product that listed it. */
export async function deleteCategory(slug: string, userId: string) {
  await transaction(async (tx) => {
    await ensureImported(tx, userId);
    await tx.category.deleteMany({ where: { slug } });

    const products = await tx.product.findMany({ select: { id: true, data: true } });
    for (const p of products) {
      const data = p.data as { categories?: unknown };
      if (Array.isArray(data.categories) && data.categories.includes(slug)) {
        await tx.product.update({
          where: { id: p.id },
          data: { data: { ...data, categories: data.categories.filter((s) => s !== slug) } as Prisma.InputJsonValue },
        });
      }
    }
  });
}
