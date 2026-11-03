"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CurrencyCode, Product } from "@/types";
import { PRODUCTS, formatPriceWithCurrency, SHOWROOM_INFO } from "@/data/products";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  currency: CurrencyCode;
  onSelectProduct: (p: Product) => void;
  onRemoveWishlist: (p: Product) => void;
  onMoveToCart: (p: Product) => void;
}

const WA_ICON =
  "M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z";

const openWhatsApp = (msg: string) =>
  window.open(`https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");

// Same look as the Inquiry List drawer (cd-* styles)
export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  currency,
  onRemoveWishlist,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  const products = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const price = (p: Product) => formatPriceWithCurrency(p.priceUSD, currency, p.priceINR);

  const enquireAll = () =>
    openWhatsApp(
      `Hello ${SHOWROOM_INFO.brandName},\nI'd like details on these pieces:\n\n${products
        .map((p, i) => `${i + 1}. ${p.name} (${price(p)})`)
        .join("\n")}\n\nPlease share availability and prices.`
    );

  return (
    <div className="cd-backdrop" onClick={onClose}>
      <aside className="cd-panel" role="dialog" aria-modal="true" aria-label="Shortlist" onClick={(e) => e.stopPropagation()}>
        <header className="cd-head">
          <h3>
            Shortlist <span>({products.length})</span>
          </h3>
          <button type="button" className="cd-close" onClick={onClose} aria-label="Close shortlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {products.length === 0 ? (
          <div className="cd-empty">
            <p>Your shortlist is empty. Tap the heart on any product to save it here.</p>
            <Link href="/furniture" onClick={onClose} className="cd-btn cd-btn--outline">
              Browse Furniture
            </Link>
          </div>
        ) : (
          <>
            <ul className="cd-items">
              {products.map((p) => (
                <li key={p.id} className="cd-item">
                  <Link href={`/product/${p.id}`} onClick={onClose} className="cd-img">
                    <Image src={p.primaryImage} alt={p.name} fill sizes="88px" style={{ objectFit: "cover" }} />
                  </Link>

                  <div className="cd-info">
                    <Link href={`/product/${p.id}`} onClick={onClose} className="cd-name">
                      {p.name}
                    </Link>
                    <strong className="wl-price" suppressHydrationWarning>
                      {price(p)}
                    </strong>
                    <div className="wl-actions">
                      <button
                        type="button"
                        className="card-action card-action--wa"
                        onClick={() => openWhatsApp(`Hello ${SHOWROOM_INFO.brandName},\nI'm interested in: ${p.name} (${price(p)}).\nPlease share availability.`)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d={WA_ICON} />
                        </svg>
                        <span>Inquiry</span>
                      </button>
                      <button type="button" className="card-action card-action--add" onClick={() => onMoveToCart(p)}>
                        <span>Add to List</span>
                      </button>
                    </div>
                  </div>

                  <button type="button" className="cd-remove" onClick={() => onRemoveWishlist(p)} aria-label={`Remove ${p.name}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <footer className="cd-foot">
              <button type="button" className="cd-btn cd-btn--whatsapp" onClick={enquireAll}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={WA_ICON} />
                </svg>
                Send Inquiry
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
};
