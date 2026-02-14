import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AssessmentHeader } from '@/components/AssessmentHeader';
import { ProgressBar } from '@/components/ProgressBar';
import { AnswerOptions } from '@/components/AnswerOptions';
import { TimeoutModal } from '@/components/TimeoutModal';
import { useAssessment } from '@/contexts/AssessmentContext';
import type { AnswerValue, Stage } from '@/types/assessment';
import { questions, getStageForQuestionIndex } from '@/data/questions';
import { calculateAssessmentResult } from '@/lib/scoring';
import { saveAssessmentRecord } from '@/lib/assessmentRecords';
import { ArrowRight } from 'lucide-react';

const QUESTION_TIME_LIMIT = 45;
const PROXY_BASE_URL = 'https://proxy-seguridad.replit.app';
const URL_PROXY = `${PROXY_BASE_URL.replace(/\/+$/, '')}/enviar-prueba`;

export default function Question() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, getCurrentQuestion, getProgress, answerQuestion, skipQuestion, nextQuestion, completeAssessment } = useAssessment();
  
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValue | null>(null);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [remaining, setRemaining] = useState(QUESTION_TIME_LIMIT);
  const intervalRef = useRef<number | null>(null);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const currentStage = getStageForQuestionIndex(state.currentQuestionIndex);
  const previousStage = state.currentQuestionIndex > 0 ? getStageForQuestionIndex(state.currentQuestionIndex - 1) : null;

  const stageIntroFor = (location.state as { stageIntroFor?: Stage } | null)?.stageIntroFor;

  const upsertAnswer = (
    existing: typeof state.answers,
    questionId: string,
    value: AnswerValue | null,
    timeSpent: number
  ) => {
    if (!questionId) return existing;
    const next = [...existing];
    const idx = next.findIndex(a => a.questionId === questionId);
    const newAnswer = { questionId, value, timeSpent };
    if (idx >= 0) {
      next[idx] = newAnswer;
      return next;
    }
    next.push(newAnswer);
    return next;
  };

  // Check if we need to show stage intro
  useEffect(() => {
    if (state.currentQuestionIndex > 0 && previousStage !== currentStage && stageIntroFor !== currentStage) {
      navigate(`/stage-intro?stage=${currentStage}`);
    }
  }, [state.currentQuestionIndex, currentStage, previousStage, navigate, stageIntroFor]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowTimeoutModal(false);
    setTimerActive(true);
    setQuestionStartTime(Date.now());
    setRemaining(QUESTION_TIME_LIMIT);
  }, [state.currentQuestionIndex]);

  // Timer loop (keeps running even if an answer is selected)
  useEffect(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!timerActive) return;

    intervalRef.current = window.setInterval(() => {
      setRemaining(prev => {
        const next = Math.max(prev - 1, 0);
        if (next === 0) {
          // Stop timer and trigger timeout UX.
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setTimerActive(false);
          setShowTimeoutModal(true);
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerActive, state.currentQuestionIndex]);

  const handleTimeoutContinue = useCallback(() => {
    const timeSpent = Math.min((Date.now() - questionStartTime) / 1000, QUESTION_TIME_LIMIT);
    setShowTimeoutModal(false);

    if (currentQuestion) {
      skipQuestion(currentQuestion.id, timeSpent);
    }

    const updatedAnswers = upsertAnswer(state.answers, currentQuestion?.id ?? '', null, timeSpent);
    goToNext(updatedAnswers);
  }, [currentQuestion, questionStartTime, skipQuestion, state.answers]);

  const goToNext = (answersForScoring: typeof state.answers = state.answers) => {
    if (state.currentQuestionIndex >= questions.length - 1) {
      const { result, meta } = calculateAssessmentResult(questions, answersForScoring);
      const nowIso = new Date().toISOString();

      const record = {
        id: state.assessmentId || `ASM-${nowIso}`,
        assessmentId: state.assessmentId || `ASM-${nowIso}`,
        token: state.token,
        name: state.candidateInfo?.fullName ?? 'Sin nombre',
        cedula: state.candidateInfo?.cedula ?? '',
        createdAt: nowIso,
        skippedCount: meta.skippedCount,
        answeredCount: meta.answeredCount,
        totalQuestions: meta.totalQuestions,
        ...result,
      };

      saveAssessmentRecord(record);

      // Secure, best-effort submission via proxy (no API keys from client)
      void (async () => {
        try {
          await fetch(URL_PROXY, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullName: record.name,
              cedula: record.cedula,
              answers: answersForScoring,
            }),
          });
        } catch {
          // Best-effort: do not block candidate UX if proxy fails.
        }
      })();

      completeAssessment();
      navigate('/complete');
    } else {
      nextQuestion();
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const timeSpent = Math.min((Date.now() - questionStartTime) / 1000, QUESTION_TIME_LIMIT);
    
    if (currentQuestion) {
      answerQuestion(currentQuestion.id, selectedAnswer, timeSpent);
    }

    const updatedAnswers = upsertAnswer(state.answers, currentQuestion?.id ?? '', selectedAnswer, timeSpent);
    goToNext(updatedAnswers);
  };

  if (!currentQuestion) {
    navigate('/complete');
    return null;
  }

  return (
    <div className="assessment-container">
      <AssessmentHeader />

      <main className="w-full max-w-lg mx-auto px-4 pt-3 pb-4 flex flex-col h-[calc(100vh-100px)]">
        {/* Top area: Progress */}
        <div>
          <ProgressBar currentIndex={state.currentQuestionIndex} total={questions.length} />
        </div>

        {/* Question Card */}
        <div className="assessment-card mt-3 mb-3 p-5 sm:p-6">
          <p className="text-base sm:text-lg font-medium text-foreground text-center leading-snug">
            {currentQuestion.text}
          </p>
          <progress
            className={`time-bar mt-4 ${remaining <= 15 ? 'time-bar-warning' : 'time-bar-safe'}`}
            value={remaining}
            max={QUESTION_TIME_LIMIT}
          />
        </div>

        {/* Answer Options (flex to keep button visible) */}
        <div className="flex-1 min-h-0 flex flex-col justify-center">
          <AnswerOptions selectedValue={selectedAnswer} onSelect={setSelectedAnswer} />
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="btn-primary mt-3 py-3 text-base flex items-center justify-center gap-2 shrink-0"
        >
          Siguiente
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="mt-4 text-center text-xs text-gray-500">
          Pregunta {progress.current} de {progress.total}
        </div>
      </main>

      <TimeoutModal
        isOpen={showTimeoutModal}
        onContinue={handleTimeoutContinue}
      />
    </div>
  );
}
