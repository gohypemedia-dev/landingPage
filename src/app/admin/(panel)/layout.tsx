import { Suspense } from "react";

import { AdminNav } from "@/components/admin/AdminNav";
import { getPrisma } from "@/lib/server/db";
import { isDatabaseConfigured } from "@/lib/server/env";
import { isLoginSkipped, requireAdmin } from "@/lib/server/session";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="adm-loading">Loading…</div>}>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}

async function AuthGate({ children }: { children: React.ReactNode }) {
  if (!isDatabaseConfigured()) return <SetupNotice />;

  const user = await requireAdmin();
  const newEnquiries = await getPrisma().enquiry.count({ where: { status: "NEW" } });

  return (
    <div className="adm-shell">
      <AdminNav user={user} newEnquiries={newEnquiries} loginSkipped={isLoginSkipped()} />
      <main className="adm-main">{children}</main>
    </div>
  );
}

function SetupNotice() {
  return (
    <main className="adm-login">
      <div className="adm-login-card adm-login-card--wide">
        <h1>Connect the database</h1>
        <p className="adm-muted">The admin needs a PostgreSQL database (Neon). The public website keeps working without it.</p>
        <ol className="adm-steps">
          <li>
            Copy <code>.env.example</code> to <code>.env</code> and set <code>DATABASE_URL</code> and <code>BETTER_AUTH_SECRET</code>.
          </li>
          <li>
            Run <code>npm run db:deploy</code> to create the tables.
          </li>
          <li>
            Run <code>npm run admin:create</code> to create your login.
          </li>
          <li>Restart the server and open /admin again.</li>
        </ol>
      </div>
    </main>
  );
}
