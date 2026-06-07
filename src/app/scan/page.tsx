"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ScanLoader } from "@/components/ScanLoader";
import type { AuditReport } from "@/types/audit";

export default function ScanPage() {
  const params = useSearchParams();
  const router = useRouter();
  const url = params.get("url") ?? "";
  const t = params.get("t");

  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastScanned = useRef<string>("");

  useEffect(() => {
    if (!url) {
      router.replace("/");
      return;
    }

    const scanKey = `${url}__${t ?? "0"}`;
    if (lastScanned.current === scanKey) return;
    lastScanned.current = scanKey;

    setReport(null);
    setError(null);

    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!data.success) throw new Error(data.error ?? "Scan failed");
        setReport(data.report);
      })
      .catch((err: Error) => setError(err.message));
  }, [url, t]);

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center"
        style={{
          background:
            "radial-gradient(ellipse 45% 70% at 0% 50%, #dde3ec 0%, transparent 65%), radial-gradient(ellipse 45% 70% at 100% 50%, #dde3ec 0%, transparent 65%), #f8fafc",
        }}
      >
        <div className="bg-white/70 backdrop-blur-sm border border-white/75 rounded-2xl p-8 max-w-sm w-full shadow-sm">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-lg">✕</span>
          </div>
          <p className="text-slate-900 font-semibold mb-1">Scan failed</p>
          <p className="text-slate-500 text-sm mb-5 leading-relaxed">{error}</p>
          <button
            onClick={() => router.replace("/")}
            className="btn-press w-full px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800"
          >
            Try another URL
          </button>
        </div>
      </div>
    );
  }

  if (!report) return <ScanLoader url={url} />;

  return (
    <ResultsDashboard
      report={report}
      onReset={() => router.replace("/")}
      onRescan={() =>
        router.push(`/scan?url=${encodeURIComponent(url)}&t=${Date.now()}`)
      }
    />
  );
}
