import type { Stage } from '@/types/assessment';

interface ProgressBarProps {
  currentIndex: number;
  total: number;
}

export function ProgressBar({ currentIndex, total }: ProgressBarProps) {
  const questionsPerStage = total / 3;
  
  const getStageProgress = (stageIndex: number): number => {
    const stageStart = stageIndex * questionsPerStage;
    const stageEnd = (stageIndex + 1) * questionsPerStage;
    
    if (currentIndex >= stageEnd) return 100;
    if (currentIndex < stageStart) return 0;
    
    return ((currentIndex - stageStart + 1) / questionsPerStage) * 100;
  };

  const stages: { key: Stage; label: string; colorClass: string }[] = [
    { key: 'honesty', label: 'Honestidad', colorClass: 'progress-honesty' },
    { key: 'sincerity', label: 'Sinceridad', colorClass: 'progress-sincerity' },
    { key: 'autocritica', label: 'Autocrítica', colorClass: 'progress-autocritica' },
  ];

  return (
    <div className="w-full space-y-3">
      <div className="progress-bar-container">
        {stages.map((stage, index) => (
          <div
            key={stage.key}
            className="flex-1 bg-muted relative overflow-hidden"
            style={{ borderRadius: index === 0 ? '9999px 0 0 9999px' : index === 2 ? '0 9999px 9999px 0' : '0' }}
          >
            <div
              className={`progress-segment ${stage.colorClass}`}
              style={{ width: `${getStageProgress(index)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        {stages.map((stage, index) => (
          <span
            key={stage.key}
            className={`font-medium ${currentIndex >= index * questionsPerStage && currentIndex < (index + 1) * questionsPerStage ? 'text-foreground' : ''}`}
          >
            {stage.label}
          </span>
        ))}
      </div>
    </div>
  );
}
