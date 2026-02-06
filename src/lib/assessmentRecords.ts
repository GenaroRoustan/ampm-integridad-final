import type { AssessmentResult } from "@/types/assessment";

export interface StoredAssessmentRecord extends AssessmentResult {
  id: string;
  assessmentId: string;
  token: string;
  name: string;
  cedula: string;
  createdAt: string; // ISO
  skippedCount: number;
  answeredCount: number;
  totalQuestions: number;
}

const STORAGE_KEY = "ampm_assessment_records_v1";

export function loadAssessmentRecords(): StoredAssessmentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredAssessmentRecord[];
  } catch {
    return [];
  }
}

export function saveAssessmentRecord(record: StoredAssessmentRecord): void {
  const existing = loadAssessmentRecords();
  const next = [record, ...existing.filter((r) => r.id !== record.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
