export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD (1.0 = USD, 83.5 = INR)
}

export interface ProductFinish {
  id: string;
  name: string;
  colorHex: string;
  image?: string;
}

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ExpandableSpecSection {
  title: string;
  content: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: "sofas" | "recliners" | "beds" | "dining" | "curtains" | "furniture" | "lighting" | "objects";
  /** Slugs of the shop categories this product is listed under (set by the catalog). */
  categories?: string[];
  priceUSD: number;
  priceINR?: number;
  priceOnEnquiry?: boolean;
  designer: string;
  year: number;
  description: string;
  details: string[];
  dimensions: string;
  materials: string;
  primaryImage: string;
  hoverImage?: string;
  tag?: string;
  badge?: string;
  warranty?: string;
  availability?: string;
  configurations?: string[];
  colors?: ProductColorOption[];
  budgetRanges?: string[];
  galleryImages?: string[];
  expandableSections?: ExpandableSpecSection[];
  finishes: ProductFinish[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  finish: ProductFinish;
  quantity: number;
}

export interface Hotspot {
  id: string;
  xPercent: number; // percentage from left
  yPercent: number; // percentage from top
  productId: string;
  title: string;
  category: string;
  priceUSD: number;
}

export interface LookbookRoom {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  hotspots: Hotspot[];
}

export interface MaterialSpotlight {
  id: string;
  name: string;
  origin: string;
  tagline: string;
  description: string;
  tactileCharacteristics: string[];
  accentColor: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
}

export interface PressQuote {
  publication: string;
  quote: string;
  authorOrIssue: string;
}
