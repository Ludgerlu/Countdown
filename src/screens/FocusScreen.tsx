
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import { Task } from '../types/task';
import { useCountdown } from '../hooks/useCountdown';

interface Props {
  task: Task;
  onBack: () => void;
  onFinished: (actualSeconds: number) => void;
}

export default function FocusScreen({
  task,
  onBack,
  onFinished,
}: Props) {
  const {
    formattedTime,
    elapsedSeconds,
    status,
    start,
    pause,
    resume,
    reset,
  } = useCountdown(task.estimatedMinutes);

  const finishedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    if (status === 'finished' && !finishedRef.current) {
      finishedRef.current = true;
      onFinishedRef.current(elapsedSeconds);
    }
  }, [status, elapsedSeconds]);

  const formatElapsed = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}min ${secs}s`;

    return `${minutes}min ${secs}s`;
  };

  const handleReset = () => {
    finishedRef.current = false;
    reset();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Retour aux tâches</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>MODE CONCENTRATION</Text>

        <Text style={styles.taskTitle}>{task.title}</Text>

        {!!task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}

        <View style={styles.timerCircle}>
          <Text style={styles.timer}>{formattedTime}</Text>
          <Text style={styles.timerLabel}>TEMPS RESTANT</Text>
        </View>

        <View style={styles.elapsedContainer}>
          <Text style={styles.elapsedLabel}>Temps réellement travaillé</Text>
          <Text style={styles.elapsedValue}>
            {formatElapsed(elapsedSeconds)}
          </Text>
        </View>

        <View style={styles.controls}>
          {status === 'idle' && (
            <TouchableOpacity style={styles.primaryButton} onPress={start}>
              <Text style={styles.primaryButtonText}>▶ Démarrer</Text>
            </TouchableOpacity>
          )}

          {status === 'running' && (
            <TouchableOpacity style={styles.primaryButton} onPress={pause}>
              <Text style={styles.primaryButtonText}>Ⅱ Pause</Text>
            </TouchableOpacity>
          )}

          {status === 'paused' && (
            <TouchableOpacity style={styles.primaryButton} onPress={resume}>
              <Text style={styles.primaryButtonText}>▶ Reprendre</Text>
            </TouchableOpacity>
          )}

          {status !== 'finished' && (
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>↻ Réinitialiser le compte à rebours</Text>
            </TouchableOpacity>
          )}
        </View>

        {status === 'finished' && (
          <View style={styles.finishedBox}>
            <Text style={styles.finishedTitle}>Temps écoulé ! 🎉</Text>
            <Text style={styles.finishedDescription}>
              Il est temps de faire le bilan de cette tâche.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8EF',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  backText: {
    color: '#8C6548',
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  eyebrow: {
    color: '#E68A45',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 14,
  },
  taskTitle: {
    color: '#39291F',
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: '#987F6D',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  timerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 10,
    borderColor: '#F5B477',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    backgroundColor: '#FFF0DF',
  },
  timer: {
    fontSize: 54,
    fontWeight: '800',
    color: '#3B2B21',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 11,
    color: '#A17A5D',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  elapsedContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  elapsedLabel: {
    color: '#A18B79',
    fontSize: 13,
  },
  elapsedValue: {
    color: '#4B392D',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 5,
  },
  controls: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#E98742',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  resetButton: {
    padding: 14,
    alignItems: 'center',
  },
  resetText: {
    color: '#9B7960',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  finishedBox: {
    backgroundColor: '#FCE5CE',
    borderRadius: 18,
    padding: 18,
    marginTop: 22,
    width: '100%',
    alignItems: 'center',
  },
  finishedTitle: {
    color: '#A65320',
    fontSize: 18,
    fontWeight: '800',
  },
  finishedDescription: {
    color: '#8C6548',
    textAlign: 'center',
    marginTop: 6,
  },
});
