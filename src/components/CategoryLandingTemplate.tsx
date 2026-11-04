"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { PRODUCTS, SHOWROOM_INFO, formatPriceINR } from "@/data/products";
import { ShopShell } from "@/components/shop/ShopShell";
import { ProductTile } from "@/components/shop/ProductTile";

export interface CategoryTile {
  title: string;
  countText: string;
  image: string;
  tag?: string;
}

export interface CategoryLandingProps {
  categorySlug: string;
  categoryName: string;
  heading: string;
  subheading: string;
  introduction: string;
  filterCategoryKey?: string;
  categoryTiles: CategoryTile[];
  seoFaqs?: { question: string; answer: string }[];
  /** Collection pages pass their own product list (kept in this order) and banner */
  products?: Product[];
  heroImage?: string;
}

// Banner image per category
const HERO_IMAGES: Record<string, string> = {
  sofas: "/images/mf-signature-curved-living.jpg",
  recliners: "/images/catalogue-recliner-featured.jpg",
  beds: "/images/796767853_18093958568640692_8492671734547745348_n.webp",
  dining: "/images/dining-space.jpg",
  curtains: "/images/banner-living.jpg",
};
const DEFAULT_HERO = "/images/showroom-kurnool-main.jpg";

const PRICE_FILTERS = [
  { key: "all", label: "All Prices", test: () => true },
  { key: "u50", label: "Under ₹50,000", test: (n: number) => n < 50000 },
  { key: "50-100", label: "₹50,000 – ₹1,00,000", test: (n: number) => n >= 50000 && n <= 100000 },
  { key: "o100", label: "Above ₹1,00,000", test: (n: number) => n > 100000 },
];

const priceOf = (p: Product) => p.priceINR ?? p.priceUSD * 83.5;

export const CategoryLandingTemplate: React.FC<CategoryLandingProps> = ({
  categoryName,
  introduction,
  filterCategoryKey,
  seoFaqs,
  products,
  heroImage: heroOverride,
}) => {
  const [priceFilter, setPriceFilter] = useState("all");
  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  const heroImage = heroOverride || (filterCategoryKey && HERO_IMAGES[filterCategoryKey]) || DEFAULT_HERO;
  // Some pages are already named "All …" (e.g. "All Furniture"), so don't prefix it again
  const baseName = categoryName.replace(/^All\s+/i, "");

  const categoryProducts = useMemo(
    () => products ?? (filterCategoryKey ? PRODUCTS.filter((p) => p.category === filterCategoryKey) : PRODUCTS),
    [products, filterCategoryKey]
  );


  const gridProducts = useMemo(() => {
    const test = PRICE_FILTERS.find((f) => f.key === priceFilter)!.test;
    const list = categoryProducts.filter((p) => test(priceOf(p)) && (!inStockOnly || p.inStock));
    if (sort === "price-asc") return [...list].sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === "price-desc") return [...list].sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === "rating") return [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "new") return [...list].sort((a, b) => b.year - a.year);
    if (products) return list; // collections keep their curated order
    return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [products, categoryProducts, priceFilter, sort, inStockOnly]);

  return (
    <ShopShell>
      {({ currency, wishlistIds, toggleWishlist, addToEnquiry }) => (
        <>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="shop-crumbs">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{categoryName}</span>
          </nav>

          {/* Hero banner */}
          <section className="cl-hero">
            <div className="cl-hero-inner">
              <Image src={heroImage} alt={categoryName} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
              {/* Banner is image-only; the title stays for search engines and screen readers */}
              <h1 className="sr-only">{categoryName}</h1>
            </div>
          </section>

          {/* No products listed online yet: point to WhatsApp / showroom instead of an empty grid */}
          {categoryProducts.length === 0 && (
            <section className="cl-enquire">
              <h2 className="shop-h2">{baseName}</h2>
              <p>Our {baseName.toLowerCase()} range is available at our Kurnool showroom. Message us for designs, sizes and prices.</p>
              <a
                href={`https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(
                  `Hello Mallikarjuna Furniture World Kurnool, please share your ${baseName.toLowerCase()} designs and prices.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cd-btn cd-btn--whatsapp"
              >
                Send Inquiry
              </a>
            </section>
          )}

          {/* Full grid with filters */}
          {categoryProducts.length > 0 && (
          <section id="all-products" className="cl-all">
            <div className="cl-toolbar">
              <h2 className="shop-h2">All {baseName}</h2>
              <div className="cl-filters">
                <div className="cl-chips" role="group" aria-label="Filter by price">
                  {PRICE_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      className={priceFilter === f.key ? "is-active" : undefined}
                      onClick={() => setPriceFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <label className="cl-check">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                  In stock
                </label>
                <label className="cl-sort">
                  Sort by
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="featured">Recommended</option>
                    <option value="new">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </label>
              </div>
            </div>

            <p className="cl-count">
              Showing {gridProducts.length} of {categoryProducts.length} designs
            </p>

            {gridProducts.length > 0 ? (
              <div className="cl-grid">
                {gridProducts.map((p) => (
                  <ProductTile
                    key={p.id}
                    product={p}
                    currency={currency}
                    isWishlisted={wishlistIds.includes(p.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={(prod, f) => addToEnquiry(prod, f)}
                  />
                ))}
              </div>
            ) : (
              <div className="cl-empty">
                <p>No designs match these filters.</p>
                <button type="button" onClick={() => { setPriceFilter("all"); setInStockOnly(false); }}>
                  Clear filters
                </button>
              </div>
            )}
          </section>
          )}

          {/* SEO content, comparison table & FAQs */}
          <section className="cl-seo">
            <div className="container cl-seo-inner">
              <h2>{categoryName} Online in Kurnool</h2>
              <p>{introduction}</p>

              {categoryProducts.length > 0 && (
                <>
                  <h3>Which one is right for you?</h3>
                  <div className="cl-table-wrap">
                    <table className="cl-table">
                      <thead>
                        <tr>
                          <th>Design</th>
                          <th>Best For</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryProducts.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <Link href={`/product/${p.id}`}>{p.name}</Link>
                            </td>
                            <td>{p.subtitle}</td>
                            <td>{p.priceOnEnquiry ? `From ${formatPriceINR(priceOf(p))}` : formatPriceINR(priceOf(p))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {seoFaqs && seoFaqs.length > 0 && (
                <>
                  <h3>Frequently Asked Questions</h3>
                  <div className="cl-faqs">
                    {seoFaqs.map((faq) => (
                      <details key={faq.question}>
                        <summary>{faq.question}</summary>
                        <p>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </>
      )}
    </ShopShell>
  );
};
