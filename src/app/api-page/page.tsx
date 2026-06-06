import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next";
import { Terminal, Code2, Zap, Lock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "API — CrawlScope",
  description:
    "CrawlScope API reference — scan any URL programmatically and receive structured audit data.",
};

const codeBlock = (code: string) => code.trim();

export default function ApiPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 30% 60% at 0% 50%, #c8cdd6 0%, transparent 70%), radial-gradient(ellipse 30% 60% at 100% 50%, #c8cdd6 0%, transparent 70%), #eef1f5",
        }}
      />
      <Nav />

      <main className="flex-1 max-w-4xl mx-auto px-6 pt-16 pb-24 w-full">
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 mb-6">
            <Terminal className="w-3.5 h-3.5 text-purple-500" />
            REST API
          </span>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-900 leading-tight mb-3">
            CrawlScope API
          </h1>
          <p className="text-base text-slate-500 max-w-xl">
            One endpoint. POST a URL. Get a complete structured audit report
            back as JSON. No key required for self-hosted instances.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-6 shadow-sm shadow-slate-200/40">
            <div className="flex items-center gap-2.5 mb-4">
              <Globe className="w-4 h-4 text-blue-500" />
              <h2 className="text-[14px] font-bold text-slate-900">Endpoint</h2>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm">
              <span className="text-emerald-400 font-bold">POST</span>
              <span className="text-white ml-3">/api/scan</span>
            </div>
            <p className="text-[12.5px] text-slate-500 mt-3">
              Accepts a JSON body, launches a real Chromium browser, runs a full
              Lighthouse audit, parses the HTML with Cheerio, captures
              screenshots, and returns a structured{" "}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 text-[11px]">
                AuditReport
              </code>{" "}
              object.
            </p>
          </section>

          <section className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-6 shadow-sm shadow-slate-200/40">
            <div className="flex items-center gap-2.5 mb-4">
              <Code2 className="w-4 h-4 text-purple-500" />
              <h2 className="text-[14px] font-bold text-slate-900">Request</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Headers
                </p>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[12.5px]">
                  <span className="text-slate-400">Content-Type: </span>
                  <span className="text-amber-300">application/json</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Body
                </p>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[12.5px] leading-relaxed">
                  <span className="text-slate-400">{"{"}</span>
                  <br />
                  <span className="text-slate-400 ml-4">&quot;url&quot;: </span>
                  <span className="text-emerald-400">
                    &quot;https://example.com&quot;
                  </span>
                  <br />
                  <span className="text-slate-400">{"}"}</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Example — fetch
                </p>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[12px] leading-relaxed overflow-x-auto">
                  <span className="text-blue-400">const</span>
                  <span className="text-white"> res </span>
                  <span className="text-slate-400">= </span>
                  <span className="text-blue-400">await </span>
                  <span className="text-yellow-300">fetch</span>
                  <span className="text-white">(</span>
                  <span className="text-emerald-400">
                    &quot;/api/scan&quot;
                  </span>
                  <span className="text-white">, {"{"}</span>
                  <br />
                  <span className="text-white ml-4">method: </span>
                  <span className="text-emerald-400">&quot;POST&quot;</span>
                  <span className="text-white">,</span>
                  <br />
                  <span className="text-white ml-4">headers: {"{ "}</span>
                  <span className="text-emerald-400">
                    &quot;Content-Type&quot;
                  </span>
                  <span className="text-white">: </span>
                  <span className="text-emerald-400">
                    &quot;application/json&quot;
                  </span>
                  <span className="text-white"> {"}"},</span>
                  <br />
                  <span className="text-white ml-4">body: </span>
                  <span className="text-yellow-300">JSON</span>
                  <span className="text-white">.</span>
                  <span className="text-yellow-300">stringify</span>
                  <span className="text-white">({"{ "}url: </span>
                  <span className="text-emerald-400">
                    &quot;https://example.com&quot;
                  </span>
                  <span className="text-white"> {"}"}),</span>
                  <br />
                  <span className="text-white">{"}"});</span>
                  <br />
                  <br />
                  <span className="text-blue-400">const</span>
                  <span className="text-white">
                    {" "}
                    {"{ success, report, error }"}{" "}
                  </span>
                  <span className="text-slate-400">= </span>
                  <span className="text-blue-400">await </span>
                  <span className="text-white">res.</span>
                  <span className="text-yellow-300">json</span>
                  <span className="text-white">();</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-6 shadow-sm shadow-slate-200/40">
            <div className="flex items-center gap-2.5 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="text-[14px] font-bold text-slate-900">Response</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Success (200)
                </p>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[12px] leading-relaxed overflow-x-auto">
                  <span className="text-slate-400">{"{"}</span>
                  <br />
                  <span className="text-blue-300 ml-4">
                    &quot;success&quot;
                  </span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-400">true</span>
                  <span className="text-slate-400">,</span>
                  <br />
                  <span className="text-blue-300 ml-4">&quot;report&quot;</span>
                  <span className="text-slate-400">: {"{"}</span>
                  <br />
                  <span className="text-blue-300 ml-8">&quot;url&quot;</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-400">
                    &quot;https://example.com&quot;
                  </span>
                  <span className="text-slate-400">,</span>
                  <br />
                  <span className="text-blue-300 ml-8">&quot;domain&quot;</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-400">
                    &quot;example.com&quot;
                  </span>
                  <span className="text-slate-400">,</span>
                  <br />
                  <span className="text-blue-300 ml-8">
                    &quot;overall&quot;
                  </span>
                  <span className="text-slate-400">: </span>
                  <span className="text-amber-300">84</span>
                  <span className="text-slate-400">,</span>
                  <br />
                  <span className="text-blue-300 ml-8">
                    &quot;lighthouse&quot;
                  </span>
                  <span className="text-slate-400">
                    : {"{ performance, seo, accessibility, bestPractices }"},
                  </span>
                  <br />
                  <span className="text-blue-300 ml-8">&quot;vitals&quot;</span>
                  <span className="text-slate-400">
                    : {"{ lcp, cls, inp, ttfb, fcp }"},
                  </span>
                  <br />
                  <span className="text-blue-300 ml-8">&quot;stats&quot;</span>
                  <span className="text-slate-400">
                    : {"{ critical, warnings, passed, total }"},
                  </span>
                  <br />
                  <span className="text-blue-300 ml-8">
                    &quot;priorityFixes&quot;
                  </span>
                  <span className="text-slate-400">: </span>
                  <span className="text-white">[...],</span>
                  <br />
                  <span className="text-blue-300 ml-8">
                    &quot;seoChecks&quot;
                  </span>
                  <span className="text-slate-400">: </span>
                  <span className="text-white">[...],</span>
                  <br />
                  <span className="text-blue-300 ml-8">
                    &quot;screenshots&quot;
                  </span>
                  <span className="text-slate-400">
                    : {"{ desktop, mobile }"},
                  </span>
                  <br />
                  <span className="text-blue-300 ml-8">&quot;meta&quot;</span>
                  <span className="text-slate-400">
                    : {"{ title, description, h1, wordCount, ... }"}
                  </span>
                  <br />
                  <span className="text-slate-400 ml-4">{"}"}</span>
                  <br />
                  <span className="text-slate-400">{"}"}</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Error (400 / 500)
                </p>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[12px] leading-relaxed">
                  <span className="text-slate-400">{"{"}</span>
                  <br />
                  <span className="text-blue-300 ml-4">
                    &quot;success&quot;
                  </span>
                  <span className="text-slate-400">: </span>
                  <span className="text-red-400">false</span>
                  <span className="text-slate-400">,</span>
                  <br />
                  <span className="text-blue-300 ml-4">&quot;error&quot;</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-400">
                    &quot;Invalid URL&quot;
                  </span>
                  <br />
                  <span className="text-slate-400">{"}"}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-6 shadow-sm shadow-slate-200/40">
            <div className="flex items-center gap-2.5 mb-4">
              <Lock className="w-4 h-4 text-emerald-500" />
              <h2 className="text-[14px] font-bold text-slate-900">Notes</h2>
            </div>
            <ul className="space-y-3">
              {[
                "Scans take 30–90 seconds depending on the target site's performance.",
                "Screenshots are returned as base64-encoded JPEG data URIs.",
                "The endpoint runs server-side only — Puppeteer and Lighthouse require Node.js with a Chromium binary.",
                "For self-hosted deployments, no API key is required. The endpoint is open by default.",
                "Set a request timeout of at least 120 seconds in your HTTP client to account for slow target sites.",
                "Screenshots add ~200–400 KB to the response payload. Parse JSON server-side if possible.",
              ].map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-2.5 text-[12.5px] text-slate-500"
                >
                  <span className="text-emerald-500 font-bold mt-0.5 shrink-0">
                    ·
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
