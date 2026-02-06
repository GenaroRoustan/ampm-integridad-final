import { ANSWER_OPTIONS } from '@/types/assessment';
import type { AnswerValue } from '@/types/assessment';

interface AnswerOptionsProps {
  selectedValue: AnswerValue | null;
  onSelect: (value: AnswerValue) => void;
}

type AnswerOption = (typeof ANSWER_OPTIONS)[number];

export function AnswerOptions({ selectedValue, onSelect }: AnswerOptionsProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      {ANSWER_OPTIONS.map((option: AnswerOption) => (
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
