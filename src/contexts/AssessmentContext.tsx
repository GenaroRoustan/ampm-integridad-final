import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AssessmentState, CandidateInfo, Answer, AnswerValue } from '@/types/assessment';
import { questions } from '@/data/questions';

const SESSION_KEY = 'ampm_assessment_state';
const QUESTION_START_KEY = 'ampm_question_start_ts';

interface AssessmentContextType {
  state: AssessmentState;
  setToken: (token: string) => void;
  setPuesto: (puesto: string | null) => void;
  setCandidateInfo: (info: CandidateInfo) => void;
  startAssessment: () => void;
  answerQuestion: (questionId: string, value: AnswerValue, timeSpent: number) => void;
  skipQuestion: (questionId: string, timeSpent: number) => void;
  nextQuestion: () => void;
  completeAssessment: () => void;
  getCurrentQuestion: () => typeof questions[0] | null;
  getProgress: () => { current: number; total: number; stageProgress: number; stageTotal: number };
  getQuestionStartTimestamp: () => number;
  setQuestionStartTimestamp: (ts: number) => void;
}

const initialState: AssessmentState = {
  token: '',
  assessmentId: '',
  puesto: null,
  candidateInfo: null,
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,
  isCompleted: false,
};

// ── Leer estado guardado de sessionStorage ──
function loadState(): AssessmentState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as AssessmentState;
    // startTime viene como string, convertir a Date
    if (parsed.startTime) parsed.startTime = new Date(parsed.startTime);
    return parsed;
  } catch {
    return initialState;
  }
}

// ── Guardar estado en sessionStorage ──
function saveState(state: AssessmentState) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch { /* cuota excedida — ignorar */ }
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(loadState);

  // Persistir en sessionStorage cada vez que cambia el estado
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Limpiar sessionStorage cuando la prueba se completa
  useEffect(() => {
    if (state.isCompleted) {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(QUESTION_START_KEY);
    }
  }, [state.isCompleted]);

  const setToken = useCallback((token: string) => {
    setState((prev: AssessmentState) => ({
      ...prev,
      token,
      assessmentId: `ASM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
  }, []);

  const setPuesto = useCallback((puesto: string | null) => {
    setState((prev: AssessmentState) => ({ ...prev, puesto }));
  }, []);

  const setCandidateInfo = useCallback((info: CandidateInfo) => {
    setState((prev: AssessmentState) => ({ ...prev, candidateInfo: info }));
  }, []);

  const startAssessment = useCallback(() => {
    setState((prev: AssessmentState) => ({ ...prev, startTime: new Date() }));
    // Marcar inicio de la primera pregunta
    sessionStorage.setItem(QUESTION_START_KEY, String(Date.now()));
  }, []);

  const answerQuestion = useCallback((questionId: string, value: AnswerValue, timeSpent: number) => {
    setState((prev: AssessmentState) => {
      const existingAnswerIndex = prev.answers.findIndex((a: Answer) => a.questionId === questionId);
      const newAnswer: Answer = { questionId, value, timeSpent };
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev.answers];
        newAnswers[existingAnswerIndex] = newAnswer;
        return { ...prev, answers: newAnswers };
      }
      return { ...prev, answers: [...prev.answers, newAnswer] };
    });
  }, []);

  const skipQuestion = useCallback((questionId: string, timeSpent: number) => {
    setState((prev: AssessmentState) => {
      const existingAnswerIndex = prev.answers.findIndex((a: Answer) => a.questionId === questionId);
      const newAnswer: Answer = { questionId, value: null, timeSpent };
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev.answers];
        newAnswers[existingAnswerIndex] = newAnswer;
        return { ...prev, answers: newAnswers };
      }
      return { ...prev, answers: [...prev.answers, newAnswer] };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    // Al avanzar, guardar el timestamp de inicio de la nueva pregunta
    sessionStorage.setItem(QUESTION_START_KEY, String(Date.now()));
    setState((prev: AssessmentState) => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, questions.length - 1),
    }));
  }, []);

  const completeAssessment = useCallback(() => {
    setState((prev: AssessmentState) => ({ ...prev, isCompleted: true }));
  }, []);

  const getCurrentQuestion = useCallback(() => {
    return questions[state.currentQuestionIndex] || null;
  }, [state.currentQuestionIndex]);

  const getProgress = useCallback(() => {
    const current = state.currentQuestionIndex + 1;
    const total = questions.length;
    const stageProgress = (state.currentQuestionIndex % 15) + 1;
    const stageTotal = 15;
    return { current, total, stageProgress, stageTotal };
  }, [state.currentQuestionIndex]);

  // ── Timestamp de inicio de pregunta actual ──
  const getQuestionStartTimestamp = useCallback((): number => {
    const stored = sessionStorage.getItem(QUESTION_START_KEY);
    if (stored) return Number(stored);
    // fallback: ahora
    const now = Date.now();
    sessionStorage.setItem(QUESTION_START_KEY, String(now));
    return now;
  }, []);

  const setQuestionStartTimestamp = useCallback((ts: number) => {
    sessionStorage.setItem(QUESTION_START_KEY, String(ts));
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        state,
        setToken,
        setPuesto,
        setCandidateInfo,
        startAssessment,
        answerQuestion,
        skipQuestion,
        nextQuestion,
        completeAssessment,
        getCurrentQuestion,
        getProgress,
        getQuestionStartTimestamp,
        setQuestionStartTimestamp,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error('useAssessment must be used within an AssessmentProvider');
  return context;
}
