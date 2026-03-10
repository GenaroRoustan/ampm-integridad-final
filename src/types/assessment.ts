import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AssessmentState, CandidateInfo, Answer, AnswerValue } from '@/types/assessment';
import { getQuestions } from '@/data/questions';

interface AssessmentContextType {
  state: AssessmentState;
  setToken: (token: string) => void;
  setPuesto: (puesto: string | null) => void;
  setModalidad: (modalidad: string) => void;
  setCandidateInfo: (info: CandidateInfo) => void;
  startAssessment: () => void;
  answerQuestion: (questionId: string, value: AnswerValue, timeSpent: number) => void;
  skipQuestion: (questionId: string, timeSpent: number) => void;
  nextQuestion: () => void;
  completeAssessment: () => void;
  getCurrentQuestion: () => ReturnType<typeof getQuestions>[0] | null;
  getProgress: () => { current: number; total: number; stageProgress: number; stageTotal: number };
}

const initialState: AssessmentState = {
  token: '',
  assessmentId: '',
  puesto: null,
  modalidad: 'con_experiencia',
  candidateInfo: null,
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,
  isCompleted: false,
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(initialState);

  // Preguntas según modalidad actual
  const questions = getQuestions(state.modalidad);

  const setToken = useCallback((token: string) => {
    setState((prev) => ({
      ...prev,
      token,
      assessmentId: `ASM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
  }, []);

  const setPuesto = useCallback((puesto: string | null) => {
    setState((prev) => ({ ...prev, puesto }));
  }, []);

  const setModalidad = useCallback((modalidad: string) => {
    setState((prev) => ({ ...prev, modalidad }));
  }, []);

  const setCandidateInfo = useCallback((info: CandidateInfo) => {
    setState((prev) => ({ ...prev, candidateInfo: info }));
  }, []);

  const startAssessment = useCallback(() => {
    setState((prev) => ({ ...prev, startTime: new Date() }));
  }, []);

  const answerQuestion = useCallback((questionId: string, value: AnswerValue, timeSpent: number) => {
    setState((prev) => {
      const existingIndex = prev.answers.findIndex((a: Answer) => a.questionId === questionId);
      const newAnswer: Answer = { questionId, value, timeSpent };
      if (existingIndex >= 0) {
        const newAnswers = [...prev.answers];
        newAnswers[existingIndex] = newAnswer;
        return { ...prev, answers: newAnswers };
      }
      return { ...prev, answers: [...prev.answers, newAnswer] };
    });
  }, []);

  const skipQuestion = useCallback((questionId: string, timeSpent: number) => {
    setState((prev) => {
      const existingIndex = prev.answers.findIndex((a: Answer) => a.questionId === questionId);
      const newAnswer: Answer = { questionId, value: null, timeSpent };
      if (existingIndex >= 0) {
        const newAnswers = [...prev.answers];
        newAnswers[existingIndex] = newAnswer;
        return { ...prev, answers: newAnswers };
      }
      return { ...prev, answers: [...prev.answers, newAnswer] };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, questions.length - 1),
    }));
  }, [questions.length]);

  const completeAssessment = useCallback(() => {
    setState((prev) => ({ ...prev, isCompleted: true }));
  }, []);

  const getCurrentQuestion = useCallback(() => {
    return questions[state.currentQuestionIndex] || null;
  }, [questions, state.currentQuestionIndex]);

  const getProgress = useCallback(() => {
    const current = state.currentQuestionIndex + 1;
    const total = questions.length;
    const stageProgress = (state.currentQuestionIndex % 15) + 1;
    const stageTotal = 15;
    return { current, total, stageProgress, stageTotal };
  }, [questions.length, state.currentQuestionIndex]);

  return (
    <AssessmentContext.Provider value={{
      state, setToken, setPuesto, setModalidad, setCandidateInfo,
      startAssessment, answerQuestion, skipQuestion, nextQuestion,
      completeAssessment, getCurrentQuestion, getProgress,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error('useAssessment must be used within an AssessmentProvider');
  return context;
}
