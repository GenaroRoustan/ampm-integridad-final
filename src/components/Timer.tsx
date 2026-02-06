import { useCallback, useEffect, useRef, useState } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
  onTick?: (remaining: number) => void;
  className?: string;
}

export function Timer({ duration, onTimeUp, isActive, onTick, className }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) {
      clearTimer();
      return;
    }

    clearTimer();
    intervalRef.current = window.setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        onTick?.(next);

        if (next <= 0) {
          clearTimer();
          onTimeUp();
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => {
      clearTimer();
    };
  }, [isActive, onTimeUp, onTick, clearTimer]);

  const getTimerClass = (): string => {
    if (remaining <= 10) return 'timer-danger';
    if (remaining <= 20) return 'timer-warning';
    return 'timer-normal';
  };

  return (
    <div className={`timer-circle ${getTimerClass()} ${className ?? ''}`.trim()}>
      {remaining}s
    </div>
  );
}
