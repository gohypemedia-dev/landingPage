import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryProducts, ownPageCategories } from "@/lib/catalog/queries";
import { getCatalog } from "@/lib/server/catalog";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";

// Categories added later in the admin render on first visit.
export async function generateStaticParams() {
  return ownPageCategories(await getCatalog()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = ownPageCategories(await getCatalog()).find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.label} in Kurnool | Mallikarjuna Furniture World`,
    description: `Browse ${cat.label.toLowerCase()} at Mallikarjuna Furniture World, Kurnool. Enquire on WhatsApp for designs, prices and showroom availability.`,
  };
}

// params is read inside Suspense so the route keeps a shared App Shell for instant navigation
export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const cat = ownPageCategories(catalog).find((c) => c.slug === slug);
  if (!cat) notFound();
  return (
    <CategoryLandingTemplate
      categorySlug={`category/${cat.slug}`}
      categoryName={cat.label}
      heading={cat.label}
      subheading={cat.label}
      introduction={cat.description || `Explore ${cat.label.toLowerCase()} at Mallikarjuna Furniture World, Kurnool. Visit our Kurnool showroom or enquire on WhatsApp for the full range, sizes and finishes.`}
      categoryTiles={[]}
      products={categoryProducts(catalog, cat.slug)}
      heroImage={cat.image}
    />
  );
}
