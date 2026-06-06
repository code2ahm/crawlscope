import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next";
import {
  Search,
  Zap,
  Eye,
  Shield,
  FileText,
  Camera,
  Download,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features — CrawlScope",
  description: "Everything CrawlScope audits: SEO, Performance, Core Web Vitals, Accessibility, Technical Health, and Content Structure.",
};

const FEATURES = [
  {
    icon: Search,
    color: "#3b82f6",
    bg: "#eff6ff",
    title: "SEO Analysis",
    description: "Deep inspection of every on-page SEO signal that affects how search engines discover, index, and rank your pages.",
    checks: [
      "Title tag presence, length, and uniqueness",
      "Meta description quality and character count",
      "H1 tag validation — exactly one per page",
      "Canonical tag detection and verification",
      "JSON-LD structured data (Schema.org)",
      "Open Graph title, description, and image",
      "HTML lang attribute for internationalisation",
      "robots meta tag — no accidental noindex",
      "Internal link count and anchor text quality",
      "HTTPS enforcement check",
    ],
  },
  {
    icon: Zap,
    color: "#8b5cf6",
    bg: "#f5f3ff",
    title: "Performance",
    description: "Full Lighthouse audit plus additional checks to identify every resource that slows your page down.",
    checks: [
      "Render-blocking scripts and stylesheets",
      "Next-gen image formats (WebP / AVIF)",
      "Image optimisation and sizing",
      "Text compression (gzip / brotli)",
      "Browser caching and cache TTL",
      "JavaScript minification",
      "CSS minification",
      "Unused JavaScript (KiB detected)",
      "Unused CSS (KiB detected)",
      "Third-party script impact",
    ],
  },
  {
    icon: Eye,
    color: "#06b6d4",
    bg: "#ecfeff",
    title: "Accessibility",
    description: "WCAG 2.1 Level AA compliance checks so your site works for every user, regardless of ability.",
    checks: [
      "Alt text on all images",
      "Colour contrast ratio (4.5:1 minimum)",
      "HTML lang attribute",
      "Valid ARIA attributes",
      "Valid ARIA roles",
      "Interactive elements have ARIA labels",
      "Buttons have accessible names",
      "Links have descriptive text",
      "Form inputs have labels",
      "Skip navigation link present",
    ],
  },
  {
    icon: Shield,
    color: "#10b981",
    bg: "#ecfdf5",
    title: "Technical Health",
    description: "Under-the-hood technical checks that affect crawlability, security, and overall site reliability.",
    checks: [
      "HTTPS enforced site-wide",
      "HTTP 200 status code returned",
      "Canonical tag present",
      "Mobile viewport meta tag",
      "No deprecated HTML elements",
      "No vulnerable JavaScript libraries",
      "Passive event listeners",
      "robots.txt accessible",
      "Page load time measurement",
      "Page size analysis",
    ],
  },
  {
    icon: FileText,
    color: "#f59e0b",
    bg: "#fffbeb",
    title: "Content Structure",
    description: "Content quality signals that tell search engines your page is authoritative, well-structured, and worth ranking.",
    checks: [
      "Title tag length (50–60 characters)",
      "Meta description length (140–160 characters)",
      "Heading hierarchy (H1 → H2 → H3)",
      "Content length (minimum 300 words)",
      "H1 and H2 tags both present",
      "Internal link count (3–5 minimum)",
      "Thin content detection",
      "Duplicate heading detection",
    ],
  },
  {
    icon: Camera,
    color: "#ec4899",
    bg: "#fdf2f8",
    title: "Screenshots",
    description: "Visual captures of exactly how your page renders in real browsers — desktop and mobile — during the audit.",
    checks: [
      "Desktop screenshot (1280px viewport)",
      "Mobile screenshot (390px viewport)",
      "Captured via headless Puppeteer",
      "Reflects real rendering, not simulated",
      "Visible in-app after every scan",
      "Compare desktop vs mobile layout",
    ],
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter any URL",
    desc: "Paste in any public URL — a homepage, blog post, product page, or landing page. No login required.",
  },
  {
    step: "02",
    title: "We launch a real browser",
    desc: "Puppeteer spins up a headless Chromium instance and navigates to your page exactly as a real user would.",
  },
  {
    step: "03",
    title: "Lighthouse runs a full audit",
    desc: "Google Lighthouse analyses Performance, SEO, Accessibility, and Best Practices against the latest scoring criteria.",
  },
  {
    step: "04",
    title: "Cheerio parses your HTML",
    desc: "We extract every meta tag, heading, image, link, and schema element from your page source for deep SEO analysis.",
  },
  {
    step: "05",
    title: "You get a prioritised report",
    desc: "Issues are sorted by severity. Critical fixes come first. Every issue includes why it matters, how to fix it, and expected impact.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 30% 60% at 0% 50%, #c8cdd6 0%, transparent 70%), radial-gradient(ellipse 30% 60% at 100% 50%, #c8cdd6 0%, transparent 70%), #eef1f5",
        }}
      />
      <Nav />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <span className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 mb-7">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            50+ checks across 5 audit categories
          </span>
          <h1 className="text-5xl font-extrabold tracking-[-0.04em] text-slate-900 leading-[1.08] mb-5">
            Everything your site<br />
            <span className="text-slate-400">needs audited.</span>
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
            CrawlScope runs a real Lighthouse audit combined with deep HTML analysis via Puppeteer and Cheerio — giving you actionable findings across SEO, Performance, Accessibility, Technical Health, and Content Structure.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-6 shadow-sm shadow-slate-200/50"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.bg }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h2 className="text-[15px] font-bold text-slate-900 mb-2 tracking-tight">{f.title}</h2>
                <p className="text-[12.5px] text-slate-500 leading-relaxed mb-4">{f.description}</p>
                <ul className="space-y-1.5">
                  {f.checks.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-[12px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-10">
            How it works
          </p>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200 hidden md:block" />
            <div className="space-y-8">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0 relative z-10">
                    {step.step}
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl p-4 flex-1 shadow-sm shadow-slate-200/50">
                    <p className="text-[13px] font-semibold text-slate-900 mb-1">{step.title}</p>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-8 shadow-sm shadow-slate-200/50 text-center">
            <Download className="w-8 h-8 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Export your report</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Every audit can be exported in four formats — take the report wherever you need it.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
              {[
                { fmt: "Markdown", desc: "For GitHub / Notion" },
                { fmt: "HTML", desc: "Standalone page" },
                { fmt: "PDF", desc: "Print-ready A4" },
                { fmt: "JSON", desc: "Raw data / API" },
              ].map(({ fmt, desc }) => (
                <div key={fmt} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <p className="text-[12px] font-semibold text-slate-800">{fmt}</p>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
