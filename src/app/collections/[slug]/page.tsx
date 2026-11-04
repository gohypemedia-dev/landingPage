import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTIONS, getCollectionProducts } from "@/data/collections";
import { CategoryLandingTemplate } from "@/components/CategoryLandingTemplate";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) return {};
  return {
    title: `${collection.title} | Mallikarjuna Furniture World Kurnool`,
    description: collection.intro,
  };
}

// params is read inside Suspense so the route keeps a shared App Shell for instant navigation
export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <CollectionContent params={params} />
    </Suspense>
  );
}

async function CollectionContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();
  return (
    <CategoryLandingTemplate
      categorySlug={`collections/${collection.slug}`}
      categoryName={collection.title}
      heading={collection.title}
      subheading={collection.title}
      introduction={collection.intro}
      categoryTiles={[]}
      products={getCollectionProducts(collection.key)}
      heroImage={collection.hero}
    />
  );
}
