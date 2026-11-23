import type { Metadata } from "next";
import Link from "next/link";

import { CategoriesTable, ImportNotice } from "@/components/admin/CatalogTables";
import { ROOMS } from "@/data/categories";
import { categoryProducts } from "@/lib/catalog/queries";
import { getCatalogForAdmin } from "@/lib/server/catalog";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  // Checked here, not only in the layout: layouts do not re-run on navigation, so each page guards its own data.
  await requireAdmin();
  const { catalog, imported } = await getCatalogForAdmin();

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Categories</h1>
          <p className="adm-muted">
            The shop categories in the website’s menu, each with its own page. Choose which products appear in a category on
            the product itself. The round “Popular Categories” on the homepage are edited under Homepage sections.
          </p>
        </div>
        <Link href="/admin/categories/new" className="adm-btn adm-btn--primary">
          + Add category
        </Link>
      </header>

      {!imported && <ImportNotice />}

      <CategoriesTable
        roomLabels={Object.fromEntries(ROOMS.map((r) => [r.key, r.label]))}
        rows={catalog.categories.map((c) => ({
          slug: c.slug,
          label: c.label,
          image: c.image,
          room: c.room,
          href: c.href,
          position: c.position,
          productCount: categoryProducts(catalog, c.slug).length,
        }))}
      />
    </>
  );
}
