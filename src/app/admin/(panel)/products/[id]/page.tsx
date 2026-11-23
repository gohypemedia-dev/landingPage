import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogEditor } from "@/components/admin/CatalogEditor";
import { newProductInput, toProductInput } from "@/lib/catalog/schema";
import { findProduct } from "@/lib/catalog/queries";
import { getCatalogForAdmin } from "@/lib/server/catalog";
import { requireAdmin } from "@/lib/server/session";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Product" };

/** /admin/products/new creates a product; any other id edits that product. */
export default async function ProductEditorPage({ params }: Props) {
  // Checked here, not only in the layout: layouts do not re-run on navigation, so each page guards its own data.
  await requireAdmin();
  const { id } = await params;
  const { catalog, updatedAt } = await getCatalogForAdmin();
  const categoryOptions = catalog.categories.map((c) => ({ value: c.slug, label: c.label }));

  if (id === "new") {
    return <CatalogEditor kind="product" originalKey={null} initial={newProductInput()} categoryOptions={categoryOptions} />;
  }

  const product = findProduct(catalog, id);
  if (!product) notFound();

  return (
    <CatalogEditor
      // Remount when switching products so the form state resets.
      key={id}
      kind="product"
      originalKey={id}
      initial={toProductInput(product)}
      categoryOptions={categoryOptions}
      updatedAt={updatedAt[`product:${id}`]}
    />
  );
}
