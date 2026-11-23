"use client";

/* eslint-disable @next/next/no-img-element -- thumbnails of arbitrary URLs */

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { deleteCategoryAction, deleteProductAction, importCatalogAction } from "@/app/admin/actions";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export type ProductRowView = {
  id: string;
  name: string;
  image: string;
  type: string;
  categories: string[];
  priceINR: number;
  priceOnEnquiry: boolean;
  inStock: boolean;
  featured: boolean;
};

export type CategoryRowView = {
  slug: string;
  label: string;
  image: string;
  room: string;
  href: string;
  position: number;
  productCount: number;
};

/** Shown while the site still uses the catalog built into the code. */
export function ImportNotice() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="adm-alert adm-alert--info adm-import">
      <p>
        <strong>The website is showing its built-in products and categories.</strong> They are copied into the database
        the first time you save, add or delete one, so nothing disappears. You can also copy them now.
      </p>
      <button
        type="button"
        className="adm-btn adm-btn--small"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await importCatalogAction();
            if (result.ok) router.refresh();
            else setError(result.message);
          })
        }
      >
        {pending ? "Copying…" : "Copy into database"}
      </button>
      {error && <p className="adm-alert adm-alert--error">{error}</p>}
    </div>
  );
}

function useDelete(action: (key: string) => ReturnType<typeof deleteProductAction>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const remove = (key: string, confirmText: string) => {
    if (!confirm(confirmText)) return;
    startTransition(async () => {
      const result = await action(key);
      if (result.ok) router.refresh();
      else setError(result.message);
    });
  };
  return { pending, error, remove };
}

export function ProductsTable({ rows, categoryLabels }: { rows: ProductRowView[]; categoryLabels: Record<string, string> }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const { pending, error, remove } = useDelete(deleteProductAction);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!category || r.categories.includes(category)) &&
        (!q || r.name.toLowerCase().includes(q) || r.id.includes(q)),
    );
  }, [rows, query, category]);

  return (
    <>
      {error && <p className="adm-alert adm-alert--error">{error}</p>}
      <div className="adm-toolbar">
        <input type="text" placeholder="Search products…" aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {Object.entries(categoryLabels).map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>
        <span className="adm-muted">
          {shown.length} of {rows.length}
        </span>
      </div>

      {shown.length === 0 ? (
        <p className="adm-muted">No products match.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th aria-label="Photo" />
                <th>Product</th>
                <th>Categories</th>
                <th>Price</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td>
                    <img src={r.image} alt="" className="adm-thumb" />
                  </td>
                  <td>
                    <Link href={`/admin/products/${r.id}`}>
                      <strong>{r.name}</strong>
                    </Link>
                    <br />
                    <small className="adm-muted">/product/{r.id}</small>
                  </td>
                  <td className="adm-wrap">
                    {r.categories.length ? r.categories.map((c) => categoryLabels[c] ?? c).join(", ") : <span className="adm-muted">None</span>}
                  </td>
                  <td>{r.priceOnEnquiry ? <span className="adm-muted">On enquiry</span> : inr.format(r.priceINR)}</td>
                  <td>
                    <span className="adm-row">
                      {r.inStock ? <span className="adm-pill adm-pill--ok">In stock</span> : <span className="adm-pill adm-pill--muted">Out of stock</span>}
                      {r.featured && <span className="adm-pill">Featured</span>}
                    </span>
                  </td>
                  <td>
                    <span className="adm-row">
                      <Link href={`/admin/products/${r.id}`} className="adm-btn adm-btn--small">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="adm-btn adm-btn--small adm-btn--danger"
                        disabled={pending}
                        onClick={() => remove(r.id, `Delete “${r.name}”? This can't be undone.`)}
                      >
                        Delete
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export function CategoriesTable({ rows, roomLabels }: { rows: CategoryRowView[]; roomLabels: Record<string, string> }) {
  const { pending, error, remove } = useDelete(deleteCategoryAction);

  return (
    <>
      {error && <p className="adm-alert adm-alert--error">{error}</p>}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th aria-label="Photo" />
              <th>Category</th>
              <th>Menu group</th>
              <th>Products</th>
              <th>Order</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug}>
                <td>
                  <img src={r.image} alt="" className="adm-thumb" />
                </td>
                <td>
                  <Link href={`/admin/categories/${r.slug}`}>
                    <strong>{r.label}</strong>
                  </Link>
                  <br />
                  <small className="adm-muted">{r.href}</small>
                </td>
                <td>{roomLabels[r.room] ?? r.room}</td>
                <td>{r.productCount}</td>
                <td>{r.position}</td>
                <td>
                  <span className="adm-row">
                    <Link href={`/admin/categories/${r.slug}`} className="adm-btn adm-btn--small">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="adm-btn adm-btn--small adm-btn--danger"
                      disabled={pending}
                      onClick={() =>
                        remove(
                          r.slug,
                          `Delete the category “${r.label}”?${r.productCount ? ` Its ${r.productCount} product(s) stay on the website, just no longer listed under it.` : ""}`,
                        )
                      }
                    >
                      Delete
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
