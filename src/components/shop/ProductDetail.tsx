"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CurrencyCode, Product } from "@/types";
import { CATEGORIES_LIST, PRODUCTS, REVIEWS, formatPriceINR, formatPriceWithCurrency, getWhatsAppEnquiryUrl } from "@/data/products";
import { ShopShell } from "@/components/shop/ShopShell";
import { TRUST_BADGES } from "@/components/DealBanner";
import { SAMPLE_REVIEWS } from "@/data/sampleReviews";
import { ProductRow, emiPerMonth } from "@/components/shop/ProductTile";

const CATEGORY_PAGES: Record<string, { label: string; href: string }> = {
  sofas: { label: "Sofas", href: "/sofas-kurnool" },
  recliners: { label: "Recliners", href: "/recliners-kurnool" },
  beds: { label: "Beds & Cots", href: "/beds-cots-kurnool" },
  dining: { label: "Dining", href: "/dining-tables-kurnool" },
  curtains: { label: "Curtains & Blinds", href: "/curtains-blinds-kurnool" },
};

// Close-up focus points for feature thumbnails when no dedicated feature photo exists
const FEATURE_FOCUS = ["35% 30%", "30% 75%", "68% 35%", "65% 78%"];

const TABS = ["Description", "Product Features", "More Information", "Ratings & Reviews"] as const;
type Tab = (typeof TABS)[number];

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <span className="pd-stars" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(value) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
        <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
      </svg>
    ))}
  </span>
);

export const ProductDetail: React.FC<{ product: Product; extraImages?: string[]; featureImages?: string[] }> = ({
  product,
  extraImages = [],
  featureImages = [],
}) => (
  <ShopShell>
    {(shop) => <ProductDetailBody key={product.id} product={product} extraImages={extraImages} featureImages={featureImages} {...shop} />}
  </ShopShell>
);

const ProductDetailBody: React.FC<{
  product: Product;
  extraImages: string[];
  featureImages: string[];
  currency: CurrencyCode;
  wishlistIds: string[];
  toggleWishlist: (p: Product) => void;
  addToEnquiry: (p: Product, f: Product["finishes"][number], qty?: number) => void;
}> = ({ product, extraImages, featureImages, currency, wishlistIds, toggleWishlist, addToEnquiry }) => {
  const gallery = useMemo(
    () =>
      Array.from(
        new Set(
          [product.primaryImage, product.hoverImage, ...(product.galleryImages ?? []), ...extraImages, ...product.finishes.map((f) => f.image)].filter(
            (src): src is string => !!src
          )
        )
      ),
    [product, extraImages]
  );

  const [imageIndex, setImageIndex] = useState(0);
  const [finish, setFinish] = useState(product.finishes[0]);
  const [config, setConfig] = useState(product.configurations?.[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("Description");
  const [copied, setCopied] = useState(false);

  const category = CATEGORY_PAGES[product.category];
  const categoryLabel = CATEGORIES_LIST.find((c) => c.id === product.category)?.title ?? category?.label;
  const price = formatPriceWithCurrency(product.priceUSD, currency, product.priceINR);
  const isWishlisted = wishlistIds.includes(product.id);
  const reviews = [
    ...REVIEWS.filter((r) => r.productName.toLowerCase().includes(product.name.split(" ")[0].toLowerCase())),
    // Placeholder reviews — see src/data/sampleReviews.ts
    ...(SAMPLE_REVIEWS[product.id] ?? []),
  ];

  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
  const moreToExplore = related.length >= 2 ? related : PRODUCTS.filter((p) => p.id !== product.id && p.featured);

  const whatsappUrl = getWhatsAppEnquiryUrl(
    `${product.name} × ${qty}`,
    config,
    finish.name,
    product.priceOnEnquiry ? undefined : price
  );

  // Clean product URL (no hash / query) for sharing
  const shareUrl = () => `${window.location.origin}/product/${product.id}`;
  const shareText = `${product.name} at Mallikarjuna Furniture World, Kurnool`;

  const share = (net: "whatsapp" | "facebook" | "x" | "email") => {
    const url = encodeURIComponent(shareUrl());
    const text = encodeURIComponent(shareText);
    const links = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      email: `mailto:?subject=${text}&body=${encodeURIComponent(`${product.subtitle}

`)}${url}`,
    };
    window.open(links[net], "_blank", "noopener,noreferrer");
  };

  // Phones get the native share sheet (WhatsApp, Instagram, Messages...); desktops fall back to copying the link
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: shareText, url: shareUrl() });
      } catch {
        // User closed the share sheet
      }
    } else {
      copyLink();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; nothing else to do
    }
  };

  const specs: [string, string | undefined][] = [
    ["Dimensions", product.dimensions],
    ["Materials", product.materials],
    ["Configurations", product.configurations?.join(", ")],
    ["Colours", (product.colors?.map((c) => c.name) ?? product.finishes.map((f) => f.name)).join(", ")],
    ["Warranty", product.warranty],
    ["Availability", product.availability],
    ["Collection", product.designer],
  ];


  return (
    <>
      <nav aria-label="Breadcrumb" className="shop-crumbs">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        {category && (
          <>
            <Link href={category.href}>{categoryLabel}</Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span>{product.name}</span>
      </nav>

      {/* Gallery + buy box */}
      <section className="pd-top">
        <div className="pd-gallery">
          {/* Thumbnails + main photo; the thumbnail rail sticks within this block only */}
          <div className="pd-media">
            {gallery.length > 1 && (
              <div className="pd-thumbs">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={i === imageIndex ? "is-active" : undefined}
                    onClick={() => setImageIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <Image src={src} alt="" fill sizes="80px" style={{ objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
            <div className="pd-main">
              <Image src={gallery[imageIndex]} alt={product.name} fill priority sizes="(max-width: 1060px) 100vw, 55vw" style={{ objectFit: "cover" }} />
              {product.tag && <span className="pt-tag">{product.tag}</span>}
              <button
                type="button"
                className={`pt-heart${isWishlisted ? " is-on" : ""}`}
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? "Remove from shortlist" : "Save to shortlist"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button type="button" className="pt-heart pd-share-fab" onClick={nativeShare} aria-label="Share this product" title={copied ? "Link copied" : "Share"}>
                {copied ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
                  </svg>
                )}
              </button>
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="audo-side-arrow audo-side-arrow--prev pd-arrow"
                    onClick={() => setImageIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                    aria-label="Previous image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="audo-side-arrow audo-side-arrow--next pd-arrow"
                    onClick={() => setImageIndex((i) => (i + 1) % gallery.length)}
                    aria-label="Next image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          <ul className="pd-trust">
            {TRUST_BADGES.map((t) => (
              <li key={t.label}>
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {t.icon}
                </svg>
                <span className="deal-trust-full">{t.label}</span>
                <span className="deal-trust-short">{t.short}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pd-info">
          <h1>{product.name}</h1>
          <div className="pd-rating">
            <Stars value={product.rating} />
            <span>
              {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </div>

          <div className="pd-price" suppressHydrationWarning>
            {product.priceOnEnquiry && <small>Starting from</small>}
            <strong>{price}</strong>
            <span>Inclusive of all taxes</span>
          </div>
          {currency === "INR" && (
            <p className="pd-emi">
              No Cost EMI from <b>{formatPriceINR(emiPerMonth(product))}/month</b> for 6 months
            </p>
          )}

          <div className="pd-offers">
            <p>
              <b>Use code CASA500</b> for ₹500 off on orders of ₹25,000 and above
            </p>
            <p>
              <b>2% Cashback</b> on UPI payments
            </p>
          </div>

          <div className="pd-option">
            <span className="pd-label">
              Finish: <b>{finish.name}</b>
            </span>
            <div className="pd-swatches">
              {product.finishes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={f.id === finish.id ? "is-active" : undefined}
                  style={{ backgroundColor: f.colorHex }}
                  onClick={() => {
                    setFinish(f);
                    if (f.image) setImageIndex(Math.max(0, gallery.indexOf(f.image)));
                  }}
                  aria-label={f.name}
                  title={f.name}
                />
              ))}
            </div>
          </div>

          {product.configurations && product.configurations.length > 0 && (
            <div className="pd-option">
              <span className="pd-label">Size / Configuration</span>
              <div className="pd-chips">
                {product.configurations.map((c) => (
                  <button key={c} type="button" className={c === config ? "is-active" : undefined} onClick={() => setConfig(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-actions">
            <div className="pd-qty" aria-label="Quantity">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button type="button" className="pd-btn pd-btn--outline" onClick={() => addToEnquiry(product, finish, qty)}>
              Add to Inquiry List
            </button>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="pd-btn pd-btn--solid">
              Send Inquiry
            </a>
          </div>

          <div className="pd-share">
            <span>Share:</span>
            <button type="button" onClick={() => share("whatsapp")} aria-label="Share on WhatsApp" title="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </button>
            <button type="button" onClick={() => share("facebook")} aria-label="Share on Facebook" title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 8h3V4h-3c-2.8 0-4.5 1.9-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.9c0-.6.4-.9 1-.9Z" />
              </svg>
            </button>
            <button type="button" onClick={() => share("x")} aria-label="Share on X" title="X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18.2h1.7L6.3 3.7H4.5l13.3 16.5Z" />
              </svg>
            </button>
            <button type="button" onClick={() => share("email")} aria-label="Share by email" title="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </button>
            <button type="button" onClick={copyLink} aria-label="Copy product link" title="Copy link" className="pd-share-copy">
              {copied ? "Link copied ✓" : "Copy link"}
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="pd-tabs shop-pad">
        <div className="pd-tabs-card">
        <div className="pd-tablist" role="tablist">
          {TABS.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? "is-active" : undefined} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        {/* All panels share one grid cell, so the card keeps the tallest panel's height and the page never jumps */}
        <div className="pd-panels">
          {TABS.map((t) => (
            <div key={t} className={`pd-panel${tab === t ? " is-active" : ""}`} role="tabpanel" aria-hidden={tab !== t} inert={tab !== t}>
              {t === "Description" && (
                <>
                  <p>{product.description}</p>
                  {product.expandableSections?.map((s) => (
                    <div key={s.title}>
                      <h3>{s.title}</h3>
                      <p>{s.content}</p>
                    </div>
                  ))}
                </>
              )}
              {t === "Product Features" && (
                <ul className="pd-features">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
              {t === "More Information" && (
                <dl className="pd-specs">
                  {specs
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                </dl>
              )}
              {t === "Ratings & Reviews" && (
                <div className="pd-reviews">
                  <div className="pd-review-score">
                    <strong>{product.rating.toFixed(1)}</strong>
                    <Stars value={product.rating} />
                    <span>{product.reviewCount} verified reviews</span>
                  </div>
                  {reviews.length > 0 ? (
                    reviews.map((r) => (
                      <article key={r.id} className="pd-review-card">
                        <strong>{r.author}</strong>
                        <div className="pd-review-meta">
                          <span>Quality</span>
                          <Stars value={r.rating} />
                          <time>{r.date}</time>
                        </div>
                        <p>{r.comment}</p>
                      </article>
                    ))
                  ) : (
                    <article className="pd-review-card">
                      <p>No written reviews for this piece yet. Bought it from us? Share your experience on WhatsApp.</p>
                    </article>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
        <p className="pd-disclaimer">
          <b>Disclaimer:</b> The actual product may look slightly different from the images due to natural variations in wood grain,
          fabric, colour and texture, as well as lighting during photography. Each piece is unique, and these variations are normal.
        </p>
      </section>

      {/* Feature callouts around the product */}
      <section className="pd-callouts shop-pad">
        <h2 className="shop-h2">Key Features</h2>
        <div className="pd-callouts-grid">
          {[product.details.slice(0, 2), product.details.slice(2, 4)].map((side, s) => (
            <ul key={s} className={`pd-callouts-list pd-callouts-list--${s === 0 ? "left" : "right"}`}>
              {side.map((d, j) => {
                const i = s * 2 + j;
                return (
                  <li key={d}>
                    <span className="pd-feature-img">
                      {featureImages[i] ? (
                        <Image src={featureImages[i]} alt="" fill sizes="120px" style={{ objectFit: "cover" }} />
                      ) : (
                        // No dedicated photo yet: show a close-up of the product photo
                        <span className="pd-feature-zoom" style={{ backgroundImage: `url("${product.primaryImage}")`, backgroundPosition: FEATURE_FOCUS[i] }} />
                      )}
                    </span>
                    <p>{d}</p>
                  </li>
                );
              })}
            </ul>
          ))}
          <div className="pd-callouts-img">
            <Image src={product.primaryImage} alt={`${product.name} details`} fill sizes="(max-width: 1060px) 100vw, 40vw" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </section>

      <ProductRow
        title={related.length >= 2 ? `More ${categoryLabel ?? "Designs"}` : "You May Also Like"}
        products={moreToExplore}
        currency={currency}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
        onAddToCart={(prod, f) => addToEnquiry(prod, f)}
      />
    </>
  );
};
