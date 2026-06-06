import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { VitalStatus } from "@/types/audit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#f59e0b";
  if (score >= 50) return "#f97316";
  return "#ef4444";
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Improvement";
  return "Poor";
}

export function scoreBgClass(score: number): string {
  if (score >= 90) return "bg-green-50 text-green-700 border-green-200";
  if (score >= 70) return "bg-amber-50 text-amber-700 border-amber-200";
  if (score >= 50) return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-red-50 text-red-700 border-red-200";
}

export function vitalStatusColor(status: VitalStatus): string {
  if (status === "good") return "#22c55e";
  if (status === "needs-improvement") return "#f59e0b";
  return "#ef4444";
}

export function vitalStatusLabel(status: VitalStatus): string {
  if (status === "good") return "Good";
  if (status === "needs-improvement") return "Needs Improvement";
  return "Poor";
}

export function vitalStatusClasses(status: VitalStatus): string {
  if (status === "good") return "bg-green-50 text-green-700";
  if (status === "needs-improvement") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

export function formatBytes(kb: number): string {
  if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
