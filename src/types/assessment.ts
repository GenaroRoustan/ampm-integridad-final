export type Stage = 'honesty' | 'sincerity' | 'autocritica';

export type AnswerValue = 0 | 1 | 2 | 3;

export interface Question {
  id: string;
  text: string;
  stage: Stage;
  reverseScoring: boolean;
}

export interface Answer {
  questionId: string;
  value: AnswerValue | null;
  timeSpent: number;
}

export interface CandidateInfo {
  fullName: string;
  cedula: string;
}

export interface AssessmentState {
  token: string;
  assessmentId: string;
  candidateInfo: CandidateInfo | null;
  currentQuestionIndex: number;
  answers: Answer[];
  startTime: Date | null;
  isCompleted: boolean;
}

export interface AssessmentResult {
  honestyScore: number;
  sincerityScore: number;
  autocriticaScore: number;
  totalScore: number;
  decision: 'APTO' | 'REVISAR' | 'NO_APTO' | 'INVALIDA';
}

export const ANSWER_OPTIONS = [
  { value: 0 as AnswerValue, label: 'No' },
  { value: 1 as AnswerValue, label: 'Pocas veces' },
  { value: 2 as AnswerValue, label: 'Muchas veces' },
  { value: 3 as AnswerValue, label: 'Sí' },
] as const;

export const STAGE_INFO = {
  honesty: {
    title: 'Honestidad',
    description: 'En esta etapa se evaluará su conducta frente a normas, manejo de dinero y productos.',
    color: 'stage-honesty',
  },
  sincerity: {
    title: 'Sinceridad',
    description: 'En esta etapa se evaluará su disposición a decir la verdad y evitar excusas.',
    color: 'stage-sincerity',
  },
  autocritica: {
    title: 'Autocrítica',
    description: 'En esta etapa se evaluará su capacidad de reconocer errores y aprender de ellos.',
    color: 'stage-autocritica',
  },
} as const;
