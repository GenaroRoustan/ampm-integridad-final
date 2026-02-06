import { useNavigate, useSearchParams } from 'react-router-dom';
import { AssessmentHeader } from '@/components/AssessmentHeader';
import { useAssessment } from '@/contexts/AssessmentContext';
import { STAGE_INFO } from '@/types/assessment';
import type { Stage } from '@/types/assessment';
import { getStageForQuestionIndex } from '@/data/questions';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';

export default function StageIntro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, startAssessment } = useAssessment();

  const stageParam = searchParams.get('stage') as Stage | null;
  const currentStage = stageParam || getStageForQuestionIndex(state.currentQuestionIndex);
  const stageInfo = STAGE_INFO[currentStage];

  const stageIcons: Record<Stage, ReactElement> = {
    honesty: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    sincerity: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    autocritica: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  };

  const stageNumber = currentStage === 'honesty' ? 1 : currentStage === 'sincerity' ? 2 : 3;

  const handleStart = () => {
    if (!state.startTime) {
      startAssessment();
    }
    navigate('/question', { state: { stageIntroFor: currentStage } });
  };

  return (
    <div className="assessment-container">
      <AssessmentHeader />
      <main className="assessment-content">
        <div className="assessment-card animate-slide-up text-center">
          <div className={`w-24 h-24 ${stageInfo.color.replace('stage-', 'bg-stage-')}/10 rounded-full flex items-center justify-center mx-auto mb-6`}>
            <div className={`${stageInfo.color.replace('stage-', 'text-stage-')}`}>
              {stageIcons[currentStage]}
            </div>
          </div>

          <div className="mb-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Etapa {stageNumber} de 3
            </span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            {stageInfo.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {stageInfo.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/instructions')}
              className="btn-outline flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Instrucciones
            </button>
            <button
              onClick={handleStart}
              className="btn-primary flex items-center justify-center gap-2 flex-1"
            >
              Siguiente
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
