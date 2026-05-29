import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://backend:6001";
    console.log(`Proxying /api to: ${backendUrl}`);
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve HMR stability in Docker/Network environments
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
