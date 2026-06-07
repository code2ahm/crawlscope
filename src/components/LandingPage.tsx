"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Zap, Shield, Eye, ArrowRight, Globe } from "lucide-react";
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

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/docs", label: "Docs" },
  { href: "https://github.com/code2ahm/crawlscope", label: "GitHub" },
  { href: "/api-page", label: "API" },
];

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
              <Search className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold text-slate-900">
              CrawlScope
            </span>
          </a>

          <div className="hidden items-center gap-6 sm:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("https://") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("https://")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="relative text-sm font-medium text-slate-500 transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-slate-900 after:transition-all after:duration-300 hover:text-slate-900 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <motion.section
        className="mx-auto max-w-3xl px-4 pb-12 pt-14 text-center sm:px-6 sm:pb-16 sm:pt-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            Free - No signup - Instant results
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mb-5 text-4xl font-extrabold leading-[1.08] text-slate-900 sm:text-6xl"
        >
          Your site is
          <br />
          <span className="text-slate-400">leaking traffic.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-slate-500 sm:mb-10 sm:text-lg"
        >
          Scan any website and discover the issues affecting search visibility,
          performance, accessibility, and user experience.
        </motion.p>

        <motion.div variants={itemVariants} className="mx-auto max-w-xl">
          <div
            className={cn(
              "flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-lg shadow-slate-100 sm:flex-row",
              error
                ? "border-red-400"
                : "border-slate-200 focus-within:border-slate-400",
            )}
          >
            <div className="hidden items-center pl-4 text-slate-400 sm:flex">
              <Globe className="h-4 w-4" />
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
              className="min-w-0 flex-1 bg-transparent px-4 py-4 text-[15px] text-slate-900 outline-none placeholder:text-slate-400 sm:px-3"
            />
            <button
              onClick={() => handleSubmit()}
              className="btn-press m-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 sm:py-4"
            >
              Scan Website
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {error && (
            <p className="mt-2 px-1 text-left text-sm text-red-500">{error}</p>
          )}
          <p className="mt-3 text-xs text-slate-400">
            Try:{" "}
            {["vercel.com", "stripe.com", "linear.app"].map((d, i) => (
              <span key={d}>
                <button
                  onClick={() => handleSubmit("https://" + d)}
                  className="btn-press cursor-pointer border-none bg-transparent p-0 text-xs text-slate-700 underline underline-offset-2 hover:text-blue-700"
                >
                  {d}
                </button>
                {i < 2 && <span className="mx-1.5 text-slate-300">-</span>}
              </span>
            ))}
          </p>
        </motion.div>
      </motion.section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">
        <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          What we analyse
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              className="rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-200 hover:shadow-md"
            >
              <div
                className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: f.bg }}
              >
                <f.icon className="h-4.5 w-4.5" style={{ color: f.color }} />
              </div>
              <p className="mb-3 text-sm font-bold text-slate-900">
                {f.title}
              </p>
              {f.items.map((item) => (
                <p
                  key={item}
                  className="mb-1.5 flex items-start gap-1.5 text-xs text-slate-500"
                >
                  <span
                    style={{ color: f.color }}
                    className="mt-0.5 shrink-0 font-bold"
                  >
                    -
                  </span>
                  {item}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-24">
        <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          Sample audit report
        </p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70"
        >
          <img
            src="/saas.png"
            alt="CrawlScope sample audit report"
            className="block h-auto w-full"
          />
        </motion.div>
      </section>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900">
              <Search className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">CrawlScope</span>
            <span className="ml-1 text-xs text-slate-400">
              See it. Fix it. Ship it!
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {[...navLinks, { href: "/privacy", label: "Privacy Policy" }].map(
              (link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={
                    link.href.startsWith("https://") ? "_blank" : undefined
                  }
                  rel={
                    link.href.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
