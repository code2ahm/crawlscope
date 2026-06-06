import { copyFileSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const nextConfig = {
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium-min",
    "lighthouse",
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "lighthouse",
        "puppeteer-core",
        "@sparticuz/chromium-min",
      ];
    }
    return config;
  },
};

export default nextConfig;
