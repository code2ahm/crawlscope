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
      "./node_modules/lighthouse/core/audits/**/*.js",
      "./node_modules/lighthouse/core/gather/gatherers/**/*.js",
      "./node_modules/lighthouse/flow-report/assets/*.html",
      "./node_modules/lighthouse/flow-report/assets/*.css",
      "./node_modules/lighthouse/report/generator/*.html",
      "./node_modules/lighthouse/report/assets/*.css",
      "./node_modules/lighthouse/report/assets/*.js",
      "./node_modules/lighthouse/dist/report/*.js",
      "./node_modules/lighthouse/**/*.json",
      "./node_modules/lighthouse/**/*.html",
    ],
  },
};

export default nextConfig;
