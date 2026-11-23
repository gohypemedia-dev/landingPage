import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionEditor } from "@/components/admin/SectionEditor";
import { getSiteContentForAdmin } from "@/lib/server/site-content";
import { isSiteContentKey, sectionHome, SITE_CONTENT_SECTIONS } from "@/lib/site-content/schema";
import { requireAdmin } from "@/lib/server/session";

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return SITE_CONTENT_SECTIONS.map((s) => ({ section: s.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: SITE_CONTENT_SECTIONS.find((s) => s.key === section)?.title ?? "Section" };
}

export default async function SectionPage({ params }: Props) {
  // Checked here, not only in the layout: layouts do not re-run on navigation, so each page guards its own data.
  await requireAdmin();
  const { section } = await params;
  if (!isSiteContentKey(section)) notFound();

  const meta = SITE_CONTENT_SECTIONS.find((s) => s.key === section)!;
  const { content, status } = await getSiteContentForAdmin();

  return (
    <SectionEditor
      // Remount when switching sections so the form state resets.
      key={section}
      sectionKey={section}
      title={meta.title}
      description={meta.description}
      initial={content[section]}
      status={status[section] ?? null}
      siteWide={meta.siteWide}
      back={meta.siteWide ? null : sectionHome(section)}
    />
  );
}
