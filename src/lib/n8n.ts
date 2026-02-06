import type { StoredAssessmentRecord } from "@/lib/assessmentRecords";
import type { Answer } from "@/types/assessment";

const RESULTS_WEBHOOK_URL = import.meta.env.VITE_N8N_RESULTS_WEBHOOK_URL as string | undefined;
const TOKEN_VALIDATE_URL = import.meta.env.VITE_N8N_TOKEN_VALIDATE_URL as string | undefined;

export interface AssessmentResultsWebhookPayload {
  // Explicit candidate fields (requested)
  candidateName: string;
  candidateId: string;

  // Friendly aliases (example)
  name: string;
  cedula: string;

  // Convenience score field (example)
  score: number;

  // Raw answers
  answers: Answer[];

  // Rest of stored record fields
  record: StoredAssessmentRecord;
}

export async function postAssessmentToN8n(payload: AssessmentResultsWebhookPayload): Promise<void> {
  if (!RESULTS_WEBHOOK_URL) return;

  await fetch(RESULTS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export type TokenValidationResult = { valid: boolean; expired?: boolean };

export async function validateTokenWithN8n(token: string): Promise<TokenValidationResult | null> {
  if (!TOKEN_VALIDATE_URL) return null;

  const url = new URL(TOKEN_VALIDATE_URL);
  url.searchParams.set("token", token);

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) return { valid: false };

  return (await res.json()) as TokenValidationResult;
}
