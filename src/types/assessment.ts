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
  puesto: string | null;
  modalidad: string;
  hrEmail: string;
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

export const ANSWER_OPTIONS_CON_EXPERIENCIA = [
  { value: 0 as AnswerValue, label: 'No' },
  { value: 1 as AnswerValue, label: 'Pocas veces' },
  { value: 2 as AnswerValue, label: 'Muchas veces' },
  { value: 3 as AnswerValue, label: 'Sí' },
] as const;

export const ANSWER_OPTIONS_SIN_EXPERIENCIA = [
  { value: 0 as AnswerValue, label: 'Nunca lo haría' },
  { value: 1 as AnswerValue, label: 'Probablemente no' },
  { value: 2 as AnswerValue, label: 'Probablemente sí' },
  { value: 3 as AnswerValue, label: 'Sin duda lo haría' },
] as const;

export const ANSWER_OPTIONS = ANSWER_OPTIONS_CON_EXPERIENCIA;

export function getAnswerOptions(modalidad?: string) {
  return modalidad === 'sin_experiencia'
    ? ANSWER_OPTIONS_SIN_EXPERIENCIA
    : ANSWER_OPTIONS_CON_EXPERIENCIA;
}

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
