import { NextRequest, NextResponse } from "next/server";
import type { ScanResponse } from "@/types/audit";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ScanResponse>> {
  try {
    const body = await req.json();
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
    const report = await scanWebsite(url);

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
