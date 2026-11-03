"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CurrencyCode } from "@/types";
import { getCollectionProducts } from "@/data/collections";
import { ROOMS, SHOP_CATEGORIES, getCategoryProducts } from "@/data/categories";
import { SHOWROOM_INFO, formatPriceINR, getWhatsAppEnquiryUrl, getShowroomBookingWhatsAppUrl } from "@/data/products";
import { BrandLogo } from "@/components/BrandLogo";

interface HeaderProps {
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  cartCount?: number;
  wishlistCount: number;
  onOpenCart?: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock page scroll and allow Escape to close while the mobile menu is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest(".nav-dropdown-wrap")) setOpenMenu(null);
    };
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const designs = (n: number) => (n ? `${n} ${n === 1 ? "Design" : "Designs"}` : "Enquire");

  // Same categories as the Popular Categories circles; counts come from the live product list
  const shopCategories = SHOP_CATEGORIES.map((c) => ({
    label: c.label,
    href: c.href,
    image: c.image,
    room: c.room,
    count: designs(getCategoryProducts(c.slug).length),
  }));

  // International Collection dropdown previews its pieces, then links to the full collection
  const internationalHref = "/collections/international-collection";
  const internationalItems = [
    ...getCollectionProducts("international").map((p) => ({
      label: p.name,
      href: `/product/${p.id}`,
      image: p.primaryImage,
      count: formatPriceINR(p.priceINR ?? p.priceUSD * 83.5),
    })),
    { label: "View All International", href: internationalHref, image: "/images/mf-showroom-warehouse.jpg", count: "See the collection" },
  ];

  // Category row: International Collection, one item per room (dropdown when a room has several categories), New Arrivals.
  // Hover opens on desktop; a click/tap also opens (touch screens). Clicking outside or Escape closes.
  const navMenus = [
    { key: "international", label: "International", items: internationalItems, href: undefined as string | undefined },
    ...ROOMS.map((r) => {
      const items = shopCategories.filter((c) => c.room === r.key);
      return { key: r.key as string, label: r.label, items, href: items.length === 1 ? items[0].href : undefined };
    }),
    { key: "new-arrivals", label: "New Arrivals", items: [], href: "/furniture" },
  ];

  // Underline the menu for the page you're on (a dropdown counts when any of its links matches)
  const isActive = (menu: (typeof navMenus)[number]) =>
    menu.href ? pathname === menu.href : menu.items.some((i) => i.href === pathname);

  return (
    <>
      {/* 
        COMPACT LUXURY NAVBAR - Section 2 of Brief:
        Left: Circular CB medallion + CASABLANCA SOFAS
        Center: HOME · SHOP · COLLECTIONS · OUR SHOWROOM · OFFERS · CONTACT
        Right: Search Icon · Shortlist Bookmark Icon · Visible WhatsApp Enquiry Button
      */}
      <header
        id="main-navigation"
        className={`main-header ${isScrolled ? "is-scrolled" : ""} ${mobileMenuOpen ? "menu-open" : ""}`}
      >
        <div className="header-inner">
          {/* LEFT: brand logo */}
          <div className="header-brand-wrap">
            <Link
              href="/"
              aria-label="Casablanca Sofas - Home"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              <BrandLogo size="lg" isScrolled={isScrolled} />
            </Link>
          </div>

          {/* CENTER: shop by category */}
          <nav aria-label="Shop by category" className="desktop-nav-links nav-cats">
            {navMenus.map((menu) =>
              menu.href ? (
                <Link key={menu.key} href={menu.href} className={`nav-link${isActive(menu) ? " is-current" : ""}`} aria-current={isActive(menu) ? "page" : undefined}>
                  {menu.label}
                </Link>
              ) : (
                <div
                  key={menu.key}
                  className="nav-dropdown-wrap"
                  onMouseEnter={() => setOpenMenu(menu.key)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    className={`nav-link${isActive(menu) ? " is-current" : ""}`}
                    aria-expanded={openMenu === menu.key}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(menu.key)}
                  >
                    <span>{menu.label}</span>
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      style={{
                        transition: "transform 0.2s ease",
                        transform: openMenu === menu.key ? "rotate(180deg)" : "rotate(0deg)",
                        marginLeft: "0.4rem",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {openMenu === menu.key && (
                    <div className="nav-dropdown-panel">
                      <div className="nav-mega">
                        {menu.items.map((item) => (
                          <Link key={item.href} href={item.href} className="nav-mega-item" onClick={() => setOpenMenu(null)}>
                            <span className="nav-mega-text">
                              <strong>{item.label}</strong>
                              <small>{item.count}</small>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </nav>

          {/* RIGHT: search + inquiry list icons */}
          <div className="nav-right-group">
            <div className="header-actions">
              <button type="button" onClick={onOpenSearch} aria-label="Search collection" className="nav-link nav-action">
                Search
              </button>

              <button type="button" onClick={onOpenCart} aria-label="Open inquiry list" className="nav-link nav-action">
                Inquiry List (<span suppressHydrationWarning>{cartCount}</span>)
              </button>


              {/* Mobile Quick Action Buttons (Search & Wishlist Icons) */}
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search collection"
                className="mobile-action-icon"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              <button type="button" onClick={onOpenWishlist} aria-label="Open shortlist" className="mobile-action-icon" style={{ position: "relative" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistCount > 0 && (
                  <span suppressHydrationWarning className="nav-count-badge">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenCart}
                aria-label="Open inquiry list"
                className="mobile-action-icon"
                style={{ position: "relative" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span
                    suppressHydrationWarning
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      background: "var(--color-gold)",
                      color: "#102B46",
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                id="mobile-nav-toggle"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                className="mobile-hamburger"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="7" x2="21" y2="7"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="17" x2="21" y2="17"></line>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div id="mobile-navigation-drawer" className="mnav" data-lenis-prevent>
            {/* Same structure as the desktop menu: rooms with several categories expand in place */}
            <nav aria-label="Mobile navigation" className="mnav-list">
              {navMenus.map((menu) =>
                menu.href ? (
                  <Link key={menu.key} href={menu.href} onClick={closeMobileMenu} className={`mnav-row${isActive(menu) ? " is-current" : ""}`}>
                    <span>{menu.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ) : (
                  <div key={menu.key} className={`mnav-group${mobileOpen === menu.key ? " is-open" : ""}`}>
                    <button
                      type="button"
                      className={`mnav-row${isActive(menu) ? " is-current" : ""}`}
                      aria-expanded={mobileOpen === menu.key}
                      onClick={() => setMobileOpen((k) => (k === menu.key ? null : menu.key))}
                    >
                      <span>{menu.label}</span>
                      <svg className="mnav-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="mnav-sub">
                      <div className="mnav-sub-inner">
                        {menu.items.map((item) => (
                          <Link key={item.href} href={item.href} onClick={closeMobileMenu} className="mnav-subitem">
                            <span className="mnav-subimg">
                              <Image src={item.image} alt="" fill sizes="44px" style={{ objectFit: "cover" }} />
                            </span>
                            <span className="mnav-sublabel">{item.label}</span>
                            <small>{item.count}</small>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </nav>

            {/* Showroom card */}
            <div className="mnav-showroom">
              <div className="mnav-showroom-head">
                <span className="mnav-showroom-dot" aria-hidden="true" />
                <span className="mnav-eyebrow mnav-eyebrow-light">Visit Our Showroom</span>
              </div>
              <p className="mnav-showroom-address">{SHOWROOM_INFO.landmark}, Kurnool</p>
              <p className="mnav-showroom-time">{SHOWROOM_INFO.timing}</p>
              <div className="mnav-showroom-links">
                <a href={SHOWROOM_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  Get Directions
                </a>
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    setContactModalOpen(true);
                  }}
                >
                  Contact &amp; Timings
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mnav-actions">
              <a
                href={getWhatsAppEnquiryUrl("Mobile Menu Direct Enquiry")}
                target="_blank"
                rel="noopener noreferrer"
                className="mnav-btn mnav-btn-whatsapp"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
              </a>
              <a href={`tel:${SHOWROOM_INFO.phone}`} className="mnav-btn mnav-btn-call">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Call Now</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* CONTACT / SHOWROOM DETAILS MODAL */}
      {contactModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(16, 43, 70, 0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            animation: "fadeIn 0.25s ease",
          }}
          onClick={() => setContactModalOpen(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "8px",
              padding: "2.5rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setContactModalOpen(false)}
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                fontSize: "1.25rem",
                cursor: "pointer",
                color: "var(--color-navy)",
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(16, 43, 70, 0.06)",
                  border: "1px solid var(--color-gold)",
                  color: "var(--color-gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                📍
              </div>

              <span
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                CASABLANCA SOFAS
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.65rem",
                  color: "var(--color-navy)",
                  marginBottom: "0.5rem",
                }}
              >
                Contact & Showroom Visit
              </h3>

              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
                {SHOWROOM_INFO.address}
              </p>
              <div style={{ fontSize: "0.8125rem", color: "var(--color-gold)", fontWeight: 600, marginTop: "0.4rem" }}>
                🕒 {SHOWROOM_INFO.timing}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href={getWhatsAppEnquiryUrl("Contact Modal Inquiry")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ width: "100%", padding: "0.85rem", justifyContent: "center", borderRadius: "6px" }}
              >
                <span>CHAT ON WHATSAPP: {SHOWROOM_INFO.displayWhatsApp}</span>
              </a>

              <a
                href={`tel:${SHOWROOM_INFO.phone}`}
                className="btn-secondary"
                style={{ width: "100%", padding: "0.85rem", justifyContent: "center", borderRadius: "6px" }}
              >
                <span>CALL SHOWROOM: {SHOWROOM_INFO.displayPhone}</span>
              </a>

              <a
                href={SHOWROOM_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ width: "100%", padding: "0.85rem", justifyContent: "center", borderRadius: "6px", fontSize: "0.75rem" }}
              >
                <span>GET GOOGLE MAP DIRECTIONS</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles handled globally in globals.css */}
    </>
  );
};
