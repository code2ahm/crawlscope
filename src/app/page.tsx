"use client";

import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  const router = useRouter();

  function handleScan(url: string) {
    router.push(`/scan?url=${encodeURIComponent(url)}`);
  }

  return <LandingPage onScan={handleScan} />;
}
