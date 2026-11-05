import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // If static backup is required for secondary hosting, set BUILD_TARGET=static
  output: process.env.BUILD_TARGET === "static" ? "export" : undefined,
  images: {
    unoptimized: process.env.BUILD_TARGET === "static",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
