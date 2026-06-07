import { Suspense } from "react";
import { ScanPageInner } from "./ScanPageInner";

function ScanFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 30% 60% at 0% 50%, #c8cdd6 0%, transparent 70%), radial-gradient(ellipse 30% 60% at 100% 50%, #c8cdd6 0%, transparent 70%), #eef1f5",
      }}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<ScanFallback />}>
      <ScanPageInner />
    </Suspense>
  );
}
