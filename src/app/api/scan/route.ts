import { NextRequest, NextResponse } from "next/server";
import type { ScanResponse } from "@/types/audit";

const SCAN_DEADLINE_MS = 42_000;

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new Error(
          "Scan timed out before CrawlScope could finish. Try a lighter page or run the scan again.",
        ),
      );
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (err) => {
        clearTimeout(timeout);
        reject(err);
      },
    );
  });
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ScanResponse>> {
  try {
    const body = await req.json().catch(() => null);
    const rawUrl: string = body?.url ?? "";

    if (!rawUrl) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 },
      );
    }

    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid URL format" },
        { status: 400 },
      );
    }

    const { scanWebsite } = await import("@/lib/scanner");
    const report = await withTimeout(
      scanWebsite(url, { deadlineAt: Date.now() + SCAN_DEADLINE_MS }),
      SCAN_DEADLINE_MS,
    );

    return NextResponse.json({ success: true, report });
  } catch (err: unknown) {
    console.error("[CrawlScope scan error]", err);
    const message =
      err instanceof Error ? err.message : "Unknown error during scan";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
