import type { Metadata } from "next";

import { EnquiriesTable } from "@/components/admin/EnquiriesTable";
import { getPrisma } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Enquiries" };

export default async function EnquiriesPage() {
  // Checked here, not only in the layout: layouts do not re-run on navigation, so each page guards its own data.
  await requireAdmin();
  const rows = await getPrisma().enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 500 });

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Enquiries</h1>
          <p className="adm-muted">Submitted from the website’s inquiry form. Tap a phone number to reply on WhatsApp.</p>
        </div>
      </header>
      <EnquiriesTable
        initial={rows.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          category: r.category,
          requirement: r.requirement,
          pagePath: r.pagePath,
          status: r.status,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
