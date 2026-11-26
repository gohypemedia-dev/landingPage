import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { SHOWROOM_INFO } from "@/data/products";
import { isLoginSkipped } from "@/lib/server/session";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  // Development shortcut (ADMIN_SKIP_LOGIN=true): go straight to the admin.
  if (isLoginSkipped()) redirect("/admin");

  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <Image
          src="/images/mallikarjuna-new-logo.png"
          alt={SHOWROOM_INFO.brandName}
          width={963}
          height={212}
          sizes="220px"
          className="adm-login-logo"
          priority
        />
        <h1>Website admin</h1>
        <p className="adm-muted">Sign in to edit the homepage, media and enquiries.</p>
        <LoginForm />
      </div>
    </main>
  );
}
