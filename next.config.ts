import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // If we need a static backup for MilesWeb, we set BUILD_TARGET=static
  output: process.env.BUILD_TARGET === 'static' ? 'export' : undefined,
  images: {
    // Static export requires unoptimized images
    unoptimized: process.env.BUILD_TARGET === 'static',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
