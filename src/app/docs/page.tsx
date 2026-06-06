import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next";
import {
  BookOpen,
  Terminal,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Docs — CrawlScope",
  description:
    "Learn how CrawlScope works, what it scans, and how to interpret your audit report.",
};

const SECTIONS = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    color: "#3b82f6",
    content: [
      {
        heading: "What is CrawlScope?",
        body: "CrawlScope is a free website auditing tool that combines Google Lighthouse with deep HTML analysis via Puppeteer and Cheerio. Enter any public URL and get a full SEO, Performance, Accessibility, and Technical Health report in under 90 seconds.",
      },
      {
        heading: "How to run a scan",
        body: "Navigate to the homepage, paste your URL into the input field (with or without https://), and click Scan Website. CrawlScope will launch a real browser, run Lighthouse, parse your HTML, capture screenshots, and return a prioritised report.",
      },
      {
        heading: "What counts as a public URL?",
        body: "Any URL accessible without a login — homepages, blog posts, product pages, landing pages, and documentation pages all work. Pages behind authentication, localhost addresses, and IP addresses are not supported.",
      },
    ],
  },
  {
    id: "understanding-scores",
    title: "Understanding Scores",
    icon: Zap,
    color: "#8b5cf6",
    content: [
      {
        heading: "Overall Score",
        body: "A weighted average of your Lighthouse scores: Performance (30%), SEO (30%), Accessibility (20%), and Best Practices (20%). A score of 90+ is Excellent, 70–89 is Good, 50–69 Needs Work, and below 50 is Poor.",
      },
      {
        heading: "Lighthouse Categories",
        body: "Performance measures how fast your page loads and responds. SEO measures how well search engines can discover and index your content. Accessibility measures WCAG 2.1 Level AA compliance. Best Practices measures general web hygiene.",
      },
      {
        heading: "Core Web Vitals",
        body: "LCP (Largest Contentful Paint) measures load speed. CLS (Cumulative Layout Shift) measures visual stability. INP (Interaction to Next Paint) measures responsiveness. TTFB (Time to First Byte) measures server speed. FCP (First Contentful Paint) measures perceived load speed.",
      },
    ],
  },
  {
    id: "audit-checks",
    title: "Audit Checks",
    icon: CheckCircle2,
    color: "#10b981",
    content: [
      {
        heading: "SEO (12 checks)",
        body: "Title tag, meta description, H1 tag count, canonical tag, JSON-LD structured data, Open Graph tags (title, description, image), HTML lang attribute, robots meta, internal link count, and HTTPS.",
      },
      {
        heading: "Performance (11 checks)",
        body: "Render-blocking resources, next-gen image formats, image optimisation, text compression, browser caching, JavaScript minification, CSS minification, unused JavaScript, unused CSS, third-party script impact, and viewport meta tag.",
      },
      {
        heading: "Accessibility (12 checks)",
        body: "Alt text coverage, colour contrast (WCAG AA 4.5:1), HTML lang attribute, ARIA attribute validity, ARIA role validity, interactive ARIA labels, button names, link names, form input labels, skip navigation link, list structure, and focus traps.",
      },
      {
        heading: "Technical (9 checks)",
        body: "HTTPS enforcement, HTTP 200 status, canonical tag, mobile viewport, deprecated HTML elements, vulnerable JS libraries, passive event listeners, robots.txt, and page load time.",
      },
      {
        heading: "Content (6 checks)",
        body: "Title length (50–60 chars), meta description length (140–160 chars), heading hierarchy (H1→H6), word count (300+ words), H1 and H2 presence, and internal link count.",
      },
    ],
  },
  {
    id: "priority-fixes",
    title: "Priority Fixes",
    icon: AlertCircle,
    color: "#ef4444",
    content: [
      {
        heading: "What are Priority Fixes?",
        body: "The most impactful issues found during your scan, surfaced at the top of your report. Each fix includes: what the issue is, why it matters for SEO or UX, the recommended fix, and the expected impact after fixing.",
      },
      {
        heading: "Severity levels",
        body: "Critical issues have the highest impact on search visibility or user experience and should be addressed immediately. Warnings are significant but less urgent. Info items are best-practice suggestions.",
      },
      {
        heading: "How fixes are prioritised",
        body: "HTTPS issues always appear first. Missing canonical tags, missing meta descriptions, images without alt text, render-blocking resources, missing structured data, colour contrast failures, and large unused JavaScript bundles follow in decreasing severity.",
      },
    ],
  },
  {
    id: "exporting",
    title: "Exporting Reports",
    icon: Terminal,
    color: "#f59e0b",
    content: [
      {
        heading: "Markdown (.md)",
        body: "Full report formatted for GitHub, Notion, or any markdown editor. Includes scores, vitals, all audit checks, and priority fixes with tables and checklists.",
      },
      {
        heading: "HTML (.html)",
        body: "A self-contained, printable HTML page with inline styles. Opens in any browser. Useful for sharing with clients or stakeholders who don't need a live app.",
      },
      {
        heading: "PDF",
        body: "Opens your HTML export in a new window and triggers the browser print dialog set to A4 layout. Save as PDF from your browser's print menu.",
      },
      {
        heading: "JSON (.json)",
        body: "The raw AuditReport object as structured JSON. Useful for importing into your own tooling, dashboards, or CI pipelines.",
      },
    ],
  },
];

export default function DocsPage() {
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
      <main className="flex-1 max-w-5xl mx-auto px-6 pt-16 pb-24 w-full">
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 mb-6">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            Documentation
          </span>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-900 leading-tight mb-3">
            CrawlScope Docs
          </h1>
          <p className="text-base text-slate-500 max-w-xl">
            Everything you need to understand what CrawlScope scans, how scores
            are calculated, and how to act on your results.
          </p>
        </div>
        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-all"
                >
                  <s.icon
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: s.color }}
                  />
                  {s.title}
                </a>
              ))}
            </div>
          </aside>
          <div className="space-y-12">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: s.color + "18" }}
                  >
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {s.title}
                  </h2>
                </div>
                <div className="space-y-4 pl-11">
                  {s.content.map((c) => (
                    <div
                      key={c.heading}
                      className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl p-5 shadow-sm shadow-slate-200/40"
                    >
                      <h3 className="text-[13.5px] font-semibold text-slate-900 mb-2">
                        {c.heading}
                      </h3>
                      <p className="text-[12.5px] text-slate-500 leading-relaxed">
                        {c.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
