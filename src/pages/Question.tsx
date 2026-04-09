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
const TS_KEY = 'ampm_q_start_ts';
const IDX_KEY = 'ampm_q_index';

// Lee cuánto tiempo real queda para la pregunta actual
function getRemainingSeconds(questionIndex: number): number {
  try {
    const savedIndex = Number(sessionStorage.getItem(IDX_KEY) ?? -1);
    const savedTs    = Number(sessionStorage.getItem(TS_KEY) ?? 0);
    // Si el índice guardado coincide con la pregunta actual, calcular real
    if (savedIndex === questionIndex && savedTs > 0) {
      const elapsed = Math.floor((Date.now() - savedTs) / 1000);
      return Math.max(QUESTION_TIME_LIMIT - elapsed, 0);
    }
  } catch { /* ignorar */ }
  // Primera vez en esta pregunta — guardar timestamp ahora
  sessionStorage.setItem(TS_KEY, String(Date.now()));
  sessionStorage.setItem(IDX_KEY, String(questionIndex));
  return QUESTION_TIME_LIMIT;
}

export default function Question() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, getCurrentQuestion, getProgress, answerQuestion, skipQuestion, nextQuestion, completeAssessment } = useAssessment();

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const currentStage = getStageForQuestionIndex(state.currentQuestionIndex);
  const previousStage = state.currentQuestionIndex > 0
    ? getStageForQuestionIndex(state.currentQuestionIndex - 1)
    : null;
  const stageIntroFor = (location.state as { stageIntroFor?: Stage } | null)?.stageIntroFor;

  // ── Timer: inicializar con tiempo REAL restante (sobrevive refresh) ──
  const [remaining, setRemaining] = useState<number>(() =>
    getRemainingSeconds(state.currentQuestionIndex)
  );
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValue | null>(null);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const upsertAnswer = (
    existing: typeof state.answers,
    questionId: string,
    value: AnswerValue | null,
    timeSpent: number
  ) => {
    if (!questionId) return existing;
    const next = [...existing];
    const idx = next.findIndex(a => a.questionId === questionId);
    const entry = { questionId, value, timeSpent };
    if (idx >= 0) { next[idx] = entry; return next; }
    next.push(entry);
    return next;
  };

  useEffect(() => {
    if (state.currentQuestionIndex > 0 && previousStage !== currentStage && stageIntroFor !== currentStage) {
      navigate(`/stage-intro?stage=${currentStage}`);
    }
  }, [state.currentQuestionIndex, currentStage, previousStage, navigate, stageIntroFor]);

  // Al cambiar de pregunta: guardar nuevo timestamp y resetear timer
  const prevIndexRef = useRef(state.currentQuestionIndex);
  useEffect(() => {
    if (prevIndexRef.current === state.currentQuestionIndex) return; // montaje inicial, no resetear
    prevIndexRef.current = state.currentQuestionIndex;

    // Nueva pregunta — guardar timestamp fresco
    sessionStorage.setItem(TS_KEY, String(Date.now()));
    sessionStorage.setItem(IDX_KEY, String(state.currentQuestionIndex));

    setSelectedAnswer(null);
    setShowTimeoutModal(false);
    setTimerActive(true);
    setRemaining(QUESTION_TIME_LIMIT);
  }, [state.currentQuestionIndex]);

  // Si al cargar ya llegó a 0 (refresh tardío), mostrar timeout directamente
  useEffect(() => {
    if (remaining === 0) {
      setTimerActive(false);
      setShowTimeoutModal(true);
    }
  }, []);

  // Timer loop
  useEffect(() => {
    if (intervalRef.current !== null) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
    if (!timerActive) return;

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
    const savedTs = Number(sessionStorage.getItem(TS_KEY) ?? Date.now());
    return Math.min((Date.now() - savedTs) / 1000, QUESTION_TIME_LIMIT);
  };

  const handleTimeoutContinue = useCallback(() => {
    if (isSubmittingRef.current) return;
    const timeSpent = getTimeSpent();
    setShowTimeoutModal(false);
    if (currentQuestion) skipQuestion(currentQuestion.id, timeSpent);
    const updated = upsertAnswer(state.answers, currentQuestion?.id ?? '', null, timeSpent);
    void goToNext(updated);
  }, [currentQuestion, skipQuestion, state.answers]);

  const goToNext = (answersForScoring: typeof state.answers = state.answers) => {
    if (state.currentQuestionIndex >= questions.length - 1) {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSubmitting(true);
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
      if (record.name && record.name !== 'Sin nombre' && record.cedula && record.cedula.length > 3) {
        const payload = { fullName: record.name, cedula: record.cedula, puesto: record.puesto, answers: answersForScoring, modalidad: state.modalidad, hrEmail: state.hrEmail };
        void (async () => {
          let success = false;
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              const res = await fetch(URL_PROXY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              if (res.ok) { success = true; break; }
            } catch { /* network error, retry */ }
            if (attempt < 2) await new Promise(r => setTimeout(r, 5000));
          }
          if (!success) {
            try {
              const pending = JSON.parse(localStorage.getItem('ampm_pending_submissions') ?? '[]');
              pending.push({ ...payload, timestamp: new Date().toISOString() });
              localStorage.setItem('ampm_pending_submissions', JSON.stringify(pending));
            } catch { /* localStorage full or unavailable */ }
          }
        })();
      }
      completeAssessment();
      navigate('/complete', { replace: true });
    } else {
      nextQuestion();
    }
  };

  const handleNext = () => {
    if (isSubmittingRef.current) return;
    if (selectedAnswer === null) return;
    const timeSpent = getTimeSpent();
    if (currentQuestion) answerQuestion(currentQuestion.id, selectedAnswer, timeSpent);
    const updated = upsertAnswer(state.answers, currentQuestion?.id ?? '', selectedAnswer, timeSpent);
    goToNext(updated);
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
          disabled={selectedAnswer === null || isSubmitting}
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
