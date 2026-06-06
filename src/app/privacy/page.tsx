import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — CrawlScope",
  description: "CrawlScope privacy policy — what data we collect, how we use it, and how we protect it.",
};

const SECTIONS = [
  {
    title: "What we scan",
    body: "When you enter a URL, CrawlScope uses a headless Chromium browser (Puppeteer) to visit that page as a regular user would. We analyse the page's HTML, run a Lighthouse audit, and capture screenshots. We do not interact with forms, log in to accounts, or access any pages beyond the URL you provide.",
  },
  {
    title: "What data we collect",
    body: "We do not require an account, email address, or any personal information to use CrawlScope. The only data we process is the URL you submit. Audit results are returned directly to your browser and are not stored on our servers after the response is sent.",
  },
  {
    title: "Screenshots",
    body: "Desktop and mobile screenshots captured during a scan are included in the scan response payload and displayed in your browser. They are not stored or logged server-side. If you use the Export feature, screenshots are embedded directly in the downloaded file on your device.",
  },
  {
    title: "Third-party services",
    body: "CrawlScope does not use advertising networks, analytics trackers, or third-party cookies. Lighthouse audits run entirely server-side within our infrastructure and do not transmit data to Google or any third party.",
  },
  {
    title: "Server logs",
    body: "Like all web servers, ours may record standard access logs including IP address, timestamp, and the URL path requested (e.g. /api/scan). These logs are used only for operational monitoring and security purposes and are not shared with third parties.",
  },
  {
    title: "Children's privacy",
    body: "CrawlScope is not directed at children under 13 and does not knowingly collect information from children.",
  },
  {
    title: "Changes to this policy",
    body: "We may update this privacy policy from time to time. Changes will be reflected on this page with an updated date. Continued use of CrawlScope after changes are posted constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact",
    body: "If you have questions about this privacy policy or how CrawlScope handles data, please open an issue on our GitHub repository.",
  },
];

export default function PrivacyPage() {
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

      <main className="flex-1 max-w-3xl mx-auto px-6 pt-16 pb-24 w-full">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 mb-6">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Privacy Policy
          </span>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-900 leading-tight mb-3">
            Your privacy matters.
          </h1>
          <p className="text-base text-slate-500">
            CrawlScope is a privacy-first tool. No accounts. No tracking. No stored scan data.
          </p>
          <p className="text-xs text-slate-400 mt-3">Last updated: June 2026</p>
        </div>

        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <div
              key={s.title}
              className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl p-6 shadow-sm shadow-slate-200/40"
            >
              <h2 className="text-[13.5px] font-bold text-slate-900 mb-2">{s.title}</h2>
              <p className="text-[12.5px] text-slate-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
