import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseEnv } from "@/lib/server/env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const { DATABASE_URL } = getDatabaseEnv();
  const adapter = new PrismaPg({
    connectionString: DATABASE_URL,
    connectionTimeoutMillis: 10_000,
    max: 5,
  });
  return new PrismaClient({ adapter });
}

export function getPrisma() {
  let prisma: PrismaClient | undefined = globalForPrisma.prisma;
  // Reuse one client across hot reloads in development, unless the client was
  // regenerated (`prisma generate` after a schema change): the cached instance then
  // comes from the old class and lacks the new models, so replace it.
  if (prisma && !(prisma instanceof PrismaClient)) {
    const stale: { $disconnect: () => Promise<void> } = prisma;
    void stale.$disconnect().catch(() => {});
    prisma = undefined;
  }
  prisma ??= createPrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  return prisma;
}
