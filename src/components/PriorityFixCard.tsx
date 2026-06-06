"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PriorityFix } from "@/types/audit";

const severityConfig = {
  critical: {
    borderColor: "#ef4444",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
    label: "Critical",
  },
  warning: {
    borderColor: "#f59e0b",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    label: "Warning",
  },
  info: {
    borderColor: "#3b82f6",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    label: "Info",
  },
};

const categoryColors: Record<string, string> = {
  seo: "#3b82f6",
  performance: "#8b5cf6",
  accessibility: "#06b6d4",
  technical: "#10b981",
  content: "#f59e0b",
};

interface Props {
  fix: PriorityFix;
  defaultOpen?: boolean;
}

export function PriorityFixCard({ fix, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const sev = severityConfig[fix.severity];

  return (
    <div
      className="rounded-xl border overflow-hidden cursor-pointer hover:shadow-sm transition-shadow duration-200"
      style={{
        borderTopColor: open ? sev.borderColor + "50" : "#e2e8f0",
        borderRightColor: open ? sev.borderColor + "50" : "#e2e8f0",
        borderBottomColor: open ? sev.borderColor + "50" : "#e2e8f0",
        borderLeftColor: sev.borderColor,
        borderLeftWidth: 3,
        transition: "border-color 0.2s ease",
      }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-white">
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-slate-900 mb-1 leading-snug">
            {fix.title}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md",
                sev.badgeBg,
                sev.badgeText,
              )}
            >
              {sev.label}
            </span>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-50 capitalize"
              style={{ color: categoryColors[fix.category] ?? "#64748b" }}
            >
              {fix.category}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 pt-3 bg-white border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    label: "Why it matters",
                    content: fix.why,
                    accent: "#3b82f6",
                  },
                  {
                    label: "Recommended fix",
                    content: fix.fix,
                    accent: "#8b5cf6",
                  },
                  {
                    label: "Expected impact",
                    content: fix.impact,
                    accent: "#10b981",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-slate-50 rounded-lg p-2.5"
                  >
                    <p
                      className="text-[9.5px] font-semibold uppercase tracking-wider mb-1"
                      style={{ color: item.accent }}
                    >
                      {item.label}
                    </p>
                    <p className="text-[11.5px] text-slate-700 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
