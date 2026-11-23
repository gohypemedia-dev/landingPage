import { z } from "zod";

/**
 * Editable homepage content. Each section is one Zod schema, which gives us:
 *  - the TypeScript type the storefront components use (z.infer),
 *  - server-side validation when the admin saves,
 *  - the admin form itself: SchemaForm walks the schema and reads `meta`
 *    (label, widget, help, itemLabel) to decide which input to render.
 *
 * To make a new field editable: add it here, add its default in defaults.ts,
 * and read it in the component. The admin form updates automatically.
 */

export type FieldMeta = {
  label?: string;
  help?: string;
  /** Input to render for a string: plain text by default. */
  widget?: "textarea" | "image" | "video" | "color" | "checklist" | "datetime";
  /** For arrays of objects: the field whose value titles each item. */
  itemLabel?: string;
  /** Choices for a select (enum) or a checklist (array of strings), with display labels. */
  options?: { value: string; label: string }[];
};

const text = (label: string, help?: string) => z.string().trim().max(500).meta({ label, help });
const longText = (label: string, help?: string) =>
  z.string().trim().max(3000).meta({ label, help, widget: "textarea" });
const link = (label = "Link", help = "A page on this site (/sofas-kurnool) or a full https:// URL") =>
  z.string().trim().max(500).meta({ label, help });
const imageUrl = (label = "Image", required = true) =>
  (required ? z.string().trim().min(1, `${label} is required`) : z.string().trim())
    .max(1000)
    .meta({ label, widget: "image" });
const videoUrl = (label = "Video", help?: string, required = false) =>
  (required ? z.string().trim().min(1, `${label} is required`) : z.string().trim())
    .max(1000)
    .meta({ label, widget: "video", help });
const enabled = () => z.boolean().meta({ label: "Show this section on the homepage" });
const list = <T extends z.ZodType>(item: T, label: string, max = 30, itemLabel?: string) =>
  z.array(item).max(max).meta({ label, itemLabel });

const imageWithAlt = (label: string) =>
  z.object({ src: imageUrl("Image"), alt: text("Alt text", "Describes the photo for screen readers and Google") }).meta({ label });

// ── Sections ────────────────────────────────────────────────────────────────

export const heroSchema = z.object({
  eyebrow: text("Small heading above the title"),
  title: text("Title"),
  ctaText: text("Button text"),
  ctaHref: link("Button link"),
  desktopVideo: videoUrl("Desktop video (landscape)", "MP4, ideally 1280×720 and under 10 MB", true),
  desktopPoster: imageUrl("Desktop poster image (shown while the video loads)", false),
  mobileVideo: videoUrl("Mobile video (portrait)", "MP4, ideally 720×1280", true),
  mobilePoster: imageUrl("Mobile poster image", false),
});

export const promoSlidesSchema = z.object({
  enabled: enabled(),
  slides: list(
    z.object({
      titleLine1: text("Title, line 1"),
      titleLine2: text("Title, line 2"),
      label: text("Label (read by screen readers)"),
      href: link(),
      left: imageWithAlt("Left photo"),
      right: imageWithAlt("Right photo"),
    }),
    "Banner slides",
    10,
    "titleLine1",
  ),
});

export const festiveOfferSchema = z.object({
  enabled: enabled(),
  eyebrow: text("Small text above the heading"),
  heading: text("Heading"),
  saleLabel: text("Sale label"),
  tagline: text("Tagline"),
  taglineBold: text("Tagline (bold part)"),
  offers: list(
    z.object({
      sealTop: text("Seal, top word"),
      sealBottom: text("Seal, bottom word"),
      title: text("Offer"),
      worth: text("Worth"),
      note: text("Small print"),
      image: imageWithAlt("Photo"),
    }),
    "Offers",
    4,
    "title",
  ),
  image: imageWithAlt("Side photo"),
  perks: list(text("Perk"), "Perks", 6),
  terms: text("Terms note"),
});

export const addOnSaleSchema = z.object({
  enabled: enabled(),
  headingTop: text("Heading"),
  headingAccent: text("Heading (accent word)"),
  subtitle: text("Subtitle"),
  columns: list(
    z.object({
      tags: list(text("Tag"), "Categories (Shop …)", 4),
      href: link(),
      image: imageWithAlt("Main photo"),
      discount: text("Discount", "e.g. 10%"),
      addOnLabel: text("Add-on text", "e.g. On Coffee Table"),
      addOnImage: imageWithAlt("Add-on photo"),
    }),
    "Columns",
    6,
    "addOnLabel",
  ),
});

export const DEAL_TIMER_MODES = [
  { value: "daily", label: "Restarts every night at midnight" },
  { value: "until", label: "Counts down to a date and time" },
  { value: "off", label: "Hide the countdown" },
] as const;

export const dealBannerSchema = z
  .object({
  enabled: enabled(),
  // New fields have defaults so a version saved before they existed still loads.
  timerMode: z
    .enum(["daily", "until", "off"])
    .default("daily")
    .meta({ label: "Countdown", options: DEAL_TIMER_MODES.map((m) => ({ value: m.value, label: m.label })) }),
  timerEndsAt: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})?$/, "Pick a date and time")
    .default("")
    .meta({
      label: "Countdown ends at (India time)",
      help: "Only for “Counts down to a date and time”. The countdown disappears when it reaches zero.",
      widget: "datetime",
    }),
  eyebrow: text("Timer label"),
  saleBadge: text("Sale badge"),
  saleOff: text("Sale headline"),
  cashbackBold: text("Cashback (bold part)"),
  cashbackText: text("Cashback (rest)"),
  emiTitle: text("EMI headline"),
  emiOn: text("EMI suffix"),
  banks: list(text("Bank"), "Banks", 10),
  banksMore: text("Text after the banks", "e.g. +More. Leave empty to hide it.").default("+More"),
  terms: text("Terms note"),
  })
  .refine((d) => d.timerMode !== "until" || d.timerEndsAt !== "", {
    message: "Pick when the countdown ends",
    path: ["timerEndsAt"],
  });

export const popularCategoriesSchema = z.object({
  enabled: enabled(),
  heading: text("Heading"),
  items: list(
    z.object({ label: text("Name"), href: link(), image: imageUrl("Circle photo") }),
    "Categories",
    20,
    "label",
  ),
});

const productRow = (label: string) =>
  z.object({ enabled: z.boolean().meta({ label: "Show this row" }), title: text("Row title") }).meta({ label });

export const productRowsSchema = z.object({
  newDesigns: productRow("New Designs row"),
  bestSellers: productRow("Best Sellers row"),
  onlineExclusive: productRow("Online Exclusive row"),
});

export const atmosphereSchema = z.object({
  enabled: enabled(),
  banners: list(
    z.object({
      title: text("Title"),
      description: longText("Description"),
      href: link("Button link"),
      linkText: text("Button text"),
      image: imageWithAlt("Background photo"),
      objectPosition: text("Photo focus", "Which part of the photo stays in frame, e.g. center 55%"),
      background: z.string().trim().max(20).meta({ label: "Background colour", widget: "color", help: "Shown while the photo loads" }),
      productIds: list(text("Product id"), "Products in the moving column", 12),
    }),
    "Banners",
    8,
    "title",
  ),
});

export const shopByLookSchema = z.object({
  enabled: enabled(),
  heading: text("Heading"),
  looks: list(
    z.object({
      title: text("Title"),
      href: link("Shop Now link"),
      poster: imageUrl("Cover image (9:16 portrait)"),
      video: videoUrl("Reel video (optional)", "Plays when this card is in front"),
      instagram: link("Instagram reel URL (optional)", "e.g. https://www.instagram.com/reel/ABC123/ — used instead of the video"),
    }),
    "Looks",
    15,
    "title",
  ),
});

export const faqsSchema = z.object({
  enabled: enabled(),
  heading: text("Heading"),
  items: list(z.object({ question: text("Question"), answer: longText("Answer") }), "Questions", 30, "question"),
});

export const testimonialsSchema = z.object({
  enabled: enabled(),
  heading: text("Heading"),
  items: list(
    z.object({
      author: text("Customer name"),
      product: text("Product"),
      rating: z.number().int().min(1).max(5).meta({ label: "Rating (1–5)" }),
      comment: longText("Review"),
    }),
    "Reviews",
    40,
    "author",
  ),
});

export const storyCardsSchema = z.object({
  enabled: enabled(),
  cards: list(
    z.object({
      heading: text("Tab label"),
      title: text("Title"),
      text: longText("Text"),
      image: imageWithAlt("Photo"),
      cta: text("Button text"),
      href: link("Button link"),
      external: z.boolean().meta({ label: "Open link in a new tab" }),
      showMap: z.boolean().meta({ label: "Show the showroom map instead of the photo" }),
    }),
    "Cards",
    6,
    "heading",
  ),
});

// ── Site-wide ───────────────────────────────────────────────────────────────

/** The "Request Pricing & Catalogue" popup shown on every page. */
export const inquiryPopupSchema = z.object({
  autoOpen: z.boolean().meta({ label: "Open automatically when someone visits a page" }),
  delaySeconds: z
    .number()
    .min(0)
    .max(120)
    .meta({ label: "Seconds to wait before it opens", help: "0 opens it straight away" }),
  showLauncher: z.boolean().meta({ label: "After it is closed, show a floating button to reopen it" }),
  launcherText: text("Floating button text"),
  slides: z
    .array(
      z.object({
        image: imageUrl("Photo"),
        position: z
          .string()
          .trim()
          .regex(/^(\d{1,3}% \d{1,3}%)?$/, "Use two percentages like 78% 72%, or leave empty")
          .meta({
            label: "Photo focus",
            help: "Which part of the photo stays in view: across% down%, e.g. 78% 72%. Empty = centre.",
          }),
      }),
    )
    .min(1, "Add at least one photo")
    .max(8)
    .meta({ label: "Banner photos", help: "They rotate every few seconds at the top of the popup" }),
  title: text("Title"),
  subtitle: text("Subtitle"),
  categoryLabel: text("Category question"),
  categories: z
    .array(z.string().trim().min(1, "Remove empty categories").max(120))
    .min(1, "Add at least one category")
    .max(20)
    .meta({ label: "Category choices", help: "The options in the dropdown; the first one is selected by default" }),
  buttonText: text("Button text"),
});

// ── Registry ────────────────────────────────────────────────────────────────

export const siteContentSchemas = {
  hero: heroSchema,
  promoSlides: promoSlidesSchema,
  festiveOffer: festiveOfferSchema,
  addOnSale: addOnSaleSchema,
  dealBanner: dealBannerSchema,
  popularCategories: popularCategoriesSchema,
  productRows: productRowsSchema,
  atmosphere: atmosphereSchema,
  shopByLook: shopByLookSchema,
  faqs: faqsSchema,
  testimonials: testimonialsSchema,
  storyCards: storyCardsSchema,
  inquiryPopup: inquiryPopupSchema,
} as const;

export type SiteContentKey = keyof typeof siteContentSchemas;
export type SiteContent = { [K in SiteContentKey]: z.infer<(typeof siteContentSchemas)[K]> };

/**
 * Every editable section. Homepage sections are listed in the order they appear
 * on the homepage. `offer` sections are managed under Admin → Offers & sales, and
 * `siteWide` ones (shown on every page) get their own admin menu item.
 */
export const SITE_CONTENT_SECTIONS: {
  key: SiteContentKey;
  title: string;
  description: string;
  siteWide?: boolean;
  offer?: boolean;
}[] = [
  { key: "hero", title: "Hero", description: "Top video, title and button" },
  { key: "promoSlides", title: "Promo slides", description: "Two-photo banners in the top carousel", offer: true },
  { key: "festiveOffer", title: "Festive offer", description: "Seasonal sale slide in the carousel", offer: true },
  { key: "addOnSale", title: "Add-On sale", description: "Four-column add-on discount slide", offer: true },
  { key: "dealBanner", title: "Deal strip", description: "Countdown, cashback and EMI banks", offer: true },
  { key: "popularCategories", title: "Popular categories", description: "Round category photos" },
  { key: "productRows", title: "Product rows", description: "Titles and visibility of the product rows" },
  { key: "atmosphere", title: "Room banners", description: "Full-width Living, Bedroom, Office, Dining banners" },
  { key: "shopByLook", title: "Shop by look", description: "Portrait reels carousel" },
  { key: "faqs", title: "FAQs", description: "Frequently asked questions" },
  { key: "testimonials", title: "Testimonials", description: "Customer reviews" },
  { key: "storyCards", title: "Story cards", description: "About, International Collection, Visit Us" },
  {
    key: "inquiryPopup",
    title: "Inquiry popup",
    description: "The “Request Pricing & Catalogue” popup on every page",
    siteWide: true,
  },
];

export const HOMEPAGE_SECTIONS = SITE_CONTENT_SECTIONS.filter((s) => !s.siteWide && !s.offer);
export const OFFER_SECTIONS = SITE_CONTENT_SECTIONS.filter((s) => s.offer);

/** Where a section's editor belongs in the admin menu. */
export function sectionHome(key: string): { href: string; label: string } {
  const s = SITE_CONTENT_SECTIONS.find((x) => x.key === key);
  if (s?.siteWide) return { href: `/admin/content/${key}`, label: s.title };
  if (s?.offer) return { href: "/admin/offers", label: "Offers & sales" };
  return { href: "/admin", label: "Homepage sections" };
}

export const SITE_CONTENT_KEYS = SITE_CONTENT_SECTIONS.map((s) => s.key);

export const isSiteContentKey = (k: unknown): k is SiteContentKey =>
  typeof k === "string" && k in siteContentSchemas;
