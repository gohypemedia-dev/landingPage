"use client";

import { registerMediaAction } from "@/app/admin/actions";
import { isMediaContentType, maxBytesFor, type MediaItem } from "@/lib/media";

/** Uploads one file straight from the browser to storage, then records it in the media library. */
export async function uploadMedia(file: File): Promise<MediaItem> {
  if (!isMediaContentType(file.type)) {
    throw new Error(`${file.name}: use JPG, PNG, WebP, AVIF, MP4 or WebM.`);
  }
  if (file.size > maxBytesFor(file.type)) {
    throw new Error(`${file.name} is too large (max ${Math.round(maxBytesFor(file.type) / 1024 / 1024)} MB).`);
  }

  const presign = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });
  const target = await presign.json().catch(() => ({}));
  if (!presign.ok) throw new Error(target.error ?? "Could not start the upload.");

  const put = await fetch(target.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!put.ok) {
    throw new Error(
      `Upload failed (${put.status}). If you just added R2, check the bucket's CORS allows PUT from this site.`,
    );
  }

  const saved = await registerMediaAction({
    objectKey: target.objectKey,
    contentType: file.type,
    size: file.size,
    fileName: file.name,
  });
  if (!saved.ok || !saved.data) throw new Error(saved.ok ? "Upload not recorded." : saved.message);
  return saved.data;
}

export const formatBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
