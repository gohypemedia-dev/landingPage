import type { Metadata } from "next";
import Link from "next/link";

import { ImportNotice, ProductsTable } from "@/components/admin/CatalogTables";
import { getCatalogForAdmin } from "@/lib/server/catalog";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  // Checked here, not only in the layout: layouts do not re-run on navigation, so each page guards its own data.
  await requireAdmin();
  const { catalog, imported } = await getCatalogForAdmin();
  const categoryLabels = Object.fromEntries(catalog.categories.map((c) => [c.slug, c.label]));

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Products</h1>
          <p className="adm-muted">Add, edit or remove products. Changes go live as soon as you press “Save &amp; publish”.</p>
        </div>
        <Link href="/admin/products/new" className="adm-btn adm-btn--primary">
          + Add product
        </Link>
      </header>

      {!imported && <ImportNotice />}

      <ProductsTable
        categoryLabels={categoryLabels}
        rows={catalog.products.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.primaryImage,
          type: p.category,
          categories: p.categories ?? [],
          priceINR: p.priceINR ?? 0,
          priceOnEnquiry: p.priceOnEnquiry ?? false,
          inStock: p.inStock,
          featured: p.featured ?? false,
        }))}
      />
    </>
  );
}
