import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Cloudflare Pages 部署配置
  trailingSlash: true,
};

export default nextConfig;
