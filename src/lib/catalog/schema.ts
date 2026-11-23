import { z } from "zod";

import { ROOMS, type Room } from "@/data/categories";
import type { FieldMeta } from "@/lib/site-content/schema";
import type { Product } from "@/types";

/**
 * Products and categories edited in Admin → Products / Categories. As with the
 * homepage sections, each Zod schema is at once the validation for saves and
 * the admin form (SchemaForm reads the `.meta()` labels and widgets).
 */

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Slugs that would clash with admin routes such as /admin/products/new. */
const RESERVED_SLUGS = new Set(["new"]);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const slug = (label: string, help: string) =>
  z
    .string()
    .trim()
    .max(80)
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers and dashes only (e.g. teak-king-bed)")
    .refine((s) => !RESERVED_SLUGS.has(s), "This web address is reserved; choose another")
    .meta({ label, help });

const m = (meta: FieldMeta) => meta;
const text = (label: string, help?: string, max = 300) => z.string().trim().max(max).meta(m({ label, help }));
const required = (label: string, help?: string, max = 300) =>
  z.string().trim().min(1, `${label} is required`).max(max).meta(m({ label, help }));
const longText = (label: string, help?: string) => z.string().trim().max(5000).meta(m({ label, help, widget: "textarea" }));
const image = (label: string, help?: string, isRequired = false) =>
  (isRequired ? z.string().trim().min(1, `${label} is required`) : z.string().trim())
    .max(1000)
    .meta(m({ label, help, widget: "image" }));
const color = (label: string) =>
  z.string().trim().regex(/^#[0-9a-f]{6}$/i, "Use a colour like #F3ECE1").meta(m({ label, widget: "color" }));
const strings = (label: string, help?: string, max = 30) =>
  z.array(z.string().trim().min(1, `${label}: remove empty entries`).max(500)).max(max).meta(m({ label, help }));

// ── Products ────────────────────────────────────────────────────────────────

export const PRODUCT_TYPES = [
  { value: "sofas", label: "Sofa" },
  { value: "recliners", label: "Recliner" },
  { value: "beds", label: "Bed / cot" },
  { value: "dining", label: "Dining" },
  { value: "curtains", label: "Curtains & blinds" },
  { value: "furniture", label: "Other furniture" },
  { value: "lighting", label: "Lighting" },
  { value: "objects", label: "Decor object" },
] as const satisfies readonly { value: Product["category"]; label: string }[];

type ProductType = (typeof PRODUCT_TYPES)[number]["value"];
const productTypeValues = PRODUCT_TYPES.map((t) => t.value) as [ProductType, ...ProductType[]];

export const productSchema = z.object({
  id: slug("Web address", "The product's link: /product/<web-address>. Leave empty to make one from the name. It can't be changed later."),
  name: required("Name"),
  subtitle: required("Short description", "One line shown under the name on product cards", 500),
  category: z.enum(productTypeValues).meta(
    m({ label: "Product type", help: "Decides the “related products” shown on its page", options: [...PRODUCT_TYPES] }),
  ),
  categories: z
    .array(z.string())
    .max(50)
    .meta(m({ label: "Show in categories", help: "The shop categories and menu items this product is listed under", widget: "checklist" })),
  priceINR: z.number().int("Use a whole number").min(0).max(100_000_000).meta(m({ label: "Price (₹)" })),
  priceOnEnquiry: z.boolean().meta(m({ label: "Hide the price (show “Price on enquiry”)" })),
  inStock: z.boolean().meta(m({ label: "In stock" })),
  featured: z.boolean().meta(m({ label: "Featured (suggested on other product pages)" })),
  tag: text("Tag", "Short label on the photo, e.g. Bestseller or New"),
  badge: text("Badge", "e.g. In Kurnool Showroom"),

  primaryImage: image("Main photo", undefined, true),
  hoverImage: image("Second photo", "Shown when the mouse is over the product card"),
  galleryImages: z
    .array(image("Photo"))
    .max(30)
    .meta(m({ label: "More photos", help: "Extra photos on the product page" })),

  description: longText("Description"),
  details: strings("Key features", "One feature per line"),
  dimensions: text("Dimensions", "e.g. W 215 cm x D 92 cm x H 85 cm"),
  materials: text("Materials"),
  warranty: text("Warranty"),
  availability: text("Availability", "e.g. Ready for immediate delivery in Kurnool"),
  designer: text("Collection / designer"),
  year: z.number().int().min(1900).max(2100).meta(m({ label: "Year", help: "Newer years appear first under “New Designs”" })),

  finishes: z
    .array(
      z.object({
        id: slug("Code", "Short code, e.g. ivory-boucle"),
        name: required("Name"),
        colorHex: color("Colour"),
        image: image("Photo in this finish", "Optional"),
      }),
    )
    .min(1, "Add at least one finish")
    .max(30)
    .meta(m({ label: "Finishes", help: "Customers choose one when they add the product to their inquiry list", itemLabel: "name" })),
  colors: z
    .array(z.object({ name: required("Name"), hex: color("Colour") }))
    .max(30)
    .meta(m({ label: "Colour options", itemLabel: "name" })),
  configurations: strings("Configurations", "e.g. 3-seater, L-shaped"),
  budgetRanges: strings("Budget ranges", "Choices in the enquiry form"),
  expandableSections: z
    .array(z.object({ title: required("Title"), content: longText("Text") }))
    .max(20)
    .meta(m({ label: "Information sections", help: "Expandable panels on the product page", itemLabel: "title" })),

  rating: z.number().min(0).max(5).meta(m({ label: "Rating (0–5)" })),
  reviewCount: z.number().int().min(0).meta(m({ label: "Number of reviews" })),
});

export type ProductInput = z.infer<typeof productSchema>;

const USD_PER_INR = 1 / 83.5;
const optional = (s: string) => (s ? s : undefined);
/** Components test optional lists with `list ? list[0] : fallback`, so an empty list must be left out. */
const optionalList = <T,>(list: T[]) => (list.length ? list : undefined);

/** Turns a stored/edited product into the shape the storefront components use. */
export function toProduct(input: ProductInput): Product {
  return {
    ...input,
    priceUSD: Math.round(input.priceINR * USD_PER_INR),
    tag: optional(input.tag),
    badge: optional(input.badge),
    hoverImage: optional(input.hoverImage),
    warranty: optional(input.warranty),
    availability: optional(input.availability),
    galleryImages: optionalList(input.galleryImages.filter(Boolean)),
    colors: optionalList(input.colors),
    configurations: optionalList(input.configurations),
    budgetRanges: optionalList(input.budgetRanges),
    expandableSections: optionalList(input.expandableSections),
    finishes: input.finishes.map((f) => ({ ...f, image: optional(f.image) })),
  };
}

/** The reverse: a storefront product as form values. */
export function toProductInput(p: Product): ProductInput {
  return {
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    category: p.category,
    categories: p.categories ?? [],
    priceINR: p.priceINR ?? Math.round(p.priceUSD / USD_PER_INR),
    priceOnEnquiry: p.priceOnEnquiry ?? false,
    inStock: p.inStock,
    featured: p.featured ?? false,
    tag: p.tag ?? "",
    badge: p.badge ?? "",
    primaryImage: p.primaryImage,
    hoverImage: p.hoverImage ?? "",
    galleryImages: p.galleryImages ?? [],
    description: p.description,
    details: p.details,
    dimensions: p.dimensions,
    materials: p.materials,
    warranty: p.warranty ?? "",
    availability: p.availability ?? "",
    designer: p.designer,
    year: p.year,
    finishes: p.finishes.map((f) => ({ id: f.id, name: f.name, colorHex: f.colorHex, image: f.image ?? "" })),
    colors: p.colors ?? [],
    configurations: p.configurations ?? [],
    budgetRanges: p.budgetRanges ?? [],
    expandableSections: p.expandableSections ?? [],
    rating: p.rating,
    reviewCount: p.reviewCount,
  };
}

export const newProductInput = (): ProductInput => ({
  id: "",
  name: "",
  subtitle: "",
  category: "furniture",
  categories: [],
  priceINR: 0,
  priceOnEnquiry: false,
  inStock: true,
  featured: false,
  tag: "",
  badge: "",
  primaryImage: "",
  hoverImage: "",
  galleryImages: [],
  description: "",
  details: [],
  dimensions: "",
  materials: "",
  warranty: "",
  availability: "",
  designer: "Mallikarjuna Signature Living",
  year: new Date().getFullYear(),
  finishes: [{ id: "standard", name: "Standard", colorHex: "#d9cfc1", image: "" }],
  colors: [],
  configurations: [],
  budgetRanges: [],
  expandableSections: [],
  rating: 5,
  reviewCount: 0,
});

// ── Categories ──────────────────────────────────────────────────────────────

const roomValues = ROOMS.map((r) => r.key) as [Room, ...Room[]];

export const categorySchema = z.object({
  slug: slug("Web address", "Used in the link /category/<web-address>. Leave empty to make one from the name. It can't be changed later."),
  label: required("Name", undefined, 80),
  room: z.enum(roomValues).meta(
    m({ label: "Menu group", help: "Where it appears in the website's top menu", options: ROOMS.map((r) => ({ value: r.key, label: r.label })) }),
  ),
  image: image("Photo", "Shown in the menu", true),
  href: z
    .string()
    .trim()
    .max(300)
    .refine((s) => s === "" || s.startsWith("/") || s.startsWith("https://"), "Start with / or https://")
    .meta(m({ label: "Link", help: "Leave empty to use its own page at /category/<web-address>. Sofas, Recliners and similar link to their Kurnool pages." })),
  description: longText("Introduction", "Text at the top of its category page. Leave empty for a standard sentence."),
  position: z.number().int().min(0).max(10_000).meta(m({ label: "Order", help: "Lower numbers come first in the menu" })),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export type Category = Omit<CategoryInput, "href"> & {
  /** Where the category links to (its own /category page unless set). */
  href: string;
  /** True when the category is served by /category/[slug]. */
  hasOwnPage: boolean;
};

export function toCategory(input: CategoryInput): Category {
  const own = `/category/${input.slug}`;
  const href = input.href || own;
  return { ...input, href, hasOwnPage: href === own };
}

export const toCategoryInput = (c: Category): CategoryInput => ({
  slug: c.slug,
  label: c.label,
  room: c.room,
  image: c.image,
  href: c.hasOwnPage ? "" : c.href,
  description: c.description,
  position: c.position,
});

export const newCategoryInput = (position: number): CategoryInput => ({
  slug: "",
  label: "",
  room: "living",
  image: "",
  href: "",
  description: "",
  position,
});

export type Catalog = { products: Product[]; categories: Category[] };
