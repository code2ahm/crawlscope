"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Screenshots } from "@/types/audit";

interface Props {
  screenshots: Screenshots;
}

export function ScreenshotsSection({ screenshots }: Props) {
  const [active, setActive] = useState<"desktop" | "mobile">("desktop");

  if (!screenshots.desktop && !screenshots.mobile) return null;

  const src = active === "desktop" ? screenshots.desktop : screenshots.mobile;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {(["desktop", "mobile"] as const).map((mode) => {
          const Icon = mode === "desktop" ? Monitor : Smartphone;
          return (
            <button
              key={mode}
              onClick={() => setActive(mode)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                active === mode
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="capitalize">{mode}</span>
            </button>
          );
        })}
      </div>

      {src ? (
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="bg-slate-100 px-3 py-2 flex items-center gap-2 border-b border-slate-200">
            <div className="flex gap-1.5">
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                <div
                  key={c}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex-1 bg-white rounded-md h-5 flex items-center px-2">
              <span className="text-[10px] text-slate-400">
                screenshot captured during audit
              </span>
            </div>
          </div>
          <img
            src={src}
            alt={`${active} screenshot`}
            className="w-full object-cover object-top"
            style={{ maxHeight: active === "desktop" ? 500 : 700 }}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
          Screenshot not available for this view.
        </div>
      )}
    </div>
  );
}
