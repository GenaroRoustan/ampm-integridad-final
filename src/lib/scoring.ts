import type { Answer, AssessmentResult, Question, Stage } from "@/types/assessment";

const STAGES: Stage[] = ["honesty", "sincerity", "autocritica"];

function normalizeAnswerValue(value: Answer["value"]): 0 | 1 | 2 | 3 {
  // If skipped/null, treat as worst possible score contribution.
  return (value ?? 0) as 0 | 1 | 2 | 3;
}

function scoreAnswer(question: Question, answerValue: 0 | 1 | 2 | 3): number {
  // Score in [0..3] where 3 is best.
  return question.reverseScoring ? 3 - answerValue : answerValue;
}

function percentFromSum(sum: number, itemCount: number): number {
  const max = itemCount * 3;
  if (max <= 0) return 0;
  return Math.round((sum / max) * 100);
}

export interface ScoringMeta {
  skippedCount: number;
  answeredCount: number;
  totalQuestions: number;
}

export function calculateAssessmentResult(
  questions: Question[],
  answers: Answer[]
): { result: AssessmentResult; meta: ScoringMeta } {
  const answerByQuestionId = new Map<string, Answer>();
  for (const answer of answers) {
    // Prefer the latest entry if duplicates exist.
    answerByQuestionId.set(answer.questionId, answer);
  }

  const stageSums: Record<Stage, number> = {
    honesty: 0,
    sincerity: 0,
    autocritica: 0,
  };

  const stageCounts: Record<Stage, number> = {
    honesty: 0,
    sincerity: 0,
    autocritica: 0,
  };

  let skippedCount = 0;
  let answeredCount = 0;

  for (const question of questions) {
    const answer = answerByQuestionId.get(question.id);
    const rawValue = answer?.value;

    if (rawValue === null || rawValue === undefined) {
      skippedCount += 1;
    } else {
      answeredCount += 1;
    }

    const normalized = normalizeAnswerValue(rawValue ?? null);
    const itemScore = scoreAnswer(question, normalized);

    stageSums[question.stage] += itemScore;
    stageCounts[question.stage] += 1;
  }

  const honestyScore = percentFromSum(stageSums.honesty, stageCounts.honesty);
  const sincerityScore = percentFromSum(stageSums.sincerity, stageCounts.sincerity);
  const autocriticaScore = percentFromSum(stageSums.autocritica, stageCounts.autocritica);

  const totalScore = Math.round((honestyScore + sincerityScore + autocriticaScore) / STAGES.length);

  // Simple, explicit rule set (tweakable later):
  // - INVALIDA if >= 10% unanswered
  // - Otherwise based on totalScore thresholds
  const invalidThreshold = Math.ceil(questions.length * 0.1);
  let decision: AssessmentResult["decision"];

  if (skippedCount >= invalidThreshold) {
    decision = "INVALIDA";
  } else if (totalScore >= 80) {
    decision = "APTO";
  } else if (totalScore >= 60) {
    decision = "REVISAR";
  } else {
    decision = "NO_APTO";
  }

  return {
    result: {
      honestyScore,
      sincerityScore,
      autocriticaScore,
      totalScore,
      decision,
    },
    meta: {
      skippedCount,
      answeredCount,
      totalQuestions: questions.length,
    },
  };
}
