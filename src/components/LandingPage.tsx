"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  Shield,
  Eye,
  Code2,
  ArrowRight,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onScan: (url: string) => void;
  initialError?: string | null;
}

const features = [
  {
    icon: Search,
    title: "SEO Analysis",
    color: "#3b82f6",
    bg: "#eff6ff",
    items: [
      "Meta tags & titles",
      "Structured data (JSON-LD)",
      "Indexability & canonicals",
      "Open Graph coverage",
    ],
  },
  {
    icon: Zap,
    title: "Performance",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    items: [
      "Full Lighthouse audit",
      "Core Web Vitals (LCP, CLS, INP)",
      "Resource optimisation",
      "Render-blocking detection",
    ],
  },
  {
    icon: Eye,
    title: "Accessibility",
    color: "#06b6d4",
    bg: "#ecfeff",
    items: [
      "Alt text coverage",
      "Colour contrast (WCAG AA)",
      "Semantic HTML structure",
      "ARIA attribute validity",
    ],
  },
  {
    icon: Shield,
    title: "Technical Health",
    color: "#10b981",
    bg: "#ecfdf5",
    items: [
      "HTTPS enforcement",
      "Broken link detection",
      "Crawlability signals",
      "Security headers check",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function LandingPage({ onScan, initialError }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(initialError ?? null);

  function handleSubmit(inputUrl?: string) {
    let u = (inputUrl ?? url).trim();
    if (!u) {
      setError("Please enter a website URL.");
      return;
    }
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    try {
      new URL(u);
    } catch {
      setError("Please enter a valid URL, e.g. https://example.com");
      return;
    }
    setError(null);
    onScan(u);
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 30% 60% at 0% 50%, #c8cdd6 0%, transparent 70%), radial-gradient(ellipse 30% 60% at 100% 50%, #c8cdd6 0%, transparent 70%), #eef1f5",
        }}
      />
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold text-slate-900 tracking-tight">
              CrawlScope
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="/features"
              className="relative text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-slate-900 after:transition-all after:duration-300 hover:after:w-full"
            >
              Features
            </a>

            <a
              href="/docs"
              className="relative text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-slate-900 after:transition-all after:duration-300 hover:after:w-full"
            >
              Docs
            </a>

            <a
              href="https://github.com/code2ahm/crawlscope"
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-slate-900 after:transition-all after:duration-300 hover:after:w-full"
            >
              GitHub
            </a>

            <a
              href="/api-page"
              className="relative text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-slate-900 after:transition-all after:duration-300 hover:after:w-full"
            >
              API
            </a>
          </div>
        </div>
      </nav>

      <motion.section
        className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Free · No signup · Instant results
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-6xl font-extrabold tracking-[-0.04em] text-slate-900 leading-[1.08] mb-5"
        >
          Your site is
          <br />
          <span className="text-slate-400">leaking traffic.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-slate-500 leading-relaxed max-w-lg mx-auto mb-10"
        >
          Scan any website and discover the issues affecting search visibility,
          performance, accessibility, and user experience.
        </motion.p>

        <motion.div variants={itemVariants} className="max-w-xl mx-auto">
          <div
            className={cn(
              "flex overflow-hidden rounded-2xl border-2 shadow-lg shadow-slate-100 bg-white",
              error
                ? "border-red-400"
                : "border-slate-200 focus-within:border-slate-400",
            )}
          >
            <div className="flex items-center pl-4 text-slate-400">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 px-3 py-4 text-[15px] outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSubmit()}
              className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white text-sm font-semibold rounded-xl m-1 hover:bg-slate-800 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              Scan Website
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-2 text-left px-1">{error}</p>
          )}
          <p className="text-xs text-slate-400 mt-3">
            Try:{" "}
            {["vercel.com", "stripe.com", "linear.app"].map((d, i) => (
              <span key={d}>
                <button
                  onClick={() => handleSubmit("https://" + d)}
                  className="text-black-500 hover:text-blue-700 underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-xs"
                >
                  {d}
                </button>
                {i < 2 && <span className="mx-1.5 text-slate-300">·</span>}
              </span>
            ))}
          </p>
        </motion.div>
      </motion.section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-8">
          What we analyse
        </p>
        <div className="grid grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4 + i * 0.08,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:shadow-sm transition-all"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.bg }}
              >
                <f.icon className="w-4.5 h-4.5" style={{ color: f.color }} />
              </div>
              <p className="text-sm font-bold text-slate-900 mb-3">{f.title}</p>
              {f.items.map((item) => (
                <p
                  key={item}
                  className="text-xs text-slate-500 mb-1.5 flex items-start gap-1.5"
                >
                  <span
                    style={{ color: f.color }}
                    className="mt-0.5 font-bold shrink-0"
                  >
                    ·
                  </span>
                  {item}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-8">
          Sample audit report
        </p>
        <MockDashboard />
      </section>

      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-slate-900 rounded-md flex items-center justify-center">
              <Search className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">CrawlScope</span>
            <span className="text-xs text-slate-400 ml-1">
              See it. Fix it. Ship it!
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="/features"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Features
            </a>

            <a
              href="/docs"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Docs
            </a>

            <a
              href="https://github.com/code2ahm/crawlscope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              GitHub
            </a>

            <a
              href="/api-page"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              API
            </a>

            <a
              href="/privacy"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MockDashboard() {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
      <div className="bg-white border-b border-gray-200 px-5 h-11 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-600 font-medium">
            https://example.com
          </span>
          <span className="text-xs text-gray-400 hidden sm:block">
            · just now
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-lg">
            Re-scan
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-white bg-gray-900 rounded-lg">
            + New Scan
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="10"
                    strokeDasharray={`${0.84 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-gray-900">84</span>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center px-2 py-0.5 rounded-lg text-white text-[11px] font-bold mb-1 bg-emerald-500">
                  Good
                </div>
                <p className="text-xl font-black text-gray-900">
                  84
                  <span className="text-xs font-medium text-gray-400">
                    /100
                  </span>
                </p>
                <p className="text-[10px] text-gray-400">Total Evaluation</p>
                <div className="flex items-center gap-2.5 mt-1.5 text-[11px]">
                  <span className="text-red-500 font-semibold">2 critical</span>
                  <span className="text-amber-500 font-semibold">
                    3 warnings
                  </span>
                  <span className="text-emerald-600 font-semibold">
                    28 passing
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-gray-100 self-stretch" />

            <div className="flex-1 grid grid-cols-4 gap-3">
              {[
                { label: "Performance", score: 71, color: "#f59e0b" },
                { label: "SEO", score: 92, color: "#22c55e" },
                { label: "Accessibility", score: 68, color: "#f97316" },
                { label: "Best Practices", score: 87, color: "#22c55e" },
              ].map(({ label, score, color }) => {
                const r = 28;
                const circ = 2 * Math.PI * r;
                return (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="relative w-14 h-14">
                      <svg
                        viewBox="0 0 70 70"
                        className="w-full h-full -rotate-90"
                      >
                        <circle
                          cx="35"
                          cy="35"
                          r={r}
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="7"
                        />
                        <circle
                          cx="35"
                          cy="35"
                          r={r}
                          fill="none"
                          stroke={color}
                          strokeWidth="7"
                          strokeDasharray={`${(score / 100) * circ} ${circ}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-black" style={{ color }}>
                          {score}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 text-center font-medium leading-tight">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="hidden sm:block w-px bg-gray-100 self-stretch" />

            <div className="flex flex-col gap-2 shrink-0 text-xs">
              {[
                ["Load time", "1.8s"],
                ["Page size", "342 KB"],
                ["Scan time", "12.4s"],
              ].map(([l, v]) => (
                <div key={l} className="flex items-center gap-2">
                  <span className="text-gray-400 w-16">{l}</span>
                  <span className="font-semibold text-gray-700">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-4">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    Priority Fixes
                  </span>
                  <span className="bg-red-100 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    2
                  </span>
                </div>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                {[
                  {
                    title: "Missing Canonical Tags",
                    sev: "CRITICAL",
                    sevColor: "text-red-700",
                    sevBg: "bg-red-50",
                    cat: "seo",
                    border: "#ef4444",
                  },
                  {
                    title: "No Structured Data (Schema.org)",
                    sev: "WARNING",
                    sevColor: "text-amber-700",
                    sevBg: "bg-amber-50",
                    cat: "seo",
                    border: "#f59e0b",
                  },
                ].map(({ title, sev, sevColor, sevBg, cat, border }) => (
                  <div
                    key={title}
                    className="rounded-xl border overflow-hidden"
                    style={{
                      borderTopColor: "#e2e8f0",
                      borderRightColor: "#e2e8f0",
                      borderBottomColor: "#e2e8f0",
                      borderLeftColor: border,
                      borderLeftWidth: 3,
                    }}
                  >
                    <div className="flex items-center gap-3 px-4 py-3 bg-white">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 mb-1">
                          {title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md ${sevBg} ${sevColor}`}
                          >
                            {sev}
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-blue-500 capitalize">
                            {cat}
                          </span>
                        </div>
                      </div>
                      <Code2 className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex gap-1.5 flex-wrap mb-4">
                {[
                  { label: "SEO", issues: 6, active: true },
                  { label: "Performance", issues: 0, active: false },
                  { label: "Accessibility", issues: 1, active: false },
                  { label: "Technical", issues: 2, active: false },
                  { label: "Content", issues: 2, active: false },
                ].map(({ label, issues, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium border ${active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}
                  >
                    {label}
                    {issues > 0 && (
                      <span
                        className={`text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${active ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}
                      >
                        {issues}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {[
                  ["6", "Passed", "bg-green-50 text-green-700"],
                  ["4", "Warnings", "bg-amber-50 text-amber-700"],
                  ["2", "Failed", "bg-red-50 text-red-700"],
                ].map(([v, l, cls]) => (
                  <div key={l} className={`rounded-xl p-3 text-center ${cls}`}>
                    <p className="text-2xl font-bold leading-none mb-1">{v}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
                      {l}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Title tag present and non-empty", status: "pass" },
                  { label: "Meta description present", status: "pass" },
                  {
                    label: "Single H1 tag",
                    detail: "17 H1 tags found — use exactly one",
                    status: "warn",
                  },
                  {
                    label: "Canonical tag",
                    detail: "No <link rel='canonical'> found",
                    status: "fail",
                  },
                  {
                    label: "Structured data (JSON-LD)",
                    detail: "No JSON-LD schema markup found",
                    status: "fail",
                  },
                ].map(({ label, detail, status }) => {
                  const cfg = {
                    pass: {
                      bg: "bg-green-50",
                      border: "border-green-100",
                      icon: "✓",
                      iconColor: "text-green-500",
                      detailColor: "text-green-700",
                    },
                    warn: {
                      bg: "bg-amber-50",
                      border: "border-amber-100",
                      icon: "⚠",
                      iconColor: "text-amber-500",
                      detailColor: "text-amber-700",
                    },
                    fail: {
                      bg: "bg-red-50",
                      border: "border-red-100",
                      icon: "✕",
                      iconColor: "text-red-500",
                      detailColor: "text-red-700",
                    },
                  }[status]!;
                  return (
                    <div
                      key={label}
                      className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border ${cfg.bg} ${cfg.border}`}
                    >
                      <span
                        className={`text-sm font-bold mt-0.5 shrink-0 ${cfg.iconColor}`}
                      >
                        {cfg.icon}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {label}
                        </p>
                        {detail && (
                          <p
                            className={`text-xs mt-0.5 font-medium ${cfg.detailColor}`}
                          >
                            {detail}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                Core Web Vitals
              </h2>
              <div className="space-y-2.5">
                {[
                  {
                    key: "LCP",
                    label: "Largest Contentful Paint",
                    value: "2.4",
                    unit: "s",
                    status: "good",
                    color: "#16a34a",
                    badge: "Good",
                    badgeCls: "bg-green-50 text-green-700",
                  },
                  {
                    key: "CLS",
                    label: "Cumulative Layout Shift",
                    value: "0.08",
                    unit: "",
                    status: "good",
                    color: "#16a34a",
                    badge: "Good",
                    badgeCls: "bg-green-50 text-green-700",
                  },
                  {
                    key: "INP",
                    label: "Interaction to Next Paint",
                    value: "310",
                    unit: "ms",
                    status: "warn",
                    color: "#d97706",
                    badge: "Needs Improvement",
                    badgeCls: "bg-amber-50 text-amber-700",
                  },
                  {
                    key: "TTFB",
                    label: "Time to First Byte",
                    value: "0.9",
                    unit: "s",
                    status: "warn",
                    color: "#d97706",
                    badge: "Needs Improvement",
                    badgeCls: "bg-amber-50 text-amber-700",
                  },
                  {
                    key: "FCP",
                    label: "First Contentful Paint",
                    value: "1.6",
                    unit: "s",
                    status: "good",
                    color: "#16a34a",
                    badge: "Good",
                    badgeCls: "bg-green-50 text-green-700",
                  },
                ].map(({ key, label, value, unit, color, badge, badgeCls }) => (
                  <div
                    key={key}
                    className="bg-white rounded-2xl p-3.5 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {key}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {label}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg ${badgeCls}`}
                      >
                        {badge}
                      </span>
                    </div>
                    <p
                      className="text-2xl font-black leading-none"
                      style={{ color }}
                    >
                      {value}
                      <span className="text-sm font-medium ml-0.5 opacity-60">
                        {unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
