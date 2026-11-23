import type { NextConfig } from "next";

// Lets next/image optimise photos uploaded to Cloudflare R2.
const r2Host = (() => {
  try {
    return process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    remotePatterns: r2Host ? [{ protocol: "https", hostname: r2Host, pathname: "/**" }] : [],
  },
};

export default nextConfig;
