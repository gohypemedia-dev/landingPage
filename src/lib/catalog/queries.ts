import type { Catalog, Category } from "@/lib/catalog/schema";
import type { Product } from "@/types";

/** Products listed under a category, in catalog order. */
export const categoryProducts = (catalog: Catalog, slug: string): Product[] =>
  catalog.products.filter((p) => p.categories?.includes(slug));

/** Categories served by /category/[slug] (the rest link to their own Kurnool pages). */
export const ownPageCategories = (catalog: Catalog): Category[] => catalog.categories.filter((c) => c.hasOwnPage);

export const findProduct = (catalog: Catalog, id: string) => catalog.products.find((p) => p.id === id);
