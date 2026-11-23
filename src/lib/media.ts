// Shared (client + server) media rules.

export const MEDIA_TYPES = {
  "image/jpeg": { ext: "jpg", kind: "IMAGE" },
  "image/png": { ext: "png", kind: "IMAGE" },
  "image/webp": { ext: "webp", kind: "IMAGE" },
  "image/avif": { ext: "avif", kind: "IMAGE" },
  "video/mp4": { ext: "mp4", kind: "VIDEO" },
  "video/webm": { ext: "webm", kind: "VIDEO" },
} as const;

export type MediaContentType = keyof typeof MEDIA_TYPES;
export type MediaKind = "IMAGE" | "VIDEO";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

export const isMediaContentType = (t: string): t is MediaContentType => t in MEDIA_TYPES;

export const maxBytesFor = (t: MediaContentType) =>
  MEDIA_TYPES[t].kind === "VIDEO" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

export type MediaItem = {
  id: string;
  url: string;
  kind: MediaKind;
  fileName: string;
  alt: string;
  size: number;
  createdAt: string;
};
