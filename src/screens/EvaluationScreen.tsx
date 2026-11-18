
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  View,
} from 'react-native';

import { Task } from '../types/task';

interface Props {
  task: Task;
  actualSeconds: number;
  onComplete: (rating: number) => void;
  onAddTime: (rating: number, minutes: number) => void;
  onPostpone: (rating: number) => void;
}

export default function EvaluationScreen({
  task,
  actualSeconds,
  onComplete,
  onAddTime,
  onPostpone,
}: Props) {
  const [rating, setRating] = useState(8);
  const [additionalMinutes, setAdditionalMinutes] = useState('15');

  const minutes = Math.floor(actualSeconds / 60);
  const seconds = actualSeconds % 60;

  const handleAddTime = () => {
    const duration = Number(additionalMinutes);

    if (!Number.isInteger(duration) || duration < 1 || duration > 1440) {
      return;
    }

    onAddTime(rating, duration);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.emoji}>🎯</Text>

        <Text style={styles.title}>Time to reflect!</Text>

        <Text style={styles.subtitle}>
          How did it go with this task?
        </Text>

        <View style={styles.taskCard}>
          <Text style={styles.taskLabel}>YOUR TASK</Text>
          <Text style={styles.taskTitle}>{task.title}</Text>

          <View style={styles.timeRow}>
            <View>
              <Text style={styles.infoLabel}>Estimated</Text>
              <Text style={styles.infoValue}>
                {task.estimatedMinutes} min
              </Text>
            </View>

            <View>
              <Text style={styles.infoLabel}>Actual time</Text>
              <Text style={styles.infoValue}>
                {minutes}m {seconds}s
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Rate your work
        </Text>

        <Text style={styles.ratingValue}>{rating}/10</Text>

        <View style={styles.ratingContainer}>
          {Array.from({ length: 10 }, (_, index) => index + 1).map(value => (
            <Pressable
              key={value}
              onPress={() => setRating(value)}
              style={[
                styles.ratingButton,
                rating === value && styles.ratingButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.ratingText,
                  rating === value && styles.ratingTextActive,
                ]}
              >
                {value}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.ratingHint}>
          1 = Not satisfied · 10 = Excellent
        </Text>

        <Text style={styles.sectionTitle}>
          Did you complete this task?
        </Text>

        <Pressable
          style={styles.completeButton}
          onPress={() => onComplete(rating)}
        >
          <Text style={styles.completeButtonText}>
            ✓ Yes, task completed
          </Text>
        </Pressable>

        <View style={styles.continueCard}>
          <Text style={styles.continueTitle}>
            Not finished yet?
          </Text>

          <Text style={styles.continueDescription}>
            Add more time and continue working on it.
          </Text>

          <Text style={styles.inputLabel}>
            Additional time (minutes)
          </Text>

          <TextInput
            style={styles.input}
            value={additionalMinutes}
            onChangeText={setAdditionalMinutes}
            keyboardType="number-pad"
            placeholder="15"
            placeholderTextColor="#B9A99C"
          />

          <Pressable
            style={styles.addTimeButton}
            onPress={handleAddTime}
          >
            <Text style={styles.addTimeButtonText}>
              + Add time and continue
            </Text>
          </Pressable>

          <Pressable
            style={styles.postponeButton}
            onPress={() => onPostpone(rating)}
          >
            <Text style={styles.postponeText}>
              Postpone this task
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E9',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginTop: 20,
  },
  title: {
    color: '#302923',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 12,
  },
  subtitle: {
    color: '#A18B7A',
    fontSize: 14,
    marginTop: 7,
    marginBottom: 25,
  },
  taskCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },
  taskLabel: {
    color: '#E98742',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  taskTitle: {
    color: '#302923',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  infoLabel: {
    color: '#A18B7A',
    fontSize: 11,
  },
  infoValue: {
    color: '#4B392D',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 5,
  },
  sectionTitle: {
    color: '#302923',
    fontSize: 17,
    fontWeight: '900',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  ratingValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#E98742',
    marginBottom: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 7,
  },
  ratingButton: {
    width: 34,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#FFEBDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingButtonActive: {
    backgroundColor: '#FF923E',
  },
  ratingText: {
    color: '#98765B',
    fontWeight: '800',
  },
  ratingTextActive: {
    color: '#FFFFFF',
  },
  ratingHint: {
    color: '#A18B7A',
    fontSize: 11,
    marginTop: 12,
    marginBottom: 30,
  },
  completeButton: {
    width: '100%',
    backgroundColor: '#4E9B72',
    padding: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 25,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  continueCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  continueTitle: {
    color: '#302923',
    fontSize: 17,
    fontWeight: '900',
  },
  continueDescription: {
    color: '#A18B7A',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 15,
  },
  inputLabel: {
    color: '#6F5A48',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF8F1',
    borderWidth: 1,
    borderColor: '#F0E3D8',
    borderRadius: 13,
    padding: 14,
    color: '#302923',
  },
  addTimeButton: {
    backgroundColor: '#FF923E',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 13,
  },
  addTimeButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  postponeButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  postponeText: {
    color: '#98765B',
    fontWeight: '700',
  },
});
