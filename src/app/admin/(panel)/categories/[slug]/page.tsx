import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogEditor } from "@/components/admin/CatalogEditor";
import { newCategoryInput, toCategoryInput } from "@/lib/catalog/schema";
import { categoryProducts } from "@/lib/catalog/queries";
import { getCatalogForAdmin } from "@/lib/server/catalog";
import { requireAdmin } from "@/lib/server/session";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Category" };

/** /admin/categories/new creates a category; any other slug edits that category. */
export default async function CategoryEditorPage({ params }: Props) {
  // Checked here, not only in the layout: layouts do not re-run on navigation, so each page guards its own data.
  await requireAdmin();
  const { slug } = await params;
  const { catalog, updatedAt } = await getCatalogForAdmin();

  if (slug === "new") {
    const last = Math.max(0, ...catalog.categories.map((c) => c.position));
    return <CatalogEditor kind="category" originalKey={null} initial={newCategoryInput(last + 10)} productCount={0} />;
  }

  const category = catalog.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const prods = categoryProducts(catalog, slug);

  return (
    <CatalogEditor
      key={slug}
      kind="category"
      originalKey={slug}
      initial={toCategoryInput(category)}
      productCount={prods.length}
      products={prods}
      updatedAt={updatedAt[`category:${slug}`]}
      viewHref={category.href}
    />
  );
}
