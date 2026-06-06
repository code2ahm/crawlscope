const nextConfig = {
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium-min",
    "lighthouse",
  ],
  outputFileTracingIncludes: {
    "/api/scan": [
      "./node_modules/lighthouse/shared/localization/locales/*.json",
      "./node_modules/lighthouse/core/lib/lantern/metrics/*.js",
    ],
  },
};

export default nextConfig;
