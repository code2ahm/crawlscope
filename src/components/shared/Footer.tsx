import Link from "next/link";
import { Search } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/api-page" },
  {
    label: "GitHub",
    href: "https://github.com/code2ahm/crawlscope",
    external: true,
  },
  { label: "Privacy Policy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-slate-900 rounded-md flex items-center justify-center">
            <Search className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-[12px] font-semibold text-slate-700">
            CrawlScope
          </span>
          <span className="text-[11px] text-slate-400 ml-0.5">
            · See it. Fix it. Ship it.
          </span>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          {FOOTER_LINKS.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors font-medium"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors font-medium"
              >
                {l.label}
              </Link>
            ),
          )}
        </div>
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} CrawlScope
        </p>
      </div>
    </footer>
  );
}
