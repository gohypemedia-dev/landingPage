import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/lib/server/auth";

let handlers: ReturnType<typeof toNextJsHandler> | undefined;

// Created lazily so a missing .env does not break `next build`.
const getHandlers = () => (handlers ??= toNextJsHandler(getAuth()));

export const GET = (request: Request) => getHandlers().GET(request);
export const POST = (request: Request) => getHandlers().POST(request);
