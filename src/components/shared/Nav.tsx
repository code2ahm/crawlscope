"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/api-page" },
  {
    label: "GitHub",
    href: "https://github.com/code2ahm/crawlscope",
    external: true,
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-200/60 bg-white/75 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
            <Search className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[15px] font-bold text-slate-900 tracking-tight">
            CrawlScope
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors rounded-lg hover:bg-slate-100/60"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors rounded-lg",
                  pathname === l.href
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60",
                )}
              >
                {l.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
