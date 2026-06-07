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
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 transition-colors group-hover:bg-slate-700">
              <Search className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-slate-900">
              CrawlScope
            </span>
          </Link>
          <div className="flex items-center gap-0.5 overflow-x-auto rounded-xl bg-white/45 p-1 sm:gap-1 sm:bg-transparent sm:p-0">
            {NAV_LINKS.map((l) =>
              l.external ? (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100/70 hover:text-slate-900 sm:px-3 sm:text-sm"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className={cn(
                    "btn-press whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium sm:px-3 sm:text-sm",
                    pathname === l.href
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-900",
                  )}
                >
                  {l.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </nav>
      <div className="h-14" />
    </>
  );
}
