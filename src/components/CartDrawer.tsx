"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, CurrencyCode } from "@/types";
import { CURRENCIES, SHOWROOM_INFO, formatPriceINR, formatPriceWithCurrency, formatNumberDeterministic } from "@/data/products";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const curr = CURRENCIES[currency];
  const unitPrice = (item: CartItem) =>
    currency === "INR"
      ? item.product.priceINR || Math.round(item.product.priceUSD * 83.5)
      : Math.round(item.product.priceUSD * curr.rate);
  const total = items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  // Indian grouping for rupees (₹1,50,000), standard grouping for other currencies
  const money = (n: number) => (currency === "INR" ? formatPriceINR(n) : `${curr.symbol}${formatNumberDeterministic(n)}`);

  const sendEnquiry = () => {
    const list = items
      .map(
        (it, i) =>
          `${i + 1}. ${it.product.name} (${it.finish.name}) x ${it.quantity} = ${formatPriceWithCurrency(
            it.product.priceUSD * it.quantity,
            currency,
            (it.product.priceINR || Math.round(it.product.priceUSD * 83.5)) * it.quantity
          )}`
      )
      .join("\n");
    const msg = `Hello Mallikarjuna Furniture World Kurnool,\nI would like to enquire about these pieces:\n\n${list}\n\nTotal: ${money(total)}\n\nPlease confirm availability and delivery.`;
    window.open(`https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="cd-backdrop" onClick={onClose}>
      <aside className="cd-panel" role="dialog" aria-modal="true" aria-label="Enquiry list" onClick={(e) => e.stopPropagation()}>
        <header className="cd-head">
          <h3>
            Inquiry List <span>({count})</span>
          </h3>
          {items.length > 0 && (
            <button type="button" className="cd-clear" onClick={onClearCart}>
              Clear all
            </button>
          )}
          <button type="button" className="cd-close" onClick={onClose} aria-label="Close inquiry list">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cd-empty">
            <p>Your inquiry list is empty.</p>
            <Link href="/furniture" onClick={onClose} className="cd-btn cd-btn--outline">
              Browse Furniture
            </Link>
          </div>
        ) : (
          <>
            <ul className="cd-items">
              {items.map((item, index) => (
                <li key={`${item.product.id}-${item.finish.id}`} className="cd-item">
                  <Link href={`/product/${item.product.id}`} onClick={onClose} className="cd-img">
                    <Image src={item.product.primaryImage} alt={item.product.name} fill sizes="88px" style={{ objectFit: "cover" }} />
                  </Link>

                  <div className="cd-info">
                    <Link href={`/product/${item.product.id}`} onClick={onClose} className="cd-name">
                      {item.product.name}
                    </Link>
                    <span className="cd-finish">
                      <i style={{ backgroundColor: item.finish.colorHex }} />
                      {item.finish.name}
                    </span>
                    <div className="cd-row">
                      <div className="cd-qty" aria-label="Quantity">
                        <button type="button" onClick={() => onUpdateQuantity(index, item.quantity - 1)} aria-label="Decrease quantity">
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => onUpdateQuantity(index, item.quantity + 1)} aria-label="Increase quantity">
                          +
                        </button>
                      </div>
                      <strong suppressHydrationWarning>{money(unitPrice(item) * item.quantity)}</strong>
                    </div>
                  </div>

                  <button type="button" className="cd-remove" onClick={() => onRemoveItem(index)} aria-label={`Remove ${item.product.name}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <footer className="cd-foot">
              <div className="cd-total">
                <span>Total</span>
                <strong suppressHydrationWarning>{money(total)}</strong>
              </div>
              <button type="button" className="cd-btn cd-btn--whatsapp" onClick={sendEnquiry}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Send Inquiry
              </button>
              <button type="button" className="cd-btn cd-btn--outline" onClick={onClose}>
                Continue Shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
};
