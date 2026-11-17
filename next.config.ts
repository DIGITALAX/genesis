import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@x402/core": "./src/app/lib/empty.ts",
      "@x402/core/*": "./src/app/lib/empty.ts",
      "@x402/evm": "./src/app/lib/empty.ts",
      "@x402/evm/*": "./src/app/lib/empty.ts",
      "@x402/svm": "./src/app/lib/empty.ts",
      "@x402/svm/*": "./src/app/lib/empty.ts",
      "@x402/extensions": "./src/app/lib/empty.ts",
      "@x402/extensions/*": "./src/app/lib/empty.ts",
      "@x402/express": "./src/app/lib/empty.ts",
      "@x402/express/*": "./src/app/lib/empty.ts",
      "@x402/fetch": "./src/app/lib/empty.ts",
      "@x402/fetch/*": "./src/app/lib/empty.ts",
    },
  },
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },
  webpack: (config, { isServer }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "thread-stream/test": false,
      "@x402/core": false,
      "@x402/evm": false,
      "@x402/svm": false,
      "@x402/extensions": false,
      "@x402/express": false,
      "@x402/fetch": false,
    };

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
