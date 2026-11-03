"use client";

import Link from "next/link";
import { ShopShell } from "@/components/shop/ShopShell";

// Shared layout for Contact and policy pages: site header/footer, breadcrumb, title and readable body text
export const InfoPage: React.FC<{ title: string; updated?: string; children: React.ReactNode }> = ({ title, updated, children }) => (
  <ShopShell>
    {() => (
      <>
        <nav aria-label="Breadcrumb" className="shop-crumbs">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
        <article className="ip">
          <h1>{title}</h1>
          {updated && <p className="ip-updated">Last updated: {updated}</p>}
          {children}
        </article>
      </>
    )}
  </ShopShell>
);
