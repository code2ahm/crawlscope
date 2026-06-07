"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Circle, Search } from "lucide-react";

interface Props {
  url: string;
}

const STEPS = [
  {
    title: "Checking SEO signals",
    detail: "Meta tags, headings, content...",
    weight: 2,
  },
  {
    title: "Analysing performance",
    detail: "LCP, CLS, INP, resources...",
    weight: 3,
  },
  {
    title: "Testing accessibility",
    detail: "WCAG, contrast, labels...",
    weight: 2,
  },
  {
    title: "Checking best practices",
    detail: "Security, HTTPS, headers...",
    weight: 2,
  },
  {
    title: "Capturing screenshots",
    detail: "Desktop and mobile previews...",
    weight: 2,
  },
  {
    title: "Generating AI report",
    detail: "Almost there...",
    weight: 3,
  },
];

const TOTAL_TICKS = STEPS.reduce((sum, step) => sum + step.weight, 0);

function getStepIndex(tick: number) {
  let cursor = 0;
  for (let i = 0; i < STEPS.length; i++) {
    cursor += STEPS[i].weight;
    if (tick < cursor) return i;
  }
  return STEPS.length - 1;
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <motion.span
      className={`block rounded-full border-2 border-blue-200 border-t-blue-500 ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function ScanLoader({ url }: Props) {
  const [tick, setTick] = useState(0);
  const domain = url.replace(/https?:\/\//i, "").split("/")[0] || "website";

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((value) => Math.min(value + 1, TOTAL_TICKS - 1));
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  const currentStep = getStepIndex(tick);
  const completedSteps = useMemo(() => {
    let cursor = 0;
    return STEPS.map((step) => {
      cursor += step.weight;
      return tick >= cursor;
    });
  }, [tick]);

  const visualProgress = Math.min(
    92,
    Math.round(((tick + 1) / TOTAL_TICKS) * 100),
  );

  return (
    <div
      className="min-h-screen px-5 py-8"
      style={{
        background:
          "radial-gradient(ellipse 38% 52% at 0% 45%, #eef2ff 0%, transparent 70%), radial-gradient(ellipse 38% 52% at 100% 45%, #e0f2fe 0%, transparent 70%), #ffffff",
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col">
        <header className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-press flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-slate-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <p className="truncate text-base font-bold text-slate-900">
            Scanning {domain}
          </p>
        </header>

        <main className="flex flex-1 flex-col items-center">
          <div className="relative mb-6 h-56 w-56">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 220 220">
              <circle
                cx="110"
                cy="110"
                r="88"
                fill="none"
                stroke="#eef2ff"
                strokeWidth="14"
              />
              <motion.circle
                cx="110"
                cy="110"
                r="88"
                fill="none"
                stroke="#7694ff"
                strokeLinecap="round"
                strokeWidth="14"
                strokeDasharray={`${2 * Math.PI * 88}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 88 * (1 - visualProgress / 100),
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </svg>
            <motion.div
              className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 shadow-2xl shadow-slate-950/25"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <Search className="h-9 w-9 text-white" />
            </motion.div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-950">
            Scanning...
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            This usually takes 30-45 seconds
          </p>

          <div className="mt-10 w-full divide-y divide-slate-100">
            {STEPS.map((step, index) => {
              const isComplete = completedSteps[index];
              const isActive = index === currentStep && !isComplete;

              return (
                <div
                  key={step.title}
                  className="grid grid-cols-[44px_1fr_32px] items-center gap-3 py-4"
                >
                  <div className="flex justify-center">
                    {isComplete ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-50 text-emerald-500">
                        <Check className="h-5 w-5" />
                      </span>
                    ) : isActive ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-50 text-blue-500">
                        <Check className="h-5 w-5" />
                      </span>
                    ) : (
                      <Circle className="h-8 w-8 text-slate-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-[15px] font-bold ${
                        isActive || isComplete
                          ? "text-slate-950"
                          : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-400">
                      {step.detail}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    {isComplete ? (
                      <motion.span
                        initial={{ scale: 0.65, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-500"
                      >
                        <Check className="h-5 w-5" />
                      </motion.span>
                    ) : isActive ? (
                      <Spinner className="h-8 w-8" />
                    ) : (
                      <span className="h-8 w-8 rounded-full border-2 border-slate-200" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto w-full pb-2 pt-8">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-blue-500"
                animate={{ width: `${visualProgress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <p className="mt-4 text-center text-sm font-bold text-slate-400">
              {visualProgress}% complete - Step {tick + 1} of {TOTAL_TICKS}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
