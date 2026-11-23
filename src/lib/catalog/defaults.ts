import { SHOP_CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { toCategory, type Catalog } from "@/lib/catalog/schema";

/**
 * The catalog as it was built into the code (src/data/products.ts and
 * src/data/categories.ts). The site shows this until the catalog is imported
 * into the database (Admin → Products → Import), and whenever the database is
 * unreachable. The import copies exactly these records.
 */
export const DEFAULT_CATALOG: Catalog = {
  products: PRODUCTS.map((p) => ({
    ...p,
    priceINR: p.priceINR ?? Math.round(p.priceUSD * 83.5),
    categories: SHOP_CATEGORIES.filter((c) => c.match(p)).map((c) => c.slug),
  })),
  categories: SHOP_CATEGORIES.map((c, i) =>
    toCategory({
      slug: c.slug,
      label: c.label,
      room: c.room,
      image: c.image,
      href: c.href === `/category/${c.slug}` ? "" : c.href,
      description: "",
      position: (i + 1) * 10,
    }),
  ),
};
