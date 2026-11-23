import "server-only";

import { z } from "zod";

const databaseSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is not set"),
});

const authSchema = z.object({
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters")
    .refine((v) => !v.startsWith("replace-"), "Replace the example BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
});

const r2Schema = z.object({
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.url(),
});

export type R2Env = z.infer<typeof r2Schema>;

let databaseEnv: z.infer<typeof databaseSchema> | undefined;
let authEnv: z.infer<typeof authSchema> | undefined;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getDatabaseEnv() {
  databaseEnv ??= databaseSchema.parse(process.env);
  return databaseEnv;
}

export function getAuthEnv() {
  authEnv ??= authSchema.parse(process.env);
  return authEnv;
}

/** R2 upload settings, or null when both credentials are absent. */
export function getR2Env(): R2Env | null {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  if (!accessKeyId && !secretAccessKey) return null;

  return r2Schema.parse({
    ...process.env,
    R2_ACCESS_KEY_ID: accessKeyId,
    R2_SECRET_ACCESS_KEY: secretAccessKey,
  });
}
