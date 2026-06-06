import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://crawlscope.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "CrawlScope - Free Website SEO & Performance Audit Tool",
    template: "%s | CrawlScope",
  },
  description:
    "Scan any website instantly and get a full SEO, performance, accessibility, and technical audit. Powered by Lighthouse. Free, no signup required.",

  keywords: [
    "website audit",
    "SEO checker",
    "Lighthouse audit",
    "Core Web Vitals",
    "page speed test",
    "accessibility checker",
    "technical SEO",
    "website scanner",
    "free SEO tool",
    "CrawlScope",
  ],

  authors: [{ name: "CrawlScope", url: BASE_URL }],
  creator: "CrawlScope",
  publisher: "CrawlScope",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "CrawlScope",
    title: "CrawlScope - Free Website SEO & Performance Audit Tool",
    description:
      "Scan any website instantly and get a full SEO, performance, accessibility, and technical audit. Free, no signup required.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "CrawlScope — See it. Fix it. Ship it.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CrawlScope - Free Website SEO & Performance Audit Tool",
    description:
      "Scan any website and get a full SEO, performance, accessibility, and technical audit. Free, no signup required.",
    images: ["/preview.png"],
  },

  alternates: {
    canonical: BASE_URL,
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  manifest: "/site.webmanifest",
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
