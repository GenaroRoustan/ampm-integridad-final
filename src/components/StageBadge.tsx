import { STAGE_INFO } from '@/types/assessment';
import type { Stage } from '@/types/assessment';

interface StageBadgeProps {
  stage: Stage;
}

export function StageBadge({ stage }: StageBadgeProps) {
  const info = STAGE_INFO[stage];
  
  return (
    <span className={`stage-badge ${info.color}`}>
      {info.title}
    </span>
  );
}
