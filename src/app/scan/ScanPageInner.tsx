"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ScanLoader } from "@/components/ScanLoader";
import type { AuditReport, ScanErrorCode, ScanResponse } from "@/types/audit";

async function readScanResponse(res: Response): Promise<ScanResponse> {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  const text = await res.text();
  const detail = text.trim().slice(0, 180);

  return {
    success: false,
    error:
      detail ||
      `Scan failed with HTTP ${res.status}. The server returned a non-JSON response.`,
    errorCode: "scan_failed",
  };
}

export function ScanPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const url = params.get("url") ?? "";
  const t = params.get("t");

  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ScanErrorCode | null>(null);
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
    setErrorCode(null);

    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then(async (res) => {
        const data = await readScanResponse(res);

        if (!res.ok || !data.success) {
          setErrorCode(data.errorCode ?? "scan_failed");
          throw new Error(data.error ?? `Scan failed with HTTP ${res.status}`);
        }

        if (!data.report) {
          setErrorCode("scan_failed");
          throw new Error("Scan completed without a report payload.");
        }

        setReport(data.report);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, [router, t, url]);

  if (error) {
    const isHumanVerification = errorCode === "human_verification";

    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center"
        style={{
          background:
            "radial-gradient(ellipse 45% 70% at 0% 50%, #dde3ec 0%, transparent 65%), radial-gradient(ellipse 45% 70% at 100% 50%, #dde3ec 0%, transparent 65%), #f8fafc",
        }}
      >
        <div className="w-full max-w-sm rounded-2xl border border-white/75 bg-white/80 p-8 shadow-lg shadow-slate-200/60 backdrop-blur-sm">
          <div
            className={`mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
              isHumanVerification ? "bg-amber-100" : "bg-red-100"
            }`}
          >
            <span
              className={`text-lg font-bold ${
                isHumanVerification ? "text-amber-600" : "text-red-500"
              }`}
            >
              !
            </span>
          </div>

          <p className="mb-1 font-semibold text-slate-900">
            {isHumanVerification
              ? "Human verification detected"
              : "Scan failed"}
          </p>
          <p className="mb-5 text-sm leading-relaxed text-slate-500">
            {error}
          </p>
          <button
            onClick={() => router.replace("/")}
            className="btn-press w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Return home
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
