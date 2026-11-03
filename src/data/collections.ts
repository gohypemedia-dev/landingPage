import { Product } from "@/types";
import { PRODUCTS } from "@/data/products";

export type CollectionKey = "new" | "bestsellers" | "exclusive" | "international";

// Curated groups that mix categories. Each has a homepage row and its own page at /collections/<slug>.
export const COLLECTIONS: {
  key: CollectionKey;
  slug: string;
  title: string;
  hero: string;
  intro: string;
}[] = [
  {
    key: "new",
    slug: "new-designs",
    title: "New Designs",
    hero: "/images/mf-signature-curved-living.jpg",
    intro: "The latest sofas, recliners, beds, dining sets and decor to arrive at our Kurnool showroom.",
  },
  {
    key: "bestsellers",
    slug: "best-sellers",
    title: "Best Sellers",
    hero: "/images/mf-living-suite-311.jpg",
    intro: "The pieces our customers in Kurnool and across Rayalaseema choose most often.",
  },
  {
    key: "exclusive",
    slug: "online-exclusive",
    title: "Online Exclusive",
    hero: "/images/mf-fluted-luxury-lounge.jpg",
    intro: "Designs picked for online enquiries, with the same showroom service and delivery.",
  },
  {
    key: "international",
    slug: "international-collection",
    title: "International Collection",
    hero: "/images/mf-showroom-warehouse.jpg",
    intro: "Pieces designed abroad or made with imported materials such as Italian marble, German mechanisms and Belgian linen.",
  },
];

// International Collection: designed abroad or built with imported materials. Add or remove product ids here.
const INTERNATIONAL_IDS = [
  "eave-modular-sofa",
  "echasse-smoked-vase",
  "hashira-ambient-column-lamp",
  "italian-marble-dining-table",
  "cloudcomfort-motorized-recliner",
  "bespoke-motorized-curtains",
];

// Showcase pieces lead the "New Designs" collection
const STAGE_IDS = ["eave-modular-sofa", "echasse-smoked-vase", "hashira-ambient-column-lamp"];

export const getCollectionProducts = (key: CollectionKey): Product[] => {
  const stage = STAGE_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is Product => !!p);
  const rest = PRODUCTS.filter((p) => !STAGE_IDS.includes(p.id));
  if (key === "international") return INTERNATIONAL_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is Product => !!p);
  if (key === "bestsellers") return [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount);
  if (key === "exclusive") return [...PRODUCTS].sort((a, b) => (a.priceINR ?? a.priceUSD) - (b.priceINR ?? b.priceUSD)).slice(0, 8);
  return [...stage, ...rest.sort((a, b) => b.year - a.year)];
};

export const collectionHref = (key: CollectionKey) => `/collections/${COLLECTIONS.find((c) => c.key === key)!.slug}`;
