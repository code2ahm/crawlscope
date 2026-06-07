import { readFileSync } from "node:fs";

function packagePath(pkg) {
  return `node_modules/${pkg}`;
}

function collectPackageClosure(seedPackages) {
  let lock;
  try {
    lock = JSON.parse(
      readFileSync(new URL("./package-lock.json", import.meta.url), "utf8"),
    );
  } catch {
    return seedPackages;
  }

  const packages = lock.packages ?? {};
  const seen = new Set();

  function visit(pkg) {
    if (seen.has(pkg)) return;

    const entry = packages[packagePath(pkg)];
    if (!entry) return;

    seen.add(pkg);

    for (const dep of Object.keys(entry.dependencies ?? {})) {
      visit(dep);
    }

    for (const dep of Object.keys(entry.optionalDependencies ?? {})) {
      visit(dep);
    }
  }

  seedPackages.forEach(visit);
  return [...new Set([...seedPackages, ...seen])];
}

const tracedPackages = collectPackageClosure([
  "lighthouse",
  "@paulirish/trace_engine",
  "axe-core",
  "puppeteer-core",
  "@sparticuz/chromium-min",
]);

const nextConfig = {
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium-min",
    "lighthouse",
  ],
  outputFileTracingIncludes: {
    "/api/scan": tracedPackages.map((pkg) => `./node_modules/${pkg}/**/*`),
  },
};

export default nextConfig;
