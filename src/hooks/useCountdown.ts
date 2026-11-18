
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';

export type TimerStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'finished';

export default function useCountdown(initialMinutes: number) {

  const [remainingMs, setRemainingMs] = useState(
    initialMinutes * 60 * 1000
  );

  const [status, setStatus] = useState<TimerStatus>('idle');

  // Date exacte à laquelle le compte à rebours doit terminer
  const endTimeRef = useRef<number | null>(null);

  // Mettre à jour le temps restant
  const updateTimer = useCallback(() => {

    if (endTimeRef.current === null) return;

    const difference = Math.max(
      0,
      endTimeRef.current - Date.now()
    );

    setRemainingMs(difference);

    // Détection de la fin du compte à rebours
    if (difference <= 0) {
      endTimeRef.current = null;
      setRemainingMs(0);
      setStatus('finished');
    }

  }, []);

  // Démarrer
  const start = useCallback(() => {

    if (status !== 'idle' || remainingMs <= 0) return;

    endTimeRef.current = Date.now() + remainingMs;

    setStatus('running');

  }, [status, remainingMs]);

  // Mettre en pause
  const pause = useCallback(() => {

    if (status !== 'running') return;

    if (endTimeRef.current !== null) {
      const difference = Math.max(
        0,
        endTimeRef.current - Date.now()
      );

      setRemainingMs(difference);
      endTimeRef.current = null;

      setStatus(difference === 0 ? 'finished' : 'paused');
    }

  }, [status]);

  // Reprendre
  const resume = useCallback(() => {

    if (status !== 'paused' || remainingMs <= 0) return;

    endTimeRef.current = Date.now() + remainingMs;

    setStatus('running');

  }, [status, remainingMs]);

  // Réinitialiser
  const reset = useCallback((minutes?: number) => {

    endTimeRef.current = null;

    const newDuration = minutes !== undefined
      ? minutes
      : initialMinutes;

    setRemainingMs(newDuration * 60 * 1000);

    setStatus('idle');

  }, [initialMinutes]);

  // Actualisation du compteur et gestion de l'arrière-plan
  useEffect(() => {

    if (status !== 'running') return;

    const interval = setInterval(() => {
      updateTimer();
    }, 250);

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState) => {

        if (nextAppState === 'active') {
          updateTimer();
        }

      }
    );

    // Vérification immédiate
    updateTimer();

    return () => {
      clearInterval(interval);
      subscription.remove();
    };

  }, [status, updateTimer]);

  // Conversion millisecondes -> MM:SS
  const totalSeconds = Math.ceil(remainingMs / 1000);

  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  const formattedTime =
    `${String(minutes).padStart(2, '0')}:` +
    `${String(seconds).padStart(2, '0')}`;

  return {
    remainingMs,
    status,
    formattedTime,

    start,
    pause,
    resume,
    reset,
  };

}
