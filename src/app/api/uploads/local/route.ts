import { isMediaContentType, maxBytesFor } from "@/lib/media";
import { getCurrentUser } from "@/lib/server/session";
import { getStorageMode, writeLocalObject } from "@/lib/server/storage";

/** Development-only stand-in for an R2 presigned PUT: writes into public/uploads. */
export async function PUT(request: Request) {
  if (getStorageMode() !== "local") return new Response("Not found", { status: 404 });

  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const params = new URL(request.url).searchParams;
  const objectKey = params.get("objectKey") ?? "";
  const contentType = params.get("contentType") ?? "";
  if (!isMediaContentType(contentType)) return new Response("Unsupported type", { status: 400 });

  const data = new Uint8Array(await request.arrayBuffer());
  if (data.byteLength === 0 || data.byteLength > maxBytesFor(contentType)) {
    return new Response("Invalid size", { status: 413 });
  }

  try {
    await writeLocalObject(objectKey, data);
  } catch {
    return new Response("Invalid object key", { status: 400 });
  }
  return new Response(null, { status: 200 });
}
