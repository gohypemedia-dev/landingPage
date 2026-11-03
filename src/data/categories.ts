import { Product } from "@/types";
import { PRODUCTS } from "@/data/products";

// Every shoppable category in one place: Popular Categories circles, the Shop menu and the category pages.
// `match` decides which products belong; a product can appear in more than one category (e.g. a centre table is also a coffee table).
export type Room = "living" | "bedroom" | "mattresses" | "dining" | "study" | "outdoor" | "decor" | "furnishings";

export interface ShopCategory {
  slug: string;
  room: Room;
  label: string;
  href: string;
  image: string;
  match: (p: Product) => boolean;
  /** Show as a Popular Categories circle on the homepage (default true) */
  inCircles?: boolean;
}

const text = (p: Product) => `${p.name} ${p.subtitle}`.toLowerCase();

export const SHOP_CATEGORIES: ShopCategory[] = [
  { slug: "recliners", room: "living", label: "Recliners", href: "/recliners-kurnool", image: "/images/catalogue-recliner-featured.jpg", match: (p) => p.category === "recliners" },
  { slug: "sofas", room: "living", label: "Sofas", href: "/sofas-kurnool", image: "/images/mf-signature-curved-living.jpg", match: (p) => p.category === "sofas" },
  { slug: "dining", room: "dining", label: "Dining Sets", href: "/dining-tables-kurnool", image: "/images/dining-space.jpg", match: (p) => p.category === "dining" },
  { slug: "beds", room: "bedroom", label: "Beds & Cots", href: "/beds-cots-kurnool", image: "/images/796767853_18093958568640692_8492671734547745348_n.webp", match: (p) => p.category === "beds" },
  { slug: "mattresses", room: "mattresses", label: "Mattresses", href: "/mattresses-kurnool", image: "/images/bedroom-space.jpg", match: (p) => /mattress/.test(text(p)) },
  { slug: "curtains", room: "furnishings", label: "Curtains & Blinds", href: "/curtains-blinds-kurnool", image: "/images/banner-living.jpg", match: (p) => p.category === "curtains" },
  { slug: "decor", room: "decor", label: "Decor", href: "/category/decor", image: "/images/echasse-vase.jpg", match: (p) => p.category === "objects" || p.category === "lighting" },
  { slug: "wardrobes", room: "bedroom", label: "Wardrobes", href: "/category/wardrobes", image: "/images/bedroom-space.jpg", match: (p) => /wardrobe/.test(text(p)) },
  { slug: "chairs", room: "living", label: "Chairs", href: "/category/chairs", image: "/images/lookbook.jpg", match: (p) => /\b(arm)?chairs?\b/.test(p.name.toLowerCase()) },
  { slug: "outdoor", room: "outdoor", label: "Outdoor", href: "/category/outdoor", image: "/images/sustainable-space.jpg", match: (p) => /outdoor|garden|patio|balcony/.test(text(p)) },
  { slug: "dressing-tables", room: "bedroom", label: "Dressing Table", href: "/category/dressing-tables", image: "/images/hashira-lamp.jpg", match: (p) => /dressing|vanity/.test(text(p)) },
  { slug: "study-office", room: "study", label: "Study & Office", href: "/category/study-office", image: "/images/craft-workshop.jpg", match: (p) => /study|office|desk|bookshelf|bookcase/.test(text(p)), inCircles: false },
  { slug: "coffee-tables", room: "living", label: "Coffee Tables", href: "/category/coffee-tables", image: "/images/plinth-table.jpg", match: (p) => /coffee table|centre table|center table/.test(text(p)) },
];

// Navbar groups by room; rooms with more than one category get a dropdown
export const ROOMS: { key: Room; label: string }[] = [
  { key: "living", label: "Living" },
  { key: "bedroom", label: "Bedroom" },
  { key: "mattresses", label: "Mattresses" },
  { key: "dining", label: "Dining" },
  { key: "study", label: "Study & Office" },
  { key: "outdoor", label: "Outdoor" },
  { key: "decor", label: "Decor" },
  { key: "furnishings", label: "Furnishings" },
];

export const getCategoryProducts = (slug: string): Product[] => {
  const cat = SHOP_CATEGORIES.find((c) => c.slug === slug);
  return cat ? PRODUCTS.filter(cat.match) : [];
};

// Categories that live under /category/<slug> (the rest have their own Kurnool landing pages)
export const DYNAMIC_CATEGORIES = SHOP_CATEGORIES.filter((c) => c.href.startsWith("/category/"));
