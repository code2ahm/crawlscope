"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AuditCheck } from "@/types/audit";

const statusConfig = {
  pass: {
    icon: CheckCircle2,
    iconClass: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-100",
    detailColor: "text-green-700",
  },
  fail: {
    icon: XCircle,
    iconClass: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
    detailColor: "text-red-700",
  },
  warn: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    detailColor: "text-amber-700",
  },
};

const expandAccents = {
  fail: { why: "#ef4444", fix: "#8b5cf6", impact: "#10b981" },
  warn: { why: "#f59e0b", fix: "#8b5cf6", impact: "#10b981" },
  pass: { why: "#22c55e", fix: "#8b5cf6", impact: "#10b981" },
};

export function CheckRow({
  check,
  categoryBadge,
}: {
  check: AuditCheck;
  categoryBadge?: React.ReactNode;
}) {
  const config = statusConfig[check.status];
  const Icon = config.icon;
  const canExpand =
    check.status !== "pass" && (check.why || check.fix || check.impact);
  const [open, setOpen] = useState(false);
  const accents = expandAccents[check.status];

  return (
    <div
      className={cn(
        "rounded-lg border mb-1.5 overflow-hidden transition-shadow duration-200",
        config.bg,
        config.border,
        canExpand && "cursor-pointer hover:shadow-sm",
      )}
      onClick={() => canExpand && setOpen((v) => !v)}
    >
      <div className="flex items-start gap-2.5 px-3 py-2.5">
        <Icon className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", config.iconClass)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[12px] font-medium text-slate-800 leading-snug">
              {check.label}
            </p>
            {categoryBadge}
          </div>
          {check.detail && (
            <p
              className={cn(
                "text-[11px] mt-0.5 font-medium",
                config.detailColor,
              )}
            >
              {check.detail}
            </p>
          )}
        </div>
        {canExpand && (
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </motion.div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-3 pb-3 pt-0 border-t border-slate-100 bg-white/60">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                {[
                  {
                    label: "Why it matters",
                    content: check.why,
                    accent: accents.why,
                  },
                  {
                    label: "Recommended fix",
                    content: check.fix,
                    accent: accents.fix,
                  },
                  {
                    label: "Expected impact",
                    content: check.impact,
                    accent: accents.impact,
                  },
                ]
                  .filter((item) => item.content)
                  .map((item) => (
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
              {check.helpUrl && (
                <a
                  href={check.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Learn more →
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
