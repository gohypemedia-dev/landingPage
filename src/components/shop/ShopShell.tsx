"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CurrencyCode, Product, ProductFinish } from "@/types";
import { shopActions, useShopStore } from "@/lib/shopStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { SearchModal } from "@/components/SearchModal";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Toast } from "@/components/Toast";

export interface ShopContext {
  currency: CurrencyCode;
  wishlistIds: string[];
  toggleWishlist: (p: Product) => void;
  addToEnquiry: (p: Product, f: ProductFinish, qty?: number) => void;
}

// Shared chrome for category and product pages: header, footer, drawers, toast,
// plus wishlist / enquiry-list state handed to the page through a render prop.
export const ShopShell: React.FC<{ children: (shop: ShopContext) => React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const { wishlistIds, items } = useShopStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const openProduct = (p: Product) => router.push(`/product/${p.id}`);

  const toggleWishlist = (p: Product) => {
    const added = shopActions.toggleWishlist(p);
    showToast(added ? `Shortlisted ${p.name}` : `Removed ${p.name} from shortlist`);
  };

  const addToEnquiry = (p: Product, f: ProductFinish, qty = 1) => {
    shopActions.addItem(p, f, qty);
    showToast(`Added ${p.name} to inquiry list`);
    setIsCartOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-canvas)" }}>
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        cartCount={items.reduce((sum, it) => sum + it.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main style={{ flex: 1 }}>{children({ currency, wishlistIds, toggleWishlist, addToEnquiry })}</main>

      <Footer />
      <FloatingWhatsApp />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        currency={currency}
        onUpdateQuantity={(index, quantity) => shopActions.updateQuantity(index, quantity)}
        onRemoveItem={(index) => shopActions.removeItem(index)}
        onClearCart={() => shopActions.clearItems()}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        currency={currency}
        onSelectProduct={openProduct}
        onRemoveWishlist={toggleWishlist}
        onMoveToCart={(p) => {
          setIsWishlistOpen(false);
          addToEnquiry(p, p.finishes[0]);
        }}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} currency={currency} onSelectProduct={openProduct} />
      <Toast message={toast} />
    </div>
  );
};
