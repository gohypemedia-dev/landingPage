"use client";

import { createContext, useContext } from "react";

import { DEFAULT_CATALOG } from "@/lib/catalog/defaults";
import type { Catalog } from "@/lib/catalog/schema";

const CatalogContext = createContext<Catalog>(DEFAULT_CATALOG);

export function CatalogProvider({ value, children }: { value: Catalog; children: React.ReactNode }) {
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

/** Products and categories from Admin → Products / Categories (the built-in catalog outside a provider). */
export const useCatalog = () => useContext(CatalogContext);
