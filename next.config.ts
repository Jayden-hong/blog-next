import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't use output: 'export' - let Cloudflare Pages handle SSR
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
