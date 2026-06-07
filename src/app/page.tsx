"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  const router = useRouter();
  const [scanError, setScanError] = useState<string | null>(null);

  function handleScan(url: string) {
    setScanError(null);
    router.push(`/scan?url=${encodeURIComponent(url)}`);
  }

  return <LandingPage onScan={handleScan} initialError={scanError} />;
}
