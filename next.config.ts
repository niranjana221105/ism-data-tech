import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local images from /public — no remotePatterns needed
    // External images from old site are now downloaded locally
  },
};

export default nextConfig;
