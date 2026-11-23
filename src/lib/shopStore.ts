"use client";

import { useSyncExternalStore } from "react";
import { CartItem, Product, ProductFinish } from "@/types";
import { useCatalog } from "@/lib/catalog/context";

// Shortlist + inquiry list shared by every page and saved in the browser (localStorage),
// so hearts and added items carry over between pages and visits.

interface Saved {
  wishlist: string[];
  items: { productId: string; finishId: string; quantity: number }[];
}

const KEY = "casa-shop-v1";
const EMPTY: Saved = { wishlist: [], items: [] };

let state: Saved = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const load = () => {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    // Storage blocked (private mode etc.): lists simply don't persist
  }
};

const save = (next: Saved) => {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  load();
  listeners.add(l);
  // Keep tabs in sync
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    l();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
};

const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => EMPTY;

export const shopActions = {
  toggleWishlist(p: Product): boolean {
    const has = state.wishlist.includes(p.id);
    save({ ...state, wishlist: has ? state.wishlist.filter((id) => id !== p.id) : [...state.wishlist, p.id] });
    return !has;
  },
  addItem(p: Product, f: ProductFinish, qty = 1) {
    const i = state.items.findIndex((it) => it.productId === p.id && it.finishId === f.id);
    const items =
      i > -1
        ? state.items.map((it, idx) => (idx === i ? { ...it, quantity: it.quantity + qty } : it))
        : [...state.items, { productId: p.id, finishId: f.id, quantity: qty }];
    save({ ...state, items });
  },
  updateQuantity(index: number, quantity: number) {
    const items = quantity <= 0 ? state.items.filter((_, i) => i !== index) : state.items.map((it, i) => (i === index ? { ...it, quantity } : it));
    save({ ...state, items });
  },
  removeItem(index: number) {
    save({ ...state, items: state.items.filter((_, i) => i !== index) });
  },
  clearItems() {
    save({ ...state, items: [] });
  },
};

// Cache resolved CartItems per saved snapshot (and product list) so React gets a stable array
let lastItemsRef: Saved["items"] | null = null;
let lastProductsRef: Product[] | null = null;
let lastResolved: CartItem[] = [];
const resolveItems = (items: Saved["items"], PRODUCTS: Product[]): CartItem[] => {
  if (items === lastItemsRef && PRODUCTS === lastProductsRef) return lastResolved;
  lastItemsRef = items;
  lastProductsRef = PRODUCTS;
  lastResolved = items.flatMap((it) => {
    const product = PRODUCTS.find((p) => p.id === it.productId);
    if (!product) return [];
    const finish = product.finishes.find((f) => f.id === it.finishId) ?? product.finishes[0];
    return [{ product, finish, quantity: it.quantity }];
  });
  return lastResolved;
};

export const useShopStore = () => {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { products } = useCatalog();
  return { wishlistIds: s.wishlist, items: resolveItems(s.items, products) };
};
