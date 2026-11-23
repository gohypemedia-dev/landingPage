/**
 * Creates (or resets the password of) an admin login.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-password' npm run admin:create
 *
 * or set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in .env and run `npm run admin:create`.
 * Public sign-up is disabled, so this is the only way to add an admin.
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set.");
  if (!email || !email.includes("@")) throw new Error("Set ADMIN_EMAIL to the admin's email address.");
  if (password.length < 8) throw new Error("Set ADMIN_PASSWORD (at least 8 characters).");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  try {
    const hash = await hashPassword(password);
    const user = await prisma.user.upsert({
      where: { email },
      create: { email, name, role: "ADMIN", emailVerified: true },
      update: { role: "ADMIN" },
    });

    // Better Auth stores email/password logins as a "credential" account keyed by the user id.
    const existing = await prisma.account.findFirst({ where: { userId: user.id, providerId: "credential" } });
    if (existing) {
      await prisma.account.update({ where: { id: existing.id }, data: { password: hash } });
      // Sign out existing sessions after a password reset.
      await prisma.session.deleteMany({ where: { userId: user.id } });
      console.log(`Updated the password for ${email}.`);
    } else {
      await prisma.account.create({
        data: { userId: user.id, accountId: user.id, providerId: "credential", password: hash },
      });
      console.log(`Created admin ${email}. Sign in at /admin/login.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
