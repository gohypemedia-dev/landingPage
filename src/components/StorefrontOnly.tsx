"use client";

import { usePathname } from "next/navigation";

/** Renders its children everywhere except the admin panel. */
export function StorefrontOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? null : <>{children}</>;
}
