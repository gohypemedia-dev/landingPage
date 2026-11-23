"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  deleteCategoryAction,
  deleteProductAction,
  saveCategoryAction,
  saveProductAction,
  type ActionResult,
} from "@/app/admin/actions";
import { SchemaForm } from "@/components/admin/SchemaForm";
import { categorySchema, productSchema, type CategoryInput, type ProductInput } from "@/lib/catalog/schema";

type Props =
  | {
      kind: "product";
      /** null while creating a new product. */
      originalKey: string | null;
      initial: ProductInput;
      categoryOptions: { value: string; label: string }[];
      updatedAt?: string;
      /** Where "View on site" opens (defaults to the record's own page). */
      viewHref?: string;
    }
  | {
      kind: "category";
      originalKey: string | null;
      initial: CategoryInput;
      productCount: number;
      updatedAt?: string;
      /** Where "View on site" opens (defaults to the record's own page). */
      viewHref?: string;
    };

const TEXT = {
  product: { list: "/admin/products", back: "← Products", noun: "product", view: (k: string) => `/product/${k}` },
  category: { list: "/admin/categories", back: "← Categories", noun: "category", view: (k: string) => `/category/${k}` },
} as const;

/**
 * The form in folding sections, most-used first, so the everyday edits (name,
 * price, photo, categories, stock) aren't buried among the rarely-touched ones.
 * Every schema field must appear in exactly one section.
 */
type Section = { title: string; hint: string; keys: string[]; open?: boolean };

const SECTIONS: Record<Props["kind"], Section[]> = {
  product: [
    {
      title: "Basic details",
      hint: "Name, price, main photo and where it’s listed",
      keys: ["id", "name", "subtitle", "priceINR", "priceOnEnquiry", "primaryImage", "categories", "inStock"],
      open: true,
    },
    { title: "More photos", hint: "Second photo and gallery", keys: ["hoverImage", "galleryImages"] },
    {
      title: "Description & specifications",
      hint: "Description, key features, size, materials, warranty",
      keys: ["description", "details", "dimensions", "materials", "warranty", "availability"],
    },
    {
      title: "Finishes & options",
      hint: "Finishes, colours, sizes and budget choices customers pick from",
      keys: ["finishes", "colors", "configurations", "budgetRanges"],
    },
    {
      title: "Labels & extra settings",
      hint: "Product type, featured, tag, badge, rating and information panels",
      keys: ["category", "featured", "tag", "badge", "designer", "year", "rating", "reviewCount", "expandableSections"],
    },
  ],
  category: [
    { title: "Basic details", hint: "Name, photo and menu group", keys: ["slug", "label", "image", "room"], open: true },
    { title: "Page & menu settings", hint: "Link, introduction text and order", keys: ["href", "description", "position"] },
  ],
};

/** Create / edit / delete form for one product or category. */
export function CatalogEditor(props: Props) {
  const { kind, originalKey, initial, updatedAt } = props;
  const text = TEXT[kind];
  const isNew = originalKey === null;
  const router = useRouter();

  const [value, setValue] = useState<unknown>(initial);
  const [saved, setSaved] = useState<unknown>(initial);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  const categoryOptions = kind === "product" ? props.categoryOptions : null;
  const schema = useMemo(() => {
    if (kind === "category") return isNew ? categorySchema : categorySchema.omit({ slug: true });
    const meta = productSchema.shape.categories.meta() ?? {};
    const withOptions = productSchema.extend({
      categories: z.array(z.string()).max(50).meta({ ...meta, options: categoryOptions ?? [] }),
    });
    // The web address is the product's link, so it is only set when creating.
    return isNew ? withOptions : withOptions.omit({ id: true });
  }, [kind, isNew, categoryOptions]);

  // One sub-schema per section; each SchemaForm edits the same value, only its own fields.
  const sections = useMemo(() => {
    const shape = (schema as unknown as z.ZodObject<z.ZodRawShape>).shape;
    return SECTIONS[kind]
      .map((s) => {
        const keys = s.keys.filter((k) => k in shape);
        const mask = Object.fromEntries(keys.map((k) => [k, true as const]));
        return { ...s, schema: (schema as unknown as z.ZodObject<z.ZodRawShape>).pick(mask) };
      })
      .filter((s) => Object.keys(s.schema.shape).length > 0);
  }, [kind, schema]);

  const current = value as Record<string, unknown>;
  const name = String((kind === "product" ? current.name : current.label) || "");
  const title = isNew ? `New ${text.noun}` : name || originalKey;

  const save = () =>
    startTransition(async () => {
      const result: ActionResult<{ id?: string; slug?: string }> =
        kind === "product" ? await saveProductAction(originalKey, value) : await saveCategoryAction(originalKey, value);
      if (!result.ok) {
        setMessage({ kind: "error", text: result.message });
        return;
      }
      if (isNew) {
        const key = result.data?.id ?? result.data?.slug;
        router.replace(`${text.list}/${key}`);
        return;
      }
      setSaved(value);
      setMessage({ kind: "ok", text: "Saved. The website now shows this version." });
      router.refresh();
    });

  const remove = () => {
    const warning =
      kind === "category" && props.productCount > 0
        ? ` It will be removed from the ${props.productCount} product(s) listed in it; the products stay.`
        : "";
    if (!confirm(`Delete “${name || originalKey}”? This can't be undone.${warning}`)) return;
    startTransition(async () => {
      const result = kind === "product" ? await deleteProductAction(originalKey) : await deleteCategoryAction(originalKey);
      if (result.ok) router.push(text.list);
      else setMessage({ kind: "error", text: result.message });
    });
  };

  return (
    <div className="adm-editor">
      <header className="adm-page-head adm-sticky">
        <div>
          <Link href={text.list} className="adm-back">
            {text.back}
          </Link>
          <h1>{title}</h1>
          <p className="adm-muted">
            {isNew
              ? `Fill in the details and press “Save & publish” to add this ${text.noun} to the website.`
              : updatedAt
                ? `Last saved ${new Date(updatedAt).toLocaleString("en-IN")}`
                : "Built-in, not edited yet"}
          </p>
        </div>
        <span className="adm-row">
          {!isNew && (
            <a href={props.viewHref ?? text.view(originalKey)} target="_blank" rel="noreferrer" className="adm-btn adm-btn--ghost">
              View on site ↗
            </a>
          )}
          {!isNew && (
            <button type="button" className="adm-btn adm-btn--danger" disabled={pending} onClick={remove}>
              Delete
            </button>
          )}
          <button type="button" className="adm-btn adm-btn--ghost" disabled={!dirty || pending} onClick={() => setValue(saved)}>
            Discard
          </button>
          <button type="button" className="adm-btn adm-btn--primary" disabled={(!dirty && !isNew) || pending} onClick={save}>
            {pending ? "Saving…" : "Save & publish"}
          </button>
        </span>
      </header>

      {message && (
        <p className={`adm-alert adm-alert--${message.kind === "ok" ? "ok" : "error"}`} role="status">
          {message.text}
        </p>
      )}

      {sections.map((s) => (
        <details key={s.title} className="adm-fold" open={s.open}>
          <summary>
            <span>
              <strong>{s.title}</strong>
              <small>{s.hint}</small>
            </span>
          </summary>
          <div className="adm-fold-body">
            <SchemaForm schema={s.schema} value={value} onChange={setValue} />
          </div>
        </details>
      ))}
    </div>
  );
}
