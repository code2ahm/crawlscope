"use client";

import { useRouter } from "next/navigation";
import { Search, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{
        background:
          "radial-gradient(ellipse 45% 70% at 0% 50%, #dde3ec 0%, transparent 65%), radial-gradient(ellipse 45% 70% at 100% 50%, #dde3ec 0%, transparent 65%), #f8fafc",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Search className="w-6 h-6 text-white" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-3">
          404 — Page not found
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Nothing to crawl here.
        </h1>
        <p className="text-slate-500 text-base leading-relaxed mb-10">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back to scanning.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:text-slate-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
