import { z } from "zod";

import { isMediaContentType, maxBytesFor } from "@/lib/media";
import { getCurrentUser } from "@/lib/server/session";
import { createUploadTarget } from "@/lib/server/storage";

const requestSchema = z.object({
  contentType: z.string(),
  size: z.number().int().positive(),
});

/** Returns a short-lived URL the browser PUTs the file to (R2, or local disk in dev). */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Please sign in again." }, { status: 401 });

  const body = requestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid upload request." }, { status: 400 });

  const { contentType, size } = body.data;
  if (!isMediaContentType(contentType)) {
    return Response.json({ error: "Use JPG, PNG, WebP, AVIF, MP4 or WebM files." }, { status: 400 });
  }
  if (size > maxBytesFor(contentType)) {
    const mb = Math.round(maxBytesFor(contentType) / 1024 / 1024);
    return Response.json({ error: `File is too large (max ${mb} MB).` }, { status: 413 });
  }

  try {
    return Response.json(await createUploadTarget(contentType));
  } catch (error) {
    console.error("[uploads] presign failed", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Upload service unavailable." },
      { status: 503 },
    );
  }
}
