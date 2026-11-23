import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { getAuth } from "@/lib/server/auth";
import { getPrisma } from "@/lib/server/db";
import { isDatabaseConfigured } from "@/lib/server/env";

const userSelect = { id: true, name: true, email: true, role: true } as const;

/**
 * ADMIN_SKIP_LOGIN=true opens the admin without signing in, acting as the
 * first admin account. Development only: ignored in production builds so the
 * live site can never be left open by a stray setting.
 */
export function isLoginSkipped() {
  return process.env.NODE_ENV !== "production" && process.env.ADMIN_SKIP_LOGIN === "true";
}

async function getDefaultAdmin() {
  const prisma = getPrisma();
  const existing = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: userSelect,
  });
  if (existing) return existing;
  return prisma.user.upsert({
    where: { email: "admin@localhost" },
    create: { email: "admin@localhost", name: "Admin", role: "ADMIN", emailVerified: true },
    update: { role: "ADMIN" },
    select: userSelect,
  });
}

export const getCurrentUser = cache(async () => {
  // Marks the request as dynamic before any database work. Without it (e.g. with
  // ADMIN_SKIP_LOGIN, where headers() is never read) opening a fresh database
  // connection generates random bytes during prerender, which Next.js rejects.
  await connection();
  if (!isDatabaseConfigured()) return null;
  if (isLoginSkipped()) return getDefaultAdmin();

  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user.id) return null;

  return getPrisma().user.findUnique({ where: { id: session.user.id }, select: userSelect });
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** For admin pages: redirects to the login screen when signed out. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("You need to sign in again.");
  }
}

/** For server actions and route handlers: throws instead of redirecting. */
export async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
