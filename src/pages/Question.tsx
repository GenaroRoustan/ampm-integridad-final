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
const URL_PROXY = `${PROXY_BASE_URL}/enviar-prueba`;

export default function Question() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    state,
    getCurrentQuestion,
    getProgress,
    answerQuestion,
    skipQuestion,
    nextQuestion,
    completeAssessment,
    getQuestionStartTimestamp,
    setQuestionStartTimestamp,
  } = useAssessment();

  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValue | null>(null);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [remaining, setRemaining] = useState<number>(() => {
    // ── Al montar (incluso tras refresh), calcular tiempo real restante ──
    const startTs = Number(sessionStorage.getItem('ampm_question_start_ts') || Date.now());
    const elapsed = Math.floor((Date.now() - startTs) / 1000);
    return Math.max(QUESTION_TIME_LIMIT - elapsed, 0);
  });

  const intervalRef = useRef<number | null>(null);
  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const currentStage = getStageForQuestionIndex(state.currentQuestionIndex);
  const previousStage = state.currentQuestionIndex > 0
    ? getStageForQuestionIndex(state.currentQuestionIndex - 1)
    : null;
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
    if (idx >= 0) { next[idx] = newAnswer; return next; }
    next.push(newAnswer);
    return next;
  };

  useEffect(() => {
    if (state.currentQuestionIndex > 0 && previousStage !== currentStage && stageIntroFor !== currentStage) {
      navigate(`/stage-intro?stage=${currentStage}`);
    }
  }, [state.currentQuestionIndex, currentStage, previousStage, navigate, stageIntroFor]);

  // Al cambiar de pregunta (no en el primer render): resetear timer y guardar nuevo timestamp
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Primera carga — el remaining ya fue calculado en el useState inicial
      // Si ya llegó a 0 (el candidato tardó demasiado en refrescar), mostrar timeout
      if (remaining === 0) {
        setTimerActive(false);
        setShowTimeoutModal(true);
      }
      return;
    }
    // Cambio real de pregunta
    setSelectedAnswer(null);
    setShowTimeoutModal(false);
    setTimerActive(true);
    const now = Date.now();
    setQuestionStartTimestamp(now);
    setRemaining(QUESTION_TIME_LIMIT);
  }, [state.currentQuestionIndex]);

  // Timer loop
  useEffect(() => {
    if (intervalRef.current !== null) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
    if (!timerActive || remaining === 0) return;

    intervalRef.current = window.setInterval(() => {
      setRemaining(prev => {
        const next = Math.max(prev - 1, 0);
        if (next === 0) {
          if (intervalRef.current !== null) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
          setTimerActive(false);
          setShowTimeoutModal(true);
        }
        return next;
      });
    }, 1000);

    return () => { if (intervalRef.current !== null) { window.clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [timerActive]);

  const getTimeSpent = () => {
    const startTs = getQuestionStartTimestamp();
    return Math.min((Date.now() - startTs) / 1000, QUESTION_TIME_LIMIT);
  };

  const handleTimeoutContinue = useCallback(() => {
    const timeSpent = getTimeSpent();
    setShowTimeoutModal(false);
    if (currentQuestion) skipQuestion(currentQuestion.id, timeSpent);
    const updatedAnswers = upsertAnswer(state.answers, currentQuestion?.id ?? '', null, timeSpent);
    goToNext(updatedAnswers);
  }, [currentQuestion, skipQuestion, state.answers]);

  const goToNext = (answersForScoring: typeof state.answers = state.answers) => {
    if (state.currentQuestionIndex >= questions.length - 1) {
      const { result, meta } = calculateAssessmentResult(questions, answersForScoring);
      const nowIso = new Date().toISOString();
      const puesto = (state.puesto ?? '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
      const record = {
        id: state.assessmentId || `ASM-${nowIso}`,
        assessmentId: state.assessmentId || `ASM-${nowIso}`,
        token: state.token,
        name: state.candidateInfo?.fullName ?? 'Sin nombre',
        cedula: state.candidateInfo?.cedula ?? '',
        puesto,
        createdAt: nowIso,
        skippedCount: meta.skippedCount,
        answeredCount: meta.answeredCount,
        totalQuestions: meta.totalQuestions,
        ...result,
      };
      saveAssessmentRecord(record);
      void (async () => {
        try {
          await fetch(URL_PROXY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName: record.name, cedula: record.cedula, puesto: record.puesto, answers: answersForScoring }),
          });
        } catch { /* best-effort */ }
      })();
      completeAssessment();
      navigate('/complete');
    } else {
      nextQuestion();
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const timeSpent = getTimeSpent();
    if (currentQuestion) answerQuestion(currentQuestion.id, selectedAnswer, timeSpent);
    const updatedAnswers = upsertAnswer(state.answers, currentQuestion?.id ?? '', selectedAnswer, timeSpent);
    goToNext(updatedAnswers);
  };

  if (!currentQuestion) { navigate('/complete'); return null; }

  return (
    <div className="assessment-container">
      <AssessmentHeader />

      <main className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col gap-3">
        <ProgressBar currentIndex={state.currentQuestionIndex} total={questions.length} />

        <div className="assessment-card p-4 sm:p-6">
          <p className="text-sm sm:text-base font-medium text-foreground text-center leading-snug">
            {currentQuestion.text}
          </p>
          <progress
            className={`time-bar mt-3 ${remaining <= 15 ? 'time-bar-warning' : 'time-bar-safe'}`}
            value={remaining}
            max={QUESTION_TIME_LIMIT}
          />
        </div>

        <AnswerOptions selectedValue={selectedAnswer} onSelect={setSelectedAnswer} />

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="btn-primary py-3 text-base flex items-center justify-center gap-2"
        >
          Siguiente
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="text-center text-xs text-gray-500 pb-4">
          Pregunta {progress.current} de {progress.total}
        </div>
      </main>

      <TimeoutModal isOpen={showTimeoutModal} onContinue={handleTimeoutContinue} />
    </div>
  );
}
