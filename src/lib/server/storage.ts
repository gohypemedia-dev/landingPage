import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getR2Env, type R2Env } from "@/lib/server/env";
import { MEDIA_TYPES, type MediaContentType } from "@/lib/media";

/**
 * Media storage. Uses Cloudflare R2 when the R2_* variables are set; in local
 * development without R2 it writes to public/uploads so the admin can be used
 * before the bucket exists.
 */

const LOCAL_PREFIX = "uploads";
const PUBLIC_DIR = path.join(process.cwd(), "public");

let client: S3Client | undefined;

function getR2Client(env: R2Env) {
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return client;
}

export type StorageMode = "r2" | "local" | "unavailable";

export function getStorageMode(): StorageMode {
  if (getR2Env()) return "r2";
  return process.env.NODE_ENV === "development" ? "local" : "unavailable";
}

export type UploadTarget = {
  objectKey: string;
  uploadUrl: string;
  publicUrl: string;
};

export async function createUploadTarget(contentType: MediaContentType): Promise<UploadTarget> {
  const { ext, kind } = MEDIA_TYPES[contentType];
  const folder = kind === "VIDEO" ? "videos" : "images";
  const year = new Date().getUTCFullYear();
  const name = `${randomUUID()}.${ext}`;
  const env = getR2Env();

  if (env) {
    const objectKey = `${folder}/${year}/${name}`;
    const uploadUrl = await getSignedUrl(
      getR2Client(env),
      new PutObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: objectKey, ContentType: contentType }),
      { expiresIn: 5 * 60 },
    );
    return { objectKey, uploadUrl, publicUrl: `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${objectKey}` };
  }

  if (getStorageMode() === "local") {
    const objectKey = `${LOCAL_PREFIX}/${folder}/${year}/${name}`;
    const params = new URLSearchParams({ objectKey, contentType });
    return { objectKey, uploadUrl: `/api/uploads/local?${params}`, publicUrl: `/${objectKey}` };
  }

  throw new Error("Media storage is not configured. Set the R2_* environment variables.");
}

/** Only keys this module generated may be written or deleted locally. */
const LOCAL_KEY = /^uploads\/(images|videos)\/\d{4}\/[0-9a-f-]{36}\.[a-z0-9]+$/;

function localPath(objectKey: string) {
  if (!LOCAL_KEY.test(objectKey)) throw new Error("Invalid object key");
  return path.join(PUBLIC_DIR, ...objectKey.split("/"));
}

export async function writeLocalObject(objectKey: string, data: Uint8Array) {
  const file = localPath(objectKey);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
}

export async function deleteObject(objectKey: string) {
  if (objectKey.startsWith(`${LOCAL_PREFIX}/`)) {
    await unlink(localPath(objectKey)).catch(() => undefined);
    return;
  }
  const env = getR2Env();
  if (!env) return;
  await getR2Client(env).send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: objectKey }));
}
