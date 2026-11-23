import "server-only";

import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth/minimal";

import { getPrisma } from "@/lib/server/db";
import { getAuthEnv } from "@/lib/server/env";

function createAuth() {
  const env = getAuthEnv();

  return betterAuth({
    appName: "Mallikarjuna Furniture World Admin",
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [
      env.BETTER_AUTH_URL,
      // Any local port in development (e.g. `npm run dev -- -p 3001`).
      ...(process.env.NODE_ENV === "development" ? ["http://localhost:*", "http://127.0.0.1:*"] : []),
    ],
    database: prismaAdapter(getPrisma(), { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      // Admin accounts are created with `npm run admin:create`, never from the site.
      disableSignUp: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    user: {
      additionalFields: {
        role: { type: ["ADMIN", "EDITOR"], defaultValue: "EDITOR", input: false, required: true },
      },
    },
    rateLimit: { enabled: true, window: 60, max: 30 },
  });
}

export type Auth = ReturnType<typeof createAuth>;

let auth: Auth | undefined;

export function getAuth() {
  auth ??= createAuth();
  return auth;
}
