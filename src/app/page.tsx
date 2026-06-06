"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingPage } from "@/components/LandingPage";
import { ScanLoader } from "@/components/ScanLoader";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import type { AuditReport } from "@/types/audit";

type Phase = "landing" | "scanning" | "results";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [scanUrl, setScanUrl] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  async function handleScan(url: string) {
    setScanUrl(url);
    setScanError(null);
    setPhase("scanning");
    window.history.replaceState(
      null,
      "",
      `/scan?url=${encodeURIComponent(url)}`,
    );

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Scan failed");
      }

      setReport(data.report);
      setPhase("results");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setScanError(msg);
      setPhase("landing");
      window.history.replaceState(null, "", "/");
    }
  }

  function handleReset() {
    setReport(null);
    setScanError(null);
    setScanUrl("");
    setPhase("landing");
    window.history.replaceState(null, "", "/");
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <LandingPage onScan={handleScan} initialError={scanError} />
        </motion.div>
      )}

      {phase === "scanning" && (
        <motion.div
          key="scanning"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ScanLoader url={scanUrl} />
        </motion.div>
      )}

      {phase === "results" && report && (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <ResultsDashboard
            report={report}
            onReset={handleReset}
            onRescan={() => handleScan(scanUrl)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
