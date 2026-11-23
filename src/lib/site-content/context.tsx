"use client";

import { createContext, useContext } from "react";

import { DEFAULT_SITE_CONTENT } from "@/lib/site-content/defaults";
import type { SiteContent } from "@/lib/site-content/schema";

const SiteContentContext = createContext<SiteContent>(DEFAULT_SITE_CONTENT);

export function SiteContentProvider({ value, children }: { value: SiteContent; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

/** Homepage content: admin edits merged over the defaults. Outside a provider it returns the defaults. */
export const useSiteContent = () => useContext(SiteContentContext);
