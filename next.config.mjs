const nextConfig = {
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium-min",
    "lighthouse",
  ],
  outputFileTracingIncludes: {
    "/api/scan": [
      "./node_modules/lighthouse/**/*",
      "./node_modules/axe-core/**/*",
    ],
  },
};

export default nextConfig;
