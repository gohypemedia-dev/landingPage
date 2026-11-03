"use client";

import { useRouter } from "next/navigation";
import { CurrencyCode, Product, ProductFinish } from "@/types";
import { AudoCardItem, AudoProductStage } from "@/components/AudoProductStage";

// No-cost EMI is offered over 6 months on purchases above ₹5,000 (see DealBanner)
export const emiPerMonth = (p: Product) => Math.round((p.priceINR ?? p.priceUSD * 83.5) / 6);

// Same card as the homepage product rows; clicking opens the full product page
export const ProductTile: React.FC<{
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart?: (p: Product, f: ProductFinish) => void;
}> = ({ product, currency, isWishlisted, onToggleWishlist, onAddToCart }) => {
  const router = useRouter();
  return (
    <AudoCardItem
      product={product}
      currency={currency}
      isWishlisted={isWishlisted}
      onToggleWishlist={onToggleWishlist}
      onQuickView={(p) => router.push(`/product/${p.id}`)}
      onAddToCart={onAddToCart}
      showDivider={false}
    />
  );
};

// Same sliding row as the homepage (title, side arrows, swipe, Shop All)
export const ProductRow: React.FC<{
  title: string;
  products: Product[];
  currency: CurrencyCode;
  wishlistIds: string[];
  onToggleWishlist: (p: Product) => void;
  onAddToCart?: (p: Product, f: ProductFinish) => void;
}> = ({ title, products, currency, wishlistIds, onToggleWishlist, onAddToCart }) => {
  const router = useRouter();
  if (products.length === 0) return null;
  return (
    <AudoProductStage
      title={title}
      products={products}
      currency={currency}
      wishlistIds={wishlistIds}
      onToggleWishlist={onToggleWishlist}
      onQuickView={(p) => router.push(`/product/${p.id}`)}
      onAddToCart={onAddToCart}
    />
  );
};
