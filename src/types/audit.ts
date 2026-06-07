export type Severity = "critical" | "warning" | "info";
export type CheckStatus = "pass" | "fail" | "warn";
export type VitalStatus = "good" | "needs-improvement" | "poor";

export interface LighthouseScores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

export interface CoreWebVital {
  value: string;
  unit: string;
  status: VitalStatus;
  label: string;
  description: string;
  recommendation: string;
  threshold: { good: string; poor: string };
}

export interface CoreWebVitals {
  lcp: CoreWebVital;
  cls: CoreWebVital;
  inp: CoreWebVital;
  ttfb: CoreWebVital;
  fcp: CoreWebVital;
}

export interface AuditCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail?: string;
  helpUrl?: string;
  why?: string;
  fix?: string;
  impact?: string;
}

export interface PriorityFix {
  id: string;
  severity: Severity;
  title: string;
  category: "seo" | "performance" | "accessibility" | "technical" | "content";
  why: string;
  fix: string;
  impact: string;
}

export interface AuditStats {
  critical: number;
  warnings: number;
  passed: number;
  total: number;
}

export interface Screenshots {
  desktop?: string;
  mobile?: string;
}

export interface ScanWarning {
  id: string;
  title: string;
  detail: string;
}

export interface PageMeta {
  title: string;
  description: string;
  h1: string;
  wordCount: number;
  loadTime: number;
  pageSize: number;
  statusCode: number;
  technologies: string[];
}

export interface AuditReport {
  url: string;
  domain: string;
  scannedAt: string;
  scanDuration: number;
  overall: number;
  lighthouse: LighthouseScores;
  vitals: CoreWebVitals;
  stats: AuditStats;
  priorityFixes: PriorityFix[];
  seoChecks: AuditCheck[];
  performanceChecks: AuditCheck[];
  accessibilityChecks: AuditCheck[];
  technicalChecks: AuditCheck[];
  contentChecks: AuditCheck[];
  screenshots: Screenshots;
  warnings?: ScanWarning[];
  meta: PageMeta;
}

export interface ScanRequest {
  url: string;
}

export type ScanErrorCode =
  | "human_verification"
  | "timeout"
  | "scan_failed";

export interface ScanResponse {
  success: boolean;
  report?: AuditReport;
  error?: string;
  errorCode?: ScanErrorCode;
}
