
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

type CountdownStatus = 'idle' | 'running' | 'paused' | 'finished';

export function useCountdown(initialMinutes: number) {
  const totalMs = initialMinutes * 60 * 1000;

  const [remainingMs, setRemainingMs] = useState(totalMs);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [status, setStatus] = useState<CountdownStatus>('idle');

  const endTimeRef = useRef<number | null>(null);
  const segmentStartRef = useRef<number | null>(null);
  const elapsedBeforeSegmentRef = useRef(0);

  const updateTimer = useCallback(() => {
    if (endTimeRef.current === null || segmentStartRef.current === null) {
      return;
    }

    const now = Date.now();
    const remaining = Math.max(0, endTimeRef.current - now);
    const elapsed =
      elapsedBeforeSegmentRef.current +
      (now - segmentStartRef.current);

    setRemainingMs(remaining);
    setElapsedMs(elapsed);

    if (remaining <= 0) {
      setRemainingMs(0);
      setElapsedMs(elapsedBeforeSegmentRef.current +
        (endTimeRef.current - segmentStartRef.current));

      endTimeRef.current = null;
      segmentStartRef.current = null;
      setStatus('finished');
    }
  }, []);

  const start = useCallback(() => {
    if (status !== 'idle' || remainingMs <= 0) return;

    const now = Date.now();
    segmentStartRef.current = now;
    endTimeRef.current = now + remainingMs;
    elapsedBeforeSegmentRef.current = elapsedMs;

    setStatus('running');
  }, [status, remainingMs, elapsedMs]);

  const pause = useCallback(() => {
    if (status !== 'running') return;

    const now = Date.now();

    if (endTimeRef.current === null || segmentStartRef.current === null) {
        return;
    }

    const remaining = Math.max(0, endTimeRef.current - now);
    const elapsed =
        elapsedBeforeSegmentRef.current +
        (now - segmentStartRef.current);

    setRemainingMs(remaining);
    setElapsedMs(elapsed);

    elapsedBeforeSegmentRef.current = elapsed;

    endTimeRef.current = null;
    segmentStartRef.current = null;

    setStatus(remaining === 0 ? 'finished' : 'paused');
  }, [status]);

  const resume = useCallback(() => {
    if (status !== 'paused' || remainingMs <= 0) return;

    const now = Date.now();
    segmentStartRef.current = now;
    endTimeRef.current = now + remainingMs;

    setStatus('running');
  }, [status, remainingMs]);

  const reset = useCallback(() => {
    endTimeRef.current = null;
    segmentStartRef.current = null;
    elapsedBeforeSegmentRef.current = elapsedMs;

    setRemainingMs(totalMs);
    setStatus('idle');
  }, [totalMs, elapsedMs]);

  useEffect(() => {
    if (status !== 'running') return;

    updateTimer();

    const interval = setInterval(updateTimer, 250);

    return () => clearInterval(interval);
  }, [status, updateTimer]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        updateTimer();
      }
    });

    return () => subscription.remove();
  }, [updateTimer]);

  const formattedTime = (() => {
    const seconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
  })();

  return {
    remainingMs,
    elapsedMs,
    elapsedSeconds: Math.floor(elapsedMs / 1000),
    status,
    formattedTime,
    start,
    pause,
    resume,
    reset,
  };
}
