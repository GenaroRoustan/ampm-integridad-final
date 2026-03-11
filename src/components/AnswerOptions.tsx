import { getAnswerOptions } from '@/types/assessment';
import type { AnswerValue } from '@/types/assessment';
import { useAssessment } from '@/contexts/AssessmentContext';

interface AnswerOptionsProps {
  selectedValue: AnswerValue | null;
  onSelect: (value: AnswerValue) => void;
}

export function AnswerOptions({ selectedValue, onSelect }: AnswerOptionsProps) {
  const { state } = useAssessment();
  const options = getAnswerOptions(state.modalidad);

  return (
    <div className="space-y-2 sm:space-y-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`answer-option ${selectedValue === option.value ? 'selected' : ''}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
