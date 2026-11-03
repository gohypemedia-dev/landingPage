import fs from "node:fs";
import path from "node:path";
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { ProductDetail } from "@/components/shop/ProductDetail";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

// Photos from public/images/products/<product-id>/ (sorted by file name):
// "feature-1.jpg" … "feature-4.jpg" illustrate the Key Features, everything else joins the gallery.
const folderImages = (id: string) => {
  const dir = path.join(process.cwd(), "public", "images", "products", id);
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    // No folder for this product
  }
  const url = (f: string) => `/images/products/${id}/${encodeURIComponent(f)}`;
  const isFeature = (f: string) => /^feature-\d+\./i.test(f);
  return {
    gallery: files.filter((f) => !isFeature(f)).map(url),
    features: files.filter(isFeature).map(url),
  };
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return {};
  return {
    title: `${product.name} | Casablanca Sofas Kurnool`,
    description: product.subtitle,
    openGraph: { images: [product.primaryImage] },
  };
}

// params is read inside Suspense so the route keeps a shared App Shell for instant navigation
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();
  const images = folderImages(id);
  return <ProductDetail product={product} extraImages={images.gallery} featureImages={images.features} />;
}
