import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  outputFileTracingIncludes: {
    "/api/**/*": ["./prisma/dev.db"],
  },
};

export default nextConfig;