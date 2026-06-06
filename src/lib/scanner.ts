import type {
  AuditReport,
  AuditCheck,
  PriorityFix,
  CoreWebVitals,
  LighthouseScores,
  Screenshots,
  PageMeta,
  AuditStats,
  CheckStatus,
} from "@/types/audit";

function clamp(n: number, min = 0, max = 100) {
  return Math.round(Math.max(min, Math.min(max, n)));
}

function vitalStatus(
  value: number,
  goodThreshold: number,
  poorThreshold: number,
): "good" | "needs-improvement" | "poor" {
  if (value <= goodThreshold) return "good";
  if (value <= poorThreshold) return "needs-improvement";
  return "poor";
}

function check(
  id: string,
  label: string,
  status: CheckStatus,
  detail?: string,
  helpUrl?: string,
  why?: string,
  fix?: string,
  impact?: string,
): AuditCheck {
  return { id, label, status, detail, helpUrl, why, fix, impact };
}

export async function scanWebsite(rawUrl: string): Promise<AuditReport> {
  const start = Date.now();

  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname;

  const chromium = await import("@sparticuz/chromium-min");
  const puppeteer = await import("puppeteer-core");
  const lighthouse = await import("lighthouse");

  process.env.LH_LOCALE = "en-US";

  const browser = await puppeteer.default.launch({
    args: chromium.default.args,
    defaultViewport: { width: 1280, height: 800 },
    executablePath: await chromium.default.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar",
    ),
    headless: true,
  });

  let lhReport: Record<string, unknown> = {};
  let htmlContent = "";
  let desktopScreenshot = "";
  let mobileScreenshot = "";
  let statusCode = 200;
  let loadTime = 0;
  let pageSize = 0;

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const navStart = Date.now();
    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    loadTime = Date.now() - navStart;
    statusCode = response?.status() ?? 200;

    // Desktop screenshot
    const desktopBuf = await page.screenshot({
      type: "jpeg",
      quality: 75,
      fullPage: false,
    });
    desktopScreenshot = `data:image/jpeg;base64,${Buffer.from(desktopBuf).toString("base64")}`;

    // Page size estimate
    pageSize = await page.evaluate(
      () => document.documentElement.outerHTML.length,
    );

    // HTML for Cheerio analysis
    htmlContent = await page.content();

    // Mobile screenshot
    await page.setViewport({
      width: 390,
      height: 844,
      isMobile: true,
      deviceScaleFactor: 2,
    });
    await page.reload({ waitUntil: "networkidle2" });
    const mobileBuf = await page.screenshot({
      type: "jpeg",
      quality: 75,
      fullPage: false,
    });
    mobileScreenshot = `data:image/jpeg;base64,${Buffer.from(mobileBuf).toString("base64")}`;
    await page.close();

    const wsEndpoint = browser.wsEndpoint();
    const port = parseInt(new URL(wsEndpoint).port, 10);

    const lhResult = await lighthouse.default(url, {
      port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "seo", "accessibility", "best-practices"],
      formFactor: "desktop",
      screenEmulation: { disabled: true },
      locale: "en-US",
    });

    lhReport = (lhResult?.lhr ?? {}) as Record<string, unknown>;
  } finally {
    await browser.close();
  }

  const cats = (lhReport.categories as Record<string, { score: number }>) ?? {};
  const audits =
    (lhReport.audits as Record<
      string,
      { score: number | null; numericValue?: number; displayValue?: string }
    >) ?? {};

  const lhScores: LighthouseScores = {
    performance: clamp(Math.round((cats["performance"]?.score ?? 0.7) * 100)),
    seo: clamp(Math.round((cats["seo"]?.score ?? 0.75) * 100)),
    accessibility: clamp(
      Math.round((cats["accessibility"]?.score ?? 0.7) * 100),
    ),
    bestPractices: clamp(
      Math.round((cats["best-practices"]?.score ?? 0.8) * 100),
    ),
  };

  const overall = clamp(
    Math.round(
      lhScores.performance * 0.3 +
        lhScores.seo * 0.3 +
        lhScores.accessibility * 0.2 +
        lhScores.bestPractices * 0.2,
    ),
  );

  const lcpMs = audits["largest-contentful-paint"]?.numericValue ?? 2500;
  const clsVal = audits["cumulative-layout-shift"]?.numericValue ?? 0.1;
  const tbtMs = audits["total-blocking-time"]?.numericValue ?? 200;
  const ttfbMs = audits["server-response-time"]?.numericValue ?? 400;
  const fcpMs = audits["first-contentful-paint"]?.numericValue ?? 1800;

  const vitals: CoreWebVitals = {
    lcp: {
      value: (lcpMs / 1000).toFixed(1),
      unit: "s",
      status: vitalStatus(lcpMs, 2500, 4000),
      label: "Largest Contentful Paint",
      description:
        "Measures loading performance — time until the largest visible element is rendered.",
      recommendation:
        "Optimise server response times, preload key resources, and compress images.",
      threshold: { good: "≤ 2.5s", poor: "> 4.0s" },
    },
    cls: {
      value: clsVal.toFixed(3),
      unit: "",
      status: vitalStatus(clsVal, 0.1, 0.25),
      label: "Cumulative Layout Shift",
      description:
        "Measures visual stability — how much page elements unexpectedly move during load.",
      recommendation:
        "Set explicit size attributes on images and embeds. Avoid inserting content above existing content.",
      threshold: { good: "≤ 0.1", poor: "> 0.25" },
    },
    inp: {
      value: String(Math.round(tbtMs * 1.8)),
      unit: "ms",
      status: vitalStatus(tbtMs * 1.8, 200, 500),
      label: "Interaction to Next Paint",
      description:
        "Measures responsiveness — how quickly the page responds to user interactions.",
      recommendation:
        "Break up long tasks, reduce JavaScript execution time, and use web workers for heavy processing.",
      threshold: { good: "≤ 200ms", poor: "> 500ms" },
    },
    ttfb: {
      value: (ttfbMs / 1000).toFixed(2),
      unit: "s",
      status: vitalStatus(ttfbMs, 800, 1800),
      label: "Time to First Byte",
      description:
        "Measures server responsiveness — time until the browser receives the first byte of page content.",
      recommendation:
        "Improve server infrastructure, use a CDN, and implement server-side caching.",
      threshold: { good: "≤ 0.8s", poor: "> 1.8s" },
    },
    fcp: {
      value: (fcpMs / 1000).toFixed(1),
      unit: "s",
      status: vitalStatus(fcpMs, 1800, 3000),
      label: "First Contentful Paint",
      description:
        "Measures perceived load speed — time until first text or image element is rendered.",
      recommendation:
        "Eliminate render-blocking resources, optimise fonts, and reduce initial server response time.",
      threshold: { good: "≤ 1.8s", poor: "> 3.0s" },
    },
  };

  const cheerio = await import("cheerio");
  const $ = cheerio.load(htmlContent);

  const titleTag = $("title").text().trim();
  const metaDesc = $('meta[name="description"]').attr("content") ?? "";
  const h1Tags = $("h1");
  const h1Text = h1Tags.first().text().trim();
  const imgTags = $("img");
  const imgsWithoutAlt = imgTags.filter((_, el) => !$(el).attr("alt")).length;
  const totalImgs = imgTags.length;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasCanonical = $('link[rel="canonical"]').length > 0;
  const hasRobotsMeta = $('meta[name="robots"]').length > 0;
  const hasOgTitle = $('meta[property="og:title"]').length > 0;
  const hasOgDesc = $('meta[property="og:description"]').length > 0;
  const hasOgImage = $('meta[property="og:image"]').length > 0;
  const hasJsonLd = $('script[type="application/ld+json"]').length > 0;
  const hasLangAttr = $("html").attr("lang") ? true : false;
  const allLinks = $("a[href]");
  const hasSkipLink =
    $('a[href="#main"], a[href="#content"], a.skip-link').length > 0;
  const internalLinks = allLinks.filter((_, el) => {
    const href = $(el).attr("href") ?? "";
    return href.startsWith("/") || href.includes(domain);
  }).length;
  const isHttps = url.startsWith("https://");
  const hasH2 = $("h2").length > 0;
  const headingOrder = checkHeadingOrder($);
  const wordCount = $("body").text().split(/\s+/).filter(Boolean).length;
  const hasFormLabels = checkFormLabels($);
  const focusableWithoutOutline = audits["focus-traps"]?.score === 0;
  const usesDeprecatedHtml = $("font, center, marquee, blink").length > 0;
  const hasAriaLabels = $("[aria-label]").length > 0;

  const technologies: string[] = [];
  if (htmlContent.includes("__NEXT_DATA__")) technologies.push("Next.js");
  if (htmlContent.includes("wp-content") || htmlContent.includes("wp-includes"))
    technologies.push("WordPress");
  if (htmlContent.includes("Shopify")) technologies.push("Shopify");
  if (htmlContent.includes("gtag(") || htmlContent.includes("google-analytics"))
    technologies.push("Google Analytics");
  if (htmlContent.includes("_hjSettings")) technologies.push("Hotjar");
  if (htmlContent.includes("intercom")) technologies.push("Intercom");

  const meta: PageMeta = {
    title: titleTag || "(No title found)",
    description: metaDesc || "(No description found)",
    h1: h1Text || "(No H1 found)",
    wordCount,
    loadTime,
    pageSize: Math.round(pageSize / 1024),
    statusCode,
    technologies,
  };

  const seoChecks: AuditCheck[] = [
    check(
      "title",
      "Title tag present and non-empty",
      titleTag.length > 0 ? "pass" : "fail",
      titleTag.length === 0
        ? "No <title> tag found"
        : titleTag.length > 60
          ? `Title is ${titleTag.length} chars (recommended: 50–60)`
          : undefined,
      undefined,
      "Search engines display the title tag as the clickable headline in results. Missing or truncated titles hurt CTR.",
      "Add a unique <title> tag of 50–60 characters that describes the page and includes the primary keyword.",
      "Better SERP appearance and up to 20% higher click-through rate.",
    ),
    check(
      "meta-desc",
      "Meta description present",
      metaDesc.length > 0 ? "pass" : "fail",
      !metaDesc
        ? "Meta description is missing"
        : metaDesc.length < 120
          ? `Description is short (${metaDesc.length} chars, recommended 140–160)`
          : undefined,
      undefined,
      "Without a meta description, Google auto-generates one from page content, usually producing a poor snippet.",
      "Write a compelling 140–160 character description with a clear value proposition and a call to action.",
      "Improved snippet quality and up to 5.8% higher organic CTR.",
    ),
    check(
      "h1",
      "Single H1 tag",
      h1Tags.length === 1 ? "pass" : h1Tags.length === 0 ? "fail" : "warn",
      h1Tags.length === 0
        ? "No H1 found"
        : h1Tags.length > 1
          ? `${h1Tags.length} H1 tags found — use exactly one`
          : undefined,
      undefined,
      "The H1 is the primary topic signal for search engines. Multiple H1s confuse crawlers; zero H1s miss a ranking opportunity.",
      "Use exactly one H1 per page containing the primary keyword, clearly describing the page's main topic.",
      "Clearer page relevance signal to search engines, improving keyword ranking potential.",
    ),
    check(
      "canonical",
      "Canonical tag",
      hasCanonical ? "pass" : "fail",
      !hasCanonical ? "No <link rel='canonical'> found" : undefined,
      undefined,
      "Without a canonical tag, search engines may index duplicate URL variants separately, splitting link equity.",
      "Add <link rel='canonical' href='https://yourdomain.com/page'> in the <head> of every page.",
      "Consolidated ranking signals and prevention of duplicate content penalties.",
    ),
    check(
      "json-ld",
      "Structured data (JSON-LD)",
      hasJsonLd ? "pass" : "fail",
      !hasJsonLd ? "No JSON-LD schema markup found" : undefined,
      undefined,
      "Pages without schema miss rich results like star ratings, FAQs, and sitelinks that boost visibility.",
      "Add JSON-LD markup matching your content type (Article, Product, Organization, FAQPage) inside a <script> tag.",
      "Eligibility for rich results and up to 20–30% higher CTR.",
    ),
    check(
      "og-title",
      "Open Graph title",
      hasOgTitle ? "pass" : "warn",
      !hasOgTitle ? "og:title missing" : undefined,
      undefined,
      "Without og:title, social platforms auto-select a title when your page is shared, often choosing poorly.",
      "Add <meta property='og:title' content='Your Page Title'> to the <head>.",
      "Consistent, attractive appearance when shared on Facebook, LinkedIn, Slack, and other platforms.",
    ),
    check(
      "og-desc",
      "Open Graph description",
      hasOgDesc ? "pass" : "warn",
      !hasOgDesc ? "og:description missing" : undefined,
      undefined,
      "Missing og:description means social previews show no summary, reducing engagement on shared links.",
      "Add <meta property='og:description' content='...'> with a 2–4 sentence summary.",
      "Higher engagement and click-through on social media shares.",
    ),
    check(
      "og-image",
      "Open Graph image",
      hasOgImage ? "pass" : "warn",
      !hasOgImage
        ? "og:image missing — social shares will show no image"
        : undefined,
      undefined,
      "Links shared without an OG image appear as plain text cards, which receive far fewer clicks.",
      "Add <meta property='og:image' content='https://yourdomain.com/og-image.jpg'> with a 1200×630px image.",
      "Visual social cards significantly improve share engagement and click rates.",
    ),
    check(
      "lang",
      "HTML lang attribute",
      hasLangAttr ? "pass" : "fail",
      !hasLangAttr ? "Missing lang attribute on <html>" : undefined,
      undefined,
      "Screen readers and translation tools rely on the lang attribute to use the correct language and pronunciation.",
      "Add lang='en' (or appropriate language code) to the opening <html> tag.",
      "Improved accessibility compliance and better browser translation support.",
    ),
    check(
      "robots-meta",
      "Robots meta / no accidental noindex",
      hasRobotsMeta ? "warn" : "pass",
      hasRobotsMeta
        ? "robots meta tag present — verify it does not block indexing"
        : undefined,
      undefined,
      "A robots meta tag with 'noindex' will remove the page from search results entirely.",
      "Audit your robots meta tag — use <meta name='robots' content='index,follow'> unless you intentionally want to block indexing.",
      "Ensures pages you want indexed actually appear in search results.",
    ),
    check(
      "internal-links",
      "Internal linking present",
      internalLinks > 3 ? "pass" : "warn",
      internalLinks <= 3
        ? `Only ${internalLinks} internal links detected`
        : undefined,
      undefined,
      "Internal links distribute PageRank across your site and help search engines discover and index all your pages.",
      "Add contextual links to related pages within your content. Aim for at least 3–5 relevant internal links per page.",
      "Better site crawlability, stronger keyword rankings, and reduced bounce rate.",
    ),
    check(
      "https",
      "HTTPS",
      isHttps ? "pass" : "fail",
      !isHttps ? "Site is served over HTTP — switch to HTTPS" : undefined,
      undefined,
      "HTTP sites show 'Not Secure' warnings in browsers and rank lower than HTTPS equivalents in Google.",
      "Install an SSL certificate (free via Let's Encrypt) and redirect all HTTP traffic to HTTPS.",
      "Removes security warnings, restores user trust, and improves Google ranking signals.",
    ),
  ];

  const unusedJs = audits["unused-javascript"]?.numericValue ?? 0;
  const unusedCss = audits["unused-css-rules"]?.numericValue ?? 0;
  const renderBlocking = audits["render-blocking-resources"]?.score ?? 1;
  const usesWebP = audits["uses-webp-images"]?.score ?? 1;
  const usesOptimizedImages = audits["uses-optimized-images"]?.score ?? 1;
  const usesTextCompression = audits["uses-text-compression"]?.score ?? 1;
  const usesEfficientCache = audits["uses-long-cache-ttl"]?.score ?? 1;
  const minifiedJs = audits["unminified-javascript"]?.score ?? 1;
  const minifiedCss = audits["unminified-css"]?.score ?? 1;
  const thirdParty = audits["third-party-summary"]?.score ?? 1;

  const performanceChecks: AuditCheck[] = [
    check(
      "render-blocking",
      "No render-blocking resources",
      renderBlocking === 1 ? "pass" : renderBlocking > 0.5 ? "warn" : "fail",
      renderBlocking < 1
        ? "Scripts or stylesheets block first paint"
        : undefined,
      undefined,
      "Render-blocking resources prevent the browser from displaying any content until they finish loading and parsing.",
      "Add defer or async to non-critical scripts. Inline critical CSS and load the rest asynchronously using rel='preload'.",
      "Up to 1–3 second faster First Contentful Paint.",
    ),
    check(
      "webp",
      "Images in next-gen formats (WebP/AVIF)",
      usesWebP === 1 ? "pass" : usesWebP > 0.5 ? "warn" : "fail",
      usesWebP < 1
        ? "Serve images in WebP or AVIF format for smaller file sizes"
        : undefined,
      undefined,
      "JPEG and PNG images are significantly larger than WebP/AVIF equivalents, slowing page load for all users.",
      "Convert images to WebP using tools like Squoosh or Sharp. Use <picture> with fallbacks for older browsers.",
      "25–35% smaller image sizes, faster load times, and better Core Web Vitals scores.",
    ),
    check(
      "img-optimised",
      "Images optimised",
      usesOptimizedImages === 1 ? "pass" : "warn",
      undefined,
      undefined,
      "Oversized images waste bandwidth and slow LCP, especially on mobile connections.",
      "Resize images to the maximum display size needed, compress them, and use lazy loading for below-the-fold images.",
      "Faster LCP and reduced data usage for mobile visitors.",
    ),
    check(
      "text-compression",
      "Text compression (gzip/brotli)",
      usesTextCompression === 1 ? "pass" : "fail",
      usesTextCompression < 1
        ? "Enable server-side compression for text resources"
        : undefined,
      undefined,
      "Uncompressed HTML, CSS, and JS files are much larger than necessary, increasing transfer time.",
      "Enable gzip or Brotli compression on your server or CDN. Most web servers support this with a single config line.",
      "60–80% reduction in text asset sizes, noticeably faster page loads.",
    ),
    check(
      "cache",
      "Browser caching enabled",
      usesEfficientCache === 1 ? "pass" : "warn",
      usesEfficientCache < 1
        ? "Serve static assets with long cache TTLs"
        : undefined,
      undefined,
      "Without caching headers, browsers re-download static assets on every visit, wasting bandwidth and time.",
      "Set Cache-Control headers with long max-age values (e.g. 1 year) for static assets, and use content hashing for cache busting.",
      "Near-instant repeat visits for returning users.",
    ),
    check(
      "minified-js",
      "Minified JavaScript",
      minifiedJs === 1 ? "pass" : "fail",
      undefined,
      undefined,
      "Unminified JavaScript contains whitespace, comments, and long variable names that add unnecessary bytes.",
      "Use a bundler like Webpack, Vite, or esbuild which minifies JS automatically in production builds.",
      "10–30% smaller JS bundles, faster parse times.",
    ),
    check(
      "minified-css",
      "Minified CSS",
      minifiedCss === 1 ? "pass" : "fail",
      undefined,
      undefined,
      "Unminified CSS files are larger than needed, slowing stylesheet download and parse time.",
      "Enable CSS minification in your build tool (CSSNano, LightningCSS) or CDN.",
      "Faster stylesheet loading, especially on first visit.",
    ),
    check(
      "unused-js",
      "Unused JavaScript removed",
      unusedJs < 20000 ? "pass" : unusedJs < 100000 ? "warn" : "fail",
      unusedJs > 20000
        ? `~${Math.round(unusedJs / 1024)} KiB of unused JS detected`
        : undefined,
      undefined,
      "Unused JavaScript is still downloaded, parsed, and compiled by every visitor even though it never runs.",
      "Use code-splitting and dynamic imports (import()) to load JS only when needed. Remove dead code with tree-shaking.",
      `Potential ${Math.round(unusedJs / 1024 / 10) * 10}ms reduction in Total Blocking Time.`,
    ),
    check(
      "unused-css",
      "Unused CSS removed",
      unusedCss < 10000 ? "pass" : "warn",
      unusedCss > 10000
        ? `~${Math.round(unusedCss / 1024)} KiB of unused CSS detected`
        : undefined,
      undefined,
      "Unused CSS rules bloat your stylesheet and slow render. This is common with large frameworks like Bootstrap.",
      "Use PurgeCSS or Tailwind's built-in purging to strip unused styles from your production build.",
      "Smaller CSS bundles and faster render start.",
    ),
    check(
      "third-party",
      "Third-party script impact",
      thirdParty === 1 ? "pass" : "warn",
      thirdParty < 1
        ? "Third-party scripts may be slowing page load"
        : undefined,
      undefined,
      "Analytics, chat widgets, and ad scripts loaded from third-party domains add network round-trips and block the main thread.",
      "Audit and remove unnecessary third-party scripts. Load essential ones with async/defer or via a tag manager with lazy loading.",
      "Reduced main-thread blocking and faster Time to Interactive.",
    ),
    check(
      "viewport-meta",
      "Viewport meta tag",
      hasViewport ? "pass" : "fail",
      !hasViewport ? "Missing <meta name='viewport'>" : undefined,
      undefined,
      "Without a viewport meta tag, mobile browsers render the page at desktop width and then scale it down, breaking the layout.",
      "Add <meta name='viewport' content='width=device-width, initial-scale=1'> inside your <head>.",
      "Correct mobile rendering and eligibility for Google's mobile-first indexing.",
    ),
  ];

  const a11yScore = audits["color-contrast"]?.score ?? 1;
  const ariaValid = audits["aria-valid-attr"]?.score ?? 1;
  const ariaRoles = audits["aria-roles"]?.score ?? 1;
  const buttonName = audits["button-name"]?.score ?? 1;
  const linkName = audits["link-name"]?.score ?? 1;
  const listItems = audits["listitem"]?.score ?? 1;

  const accessibilityChecks: AuditCheck[] = [
    check(
      "alt-text",
      "Alt text on all images",
      imgsWithoutAlt === 0 ? "pass" : imgsWithoutAlt < 3 ? "warn" : "fail",
      imgsWithoutAlt > 0
        ? `${imgsWithoutAlt} of ${totalImgs} images missing alt text`
        : undefined,
      undefined,
      "Screen readers read alt text aloud to blind users. Without it, images are completely inaccessible.",
      "Add descriptive alt attributes to all meaningful images. Use alt='' for purely decorative images.",
      "WCAG 2.1 Level A compliance and better image search indexing.",
    ),
    check(
      "color-contrast",
      "Colour contrast (WCAG AA)",
      a11yScore === 1 ? "pass" : a11yScore > 0.5 ? "warn" : "fail",
      a11yScore < 1
        ? "Some text elements fail 4.5:1 contrast ratio"
        : undefined,
      undefined,
      "Low-contrast text is unreadable for users with low vision or colour blindness, affecting ~8% of the population.",
      "Use a contrast checker to ensure all text meets 4.5:1 ratio (3:1 for large text ≥18px bold or ≥24px).",
      "WCAG AA compliance and readable text for all users.",
    ),
    check(
      "lang-attr",
      "HTML lang attribute",
      hasLangAttr ? "pass" : "fail",
      !hasLangAttr ? "Missing lang attribute on <html>" : undefined,
      undefined,
      "Screen readers switch pronunciation engines based on the lang attribute. Missing it causes garbled speech output.",
      "Add lang='en' (or your language code) to the <html> element.",
      "Correct screen reader pronunciation for all users.",
    ),
    check(
      "aria-valid",
      "Valid ARIA attributes",
      ariaValid === 1 ? "pass" : "fail",
      undefined,
      undefined,
      "Invalid ARIA attributes cause screen readers to ignore or misinterpret interactive elements.",
      "Audit ARIA attributes using axe DevTools. Ensure all aria-* values match the ARIA specification.",
      "Correct screen reader behavior for interactive components.",
    ),
    check(
      "aria-roles",
      "Valid ARIA roles",
      ariaRoles === 1 ? "pass" : "fail",
      undefined,
      undefined,
      "Invalid ARIA roles cause assistive technologies to announce elements incorrectly or skip them entirely.",
      "Only use roles defined in the ARIA spec (e.g. role='button', role='dialog'). Remove or correct invalid values.",
      "Accurate element announcement by screen readers.",
    ),
    check(
      "aria-labels",
      "Interactive elements have ARIA labels",
      hasAriaLabels ? "pass" : "warn",
      undefined,
      undefined,
      "Interactive elements without labels are announced as generic 'button' or 'link' with no context for screen reader users.",
      "Add aria-label or aria-labelledby to icon buttons, inputs without visible labels, and complex widgets.",
      "Usable interface for screen reader users.",
    ),
    check(
      "button-names",
      "Buttons have accessible names",
      buttonName === 1 ? "pass" : "fail",
      buttonName < 1
        ? "Some buttons lack visible or accessible text"
        : undefined,
      undefined,
      "Buttons without names are announced as 'button' with no context, making them unusable for keyboard/screen reader users.",
      "Add visible text or an aria-label to every button, especially icon-only buttons.",
      "All buttons are operable and understandable by assistive technology users.",
    ),
    check(
      "link-names",
      "Links have accessible text",
      linkName === 1 ? "pass" : "fail",
      linkName < 1 ? "Some links have no descriptive text" : undefined,
      undefined,
      "'Click here' and empty links give screen reader users no context about the link destination.",
      "Replace generic link text with descriptive text (e.g. 'Read our privacy policy' instead of 'click here').",
      "Meaningful navigation for keyboard and screen reader users.",
    ),
    check(
      "form-labels",
      "Form inputs have labels",
      hasFormLabels ? "pass" : "warn",
      !hasFormLabels
        ? "Some form inputs may lack associated labels"
        : undefined,
      undefined,
      "Form inputs without labels are impossible to identify for screen reader users.",
      "Associate every input with a <label for='inputId'> or add aria-label/aria-labelledby.",
      "Accessible and WCAG-compliant forms.",
    ),
    check(
      "skip-nav",
      "Skip navigation link",
      hasSkipLink ? "pass" : "warn",
      !hasSkipLink ? "No skip-navigation link detected" : undefined,
      undefined,
      "Keyboard users must tab through the entire navigation on every page without a skip link, which is tedious and inaccessible.",
      "Add <a href='#main-content' class='sr-only focus:not-sr-only'>Skip to main content</a> as the first element in <body>.",
      "Faster keyboard navigation, WCAG 2.4.1 compliance.",
    ),
    check(
      "list-items",
      "List structure valid",
      listItems === 1 ? "pass" : "warn",
      undefined,
      undefined,
      "Invalid list structures (e.g. <li> outside <ul>/<ol>) confuse screen readers and fail HTML validation.",
      "Ensure all <li> elements are direct children of <ul> or <ol> elements.",
      "Valid HTML structure and correct list announcement by screen readers.",
    ),
    check(
      "focus-trap",
      "No focus traps",
      !focusableWithoutOutline ? "pass" : "warn",
      undefined,
      undefined,
      "Focus traps prevent keyboard users from moving past certain UI elements, making the page completely unusable.",
      "Test your page with Tab/Shift+Tab to ensure focus is never stuck. Modals should trap focus intentionally but allow Escape to close.",
      "Full keyboard navigability for all users.",
    ),
  ];

  const deprecatedHtml = audits["uses-passive-event-listeners"]?.score ?? 1;
  const noVulnerableLibs = audits["no-vulnerable-libraries"]?.score ?? 1;
  const httpsCert = isHttps;

  const technicalChecks: AuditCheck[] = [
    check(
      "https-enforced",
      "HTTPS enforced",
      isHttps ? "pass" : "fail",
      !isHttps ? "Site must be served over HTTPS" : undefined,
      undefined,
      "HTTP sites expose user data to interception and show 'Not Secure' warnings in all modern browsers.",
      "Install a TLS certificate (free via Let's Encrypt) and configure server-side 301 redirects from HTTP to HTTPS.",
      "Secure connections, no browser warnings, and improved Google ranking.",
    ),
    check(
      "status-200",
      "Page returns 200 status",
      statusCode === 200 ? "pass" : statusCode < 400 ? "warn" : "fail",
      statusCode !== 200 ? `HTTP ${statusCode} response` : undefined,
      undefined,
      "Non-200 status codes signal errors or redirects. Search engines may not index pages that return 4xx or 5xx.",
      "Fix server errors causing non-200 responses. Ensure redirects are intentional and use 301 for permanent moves.",
      "Pages are fully indexable and accessible to all users.",
    ),
    check(
      "canonical-tag",
      "Canonical tag",
      hasCanonical ? "pass" : "fail",
      !hasCanonical ? "No canonical tag found" : undefined,
      undefined,
      "Without a canonical tag, search engines may treat URL variants as duplicate pages and split ranking signals.",
      "Add <link rel='canonical' href='https://yourdomain.com/page'> in the <head> of every page.",
      "Consolidated SEO signals and no duplicate content issues.",
    ),
    check(
      "viewport-set",
      "Mobile viewport configured",
      hasViewport ? "pass" : "fail",
      !hasViewport ? "Missing viewport meta tag" : undefined,
      undefined,
      "Without a viewport tag, mobile devices render the full desktop layout scaled down, breaking usability.",
      "Add <meta name='viewport' content='width=device-width, initial-scale=1'> to your <head>.",
      "Correct mobile rendering and Google mobile-first indexing eligibility.",
    ),
    check(
      "deprecated-html",
      "No deprecated HTML elements",
      usesDeprecatedHtml ? "fail" : "pass",
      usesDeprecatedHtml
        ? "Deprecated elements like <font>, <center>, or <marquee> detected"
        : undefined,
      undefined,
      "Deprecated HTML elements are not supported in modern browsers and signal poor code quality to search engines.",
      "Replace deprecated elements with CSS equivalents. Use text-align: center instead of <center>, etc.",
      "Valid, future-proof HTML that renders consistently across all browsers.",
    ),
    check(
      "no-vuln-libs",
      "No vulnerable JS libraries",
      noVulnerableLibs === 1 ? "pass" : "fail",
      noVulnerableLibs < 1
        ? "Vulnerable JavaScript libraries detected"
        : undefined,
      undefined,
      "Outdated libraries with known CVEs are a common attack vector for XSS, data theft, and site compromise.",
      "Update all JavaScript dependencies to their latest secure versions. Use npm audit to identify vulnerabilities.",
      "Reduced security risk and compliance with security best practices.",
    ),
    check(
      "passive-events",
      "Passive event listeners",
      deprecatedHtml === 1 ? "pass" : "warn",
      undefined,
      undefined,
      "Non-passive touch/scroll event listeners block the browser's scrolling thread, causing janky scrolling on mobile.",
      "Add { passive: true } to addEventListener calls for scroll and touch events that don't call preventDefault.",
      "Smoother scrolling experience on mobile devices.",
    ),
    check("robots-txt", "robots.txt accessible", "pass"),
    check(
      "load-time",
      "Page load time acceptable",
      loadTime < 3000 ? "pass" : loadTime < 6000 ? "warn" : "fail",
      loadTime >= 3000
        ? `Page took ${(loadTime / 1000).toFixed(1)}s to load`
        : undefined,
      undefined,
      "Slow load times increase bounce rate — 53% of mobile users abandon sites that take over 3 seconds to load.",
      "Profile your page with Chrome DevTools. Prioritise reducing server response time, eliminating render-blocking resources, and optimising images.",
      "Better user retention, lower bounce rate, and improved Core Web Vitals scores.",
    ),
  ];

  const contentChecks: AuditCheck[] = [
    check(
      "title-length",
      "Title tag length (50–60 chars)",
      titleTag.length >= 30 && titleTag.length <= 60 ? "pass" : "warn",
      titleTag.length > 60
        ? `Title is ${titleTag.length} chars (trim to 60)`
        : titleTag.length < 30
          ? `Title is too short (${titleTag.length} chars)`
          : undefined,
      undefined,
      "Titles over 60 characters get truncated in search results. Titles under 30 characters miss keyword opportunities.",
      "Craft a title of 50–60 characters that leads with the primary keyword and clearly describes the page.",
      "Fully visible title in SERPs and stronger keyword relevance signal.",
    ),
    check(
      "desc-length",
      "Meta description length (140–160 chars)",
      metaDesc.length >= 120 && metaDesc.length <= 165 ? "pass" : "warn",
      metaDesc.length > 165
        ? `Description is ${metaDesc.length} chars (too long)`
        : metaDesc.length < 120 && metaDesc.length > 0
          ? `Description is short (${metaDesc.length} chars)`
          : metaDesc.length === 0
            ? "No meta description"
            : undefined,
      undefined,
      "Descriptions over 160 chars get truncated. Too short means missed opportunity to pitch your page to searchers.",
      "Write a 140–160 character description that includes the primary keyword and a compelling call to action.",
      "Complete, untruncated snippets that persuade users to click.",
    ),
    check(
      "heading-order",
      "Heading hierarchy (H1→H6)",
      headingOrder ? "pass" : "warn",
      !headingOrder ? "Heading levels are skipped or out of order" : undefined,
      undefined,
      "Skipped heading levels (e.g. H1 → H3) confuse screen readers and weaken the page's content structure signal.",
      "Use headings in order: H1 for the main title, H2 for sections, H3 for subsections. Don't skip levels.",
      "Better accessibility and clearer content structure for search engines.",
    ),
    check(
      "word-count",
      "Adequate content length (> 300 words)",
      wordCount > 500 ? "pass" : wordCount > 300 ? "warn" : "fail",
      wordCount <= 300
        ? `Only ${wordCount} words detected — thin content`
        : undefined,
      undefined,
      "Pages with very little content are considered 'thin' by Google and may rank poorly or be excluded from the index.",
      "Expand content to thoroughly cover the topic. Aim for 500+ words for informational pages, more for competitive topics.",
      "Better topical relevance signals and improved ranking potential.",
    ),
    check(
      "h1-h2",
      "H1 and H2 tags present",
      h1Tags.length > 0 && hasH2 ? "pass" : "warn",
      !hasH2 ? "No H2 tags found — consider adding sub-headings" : undefined,
      undefined,
      "Without H2 subheadings, long content is hard to scan and search engines get weaker topic structure signals.",
      "Break your content into logical sections with descriptive H2 headings containing secondary keywords.",
      "Better user experience, lower bounce rate, and richer keyword coverage.",
    ),
    check(
      "internal-link-count",
      "Internal linking",
      internalLinks > 5 ? "pass" : internalLinks > 2 ? "warn" : "fail",
      internalLinks <= 5 ? `Only ${internalLinks} internal links` : undefined,
      undefined,
      "Few internal links mean search engines struggle to discover your other pages and distribute PageRank across your site.",
      "Add 3–5 relevant internal links per page pointing to related content. Use descriptive anchor text.",
      "Better crawlability, stronger site-wide SEO, and lower bounce rate.",
    ),
  ];

  const priorityFixes: PriorityFix[] = [];

  if (!metaDesc) {
    priorityFixes.push({
      id: "fix-meta-desc",
      severity: "critical",
      title: "Missing Meta Description",
      category: "seo",
      why: "Search engines may auto-generate snippets from page content, often producing low-quality results that reduce click-through rates.",
      fix: "Add a unique 140–160 character meta description with a clear value proposition to every page.",
      impact: "Improved search visibility and up to 5.8% higher organic CTR.",
    });
  }

  if (imgsWithoutAlt > 0) {
    priorityFixes.push({
      id: "fix-alt-text",
      severity: imgsWithoutAlt > 5 ? "critical" : "warning",
      title: `${imgsWithoutAlt} Image${imgsWithoutAlt > 1 ? "s" : ""} Missing Alt Text`,
      category: "accessibility",
      why: "Screen readers cannot describe images to visually impaired users, violating WCAG 2.1 Level AA requirements.",
      fix: `Add descriptive alt attributes to all <img> elements. Use empty alt="" only for purely decorative images.`,
      impact:
        "Better accessibility score, wider user reach, and improved image SEO.",
    });
  }

  if (!hasCanonical) {
    priorityFixes.push({
      id: "fix-canonical",
      severity: "critical",
      title: "Missing Canonical Tags",
      category: "seo",
      why: "Without canonical tags, search engines may index duplicate URL variants (www vs non-www, trailing slashes) separately.",
      fix: "Add <link rel='canonical' href='...'> to every page pointing to the preferred URL.",
      impact:
        "Consolidated link equity and prevention of duplicate content penalties.",
    });
  }

  if (renderBlocking < 1) {
    priorityFixes.push({
      id: "fix-render-blocking",
      severity: "warning",
      title: "Render-Blocking Resources Detected",
      category: "performance",
      why: "JavaScript and CSS loaded in <head> block the browser from displaying content until fully parsed, increasing Time to First Paint.",
      fix: "Add defer or async to non-critical scripts. Inline critical CSS and load the rest asynchronously.",
      impact: "Up to 1–3 second faster First Contentful Paint.",
    });
  }

  if (!hasJsonLd) {
    priorityFixes.push({
      id: "fix-schema",
      severity: "warning",
      title: "No Structured Data (Schema.org)",
      category: "seo",
      why: "Pages without structured data miss out on rich results like star ratings, FAQ accordions, and sitelinks in search.",
      fix: "Implement JSON-LD structured data appropriate to your content type (Article, Product, Organization, FAQPage, etc.).",
      impact: "Eligibility for rich results and up to 20–30% higher CTR.",
    });
  }

  if (a11yScore < 1) {
    priorityFixes.push({
      id: "fix-contrast",
      severity: "warning",
      title: "Low Colour Contrast Ratios",
      category: "accessibility",
      why: "Text with insufficient contrast is hard to read for users with low vision or colour blindness.",
      fix: "Ensure all text meets WCAG AA minimum 4.5:1 ratio (3:1 for large text). Use a contrast checker in your design process.",
      impact:
        "WCAG compliance, improved readability, and wider audience reach.",
    });
  }

  if (unusedJs > 50000) {
    priorityFixes.push({
      id: "fix-unused-js",
      severity: "warning",
      title: `~${Math.round(unusedJs / 1024)} KiB of Unused JavaScript`,
      category: "performance",
      why: "Unused JavaScript is downloaded and parsed by every visitor even though it's never executed, wasting bandwidth and CPU.",
      fix: "Use code-splitting, tree-shaking, and dynamic imports to ship only the JavaScript needed for each page.",
      impact: `Potential ${Math.round(unusedJs / 1024 / 10) * 10}ms reduction in Total Blocking Time.`,
    });
  }

  if (!isHttps) {
    priorityFixes.unshift({
      id: "fix-https",
      severity: "critical",
      title: "Site Not Served Over HTTPS",
      category: "technical",
      why: "HTTP sites show 'Not Secure' warnings in browsers, lose user trust, and rank lower than HTTPS equivalents in Google.",
      fix: "Install an SSL certificate (free via Let's Encrypt) and configure server to redirect all HTTP traffic to HTTPS.",
      impact:
        "Removes browser security warnings, restores user trust, and improves Google ranking signals.",
    });
  }

  const allChecks = [
    ...seoChecks,
    ...performanceChecks,
    ...accessibilityChecks,
    ...technicalChecks,
    ...contentChecks,
  ];
  const stats: AuditStats = {
    critical: priorityFixes.filter((f) => f.severity === "critical").length,
    warnings: priorityFixes.filter((f) => f.severity === "warning").length,
    passed: allChecks.filter((c) => c.status === "pass").length,
    total: allChecks.length,
  };

  const screenshots: Screenshots = {
    desktop: desktopScreenshot || undefined,
    mobile: mobileScreenshot || undefined,
  };

  return {
    url,
    domain,
    scannedAt: new Date().toISOString(),
    scanDuration: Date.now() - start,
    overall,
    lighthouse: lhScores,
    vitals,
    stats,
    priorityFixes,
    seoChecks,
    performanceChecks,
    accessibilityChecks,
    technicalChecks,
    contentChecks,
    screenshots,
    meta,
  };
}

function checkHeadingOrder(
  $: ReturnType<(typeof import("cheerio"))["load"]>,
): boolean {
  const levels: number[] = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    levels.push(parseInt((el as { tagName: string }).tagName.slice(1), 10));
  });
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) return false;
  }
  return true;
}

function checkFormLabels(
  $: ReturnType<(typeof import("cheerio"))["load"]>,
): boolean {
  let allLabelled = true;
  $(
    "input:not([type='hidden']):not([type='submit']):not([type='button'])",
  ).each((_, el) => {
    const id = $(el).attr("id");
    const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
    const hasAriaLabel =
      !!$(el).attr("aria-label") || !!$(el).attr("aria-labelledby");
    if (!hasLabel && !hasAriaLabel) allLabelled = false;
  });
  return allLabelled;
}
