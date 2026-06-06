"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckRow } from "@/components/CheckRow";
import { cn } from "@/lib/utils";
import type { AuditReport, AuditCheck } from "@/types/audit";

const TABS = [
  { id: "all", label: "All" },
  { id: "seo", label: "SEO" },
  { id: "performance", label: "Performance" },
  { id: "accessibility", label: "Accessibility" },
  { id: "technical", label: "Technical" },
  { id: "content", label: "Content" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_ORDER = { fail: 0, warn: 1, pass: 2 };

function sortChecks(checks: AuditCheck[]): AuditCheck[] {
  return [...checks].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  );
}

const categoryColors: Record<string, string> = {
  seo: "bg-blue-50 text-blue-600",
  performance: "bg-purple-50 text-purple-600",
  accessibility: "bg-cyan-50 text-cyan-700",
  technical: "bg-emerald-50 text-emerald-700",
  content: "bg-amber-50 text-amber-700",
};

interface Props {
  report: AuditReport;
}

export function AuditTabs({ report }: Props) {
  const [active, setActive] = useState<TabId>("seo");

  const checkMap: Record<Exclude<TabId, "all">, AuditCheck[]> = {
    seo: report.seoChecks,
    performance: report.performanceChecks,
    accessibility: report.accessibilityChecks,
    technical: report.technicalChecks,
    content: report.contentChecks,
  };

  const allChecks: AuditCheck[] = sortChecks([
    ...report.seoChecks,
    ...report.performanceChecks,
    ...report.accessibilityChecks,
    ...report.technicalChecks,
    ...report.contentChecks,
  ]);

  const checks = active === "all" ? allChecks : sortChecks(checkMap[active]);

  const passed = checks.filter((c) => c.status === "pass").length;
  const failed = checks.filter((c) => c.status === "fail").length;
  const warned = checks.filter((c) => c.status === "warn").length;

  const categoryLabel: Record<string, string> = {};
  Object.entries(checkMap).forEach(([cat, catChecks]) => {
    catChecks.forEach((c) => {
      categoryLabel[c.id] = cat;
    });
  });

  return (
    <div>
      <div className="relative flex overflow-x-auto scrollbar-none border-b border-slate-100 mb-5 -mx-0.5 px-0.5">
        {TABS.map((tab) => {
          const tabChecks =
            tab.id === "all"
              ? allChecks
              : checkMap[tab.id as Exclude<TabId, "all">];
          const issues = tabChecks.filter((c) => c.status !== "pass").length;
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150",
                isActive
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              {tab.label}
              {issues > 0 && (
                <span
                  className={cn(
                    "text-[9.5px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center transition-colors duration-150",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-red-100 text-red-600",
                  )}
                >
                  {issues}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="audit-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: "Passed", value: passed, cls: "bg-green-50 text-green-700" },
          {
            label: "Warnings",
            value: warned,
            cls: "bg-amber-50 text-amber-700",
          },
          { label: "Failed", value: failed, cls: "bg-red-50 text-red-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.cls}`}>
            <p className="text-xl font-bold leading-none mb-1">{s.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          {checks.map((c) => (
            <CheckRow
              key={c.id}
              check={c}
              categoryBadge={
                active === "all" ? (
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize",
                      categoryColors[categoryLabel[c.id]] ??
                        "bg-slate-100 text-slate-500",
                    )}
                  >
                    {categoryLabel[c.id]}
                  </span>
                ) : undefined
              }
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
