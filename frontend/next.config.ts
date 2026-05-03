import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.maariv.co.il",
      },
    ],
  },
};

export default nextConfig;
