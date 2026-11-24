"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { sectionHome } from "@/lib/site-content/schema";

const LINKS = [
  { href: "/admin", label: "Homepage sections", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/offers", label: "Offers & sales" },
  { href: "/admin/content/inquiryPopup", label: "Inquiry popup" },
  { href: "/admin/media", label: "Media library" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export function AdminNav({
  user,
  newEnquiries,
  loginSkipped,
}: {
  user: { name: string; email: string };
  newEnquiries: number;
  loginSkipped: boolean;
}) {
  const pathname = usePathname();

  // A section editor (/admin/content/<key>) highlights the menu item it is managed from.
  const section = pathname.match(/^\/admin\/content\/([^/]+)/)?.[1];
  const current = section ? sectionHome(section).href : pathname;
  const isActive = (href: string, exact?: boolean) => (exact ? current === href : current.startsWith(href));

  return (
    <aside className="adm-sidebar">
      <Link href="/admin" className="adm-brand">
        <Image
          src="/images/mallikarjuna-logo-light.png"
          alt="Mallikarjuna Furniture World"
          width={1384}
          height={359}
          sizes="200px"
          className="adm-brand-logo"
          priority
        />
        <small>Website admin</small>
      </Link>

      <nav aria-label="Admin">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={isActive(l.href, l.exact) ? "is-active" : ""}>
            {l.label}
            {l.href === "/admin/enquiries" && newEnquiries > 0 && <span className="adm-badge">{newEnquiries}</span>}
          </Link>
        ))}
        <a href="/" target="_blank" rel="noreferrer">
          View website ↗
        </a>
      </nav>

      <div className="adm-user">
        <strong>{user.name}</strong>
        <small>{user.email}</small>
        {loginSkipped ? (
          <span className="adm-dev-note" title="ADMIN_SKIP_LOGIN=true in .env (ignored in production)">
            Login is off (development)
          </span>
        ) : (
          <button
            type="button"
            className="adm-btn adm-btn--small adm-btn--ghost"
            onClick={async () => {
              await authClient.signOut();
              // Full page load so no signed-in admin pages stay in the browser's router cache.
              window.location.replace("/admin/login");
            }}
          >
            Sign out
          </button>
        )}
      </div>
    </aside>
  );
}
