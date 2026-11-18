
import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import { Task } from '../types/task';

interface Props {
  task: Task;
  isActive: boolean;
  locked: boolean;
  onSelect: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({
  task,
  isActive,
  locked,
  onSelect,
  onEdit,
  onDelete,
}: Props) {

  const priorityLabel = {
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute',
  };

  const priorityColor = {
    low: '#67A77B',
    medium: '#D99B35',
    high: '#E66C50',
  };

  const statusLabel = {
    todo: 'À faire',
    in_progress: 'En cours',
    completed: 'Terminée',
    postponed: 'Reportée',
  };

  const isCompleted = task.status === 'completed';

  return (
    <View style={[
      styles.card,
      isActive && styles.activeCard,
      isCompleted && styles.completedCard,
    ]}>

      {/* TOP */}
      <View style={styles.topRow}>

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              isCompleted && styles.completedTitle,
            ]}
          >
            {task.title}
          </Text>

          <Text style={styles.description}>
            {task.description || 'Aucune description'}
          </Text>
        </View>

        <View style={[
          styles.priorityBadge,
          { backgroundColor: priorityColor[task.priority] + '20' },
        ]}>
          <Text style={[
            styles.priorityText,
            { color: priorityColor[task.priority] },
          ]}>
            {priorityLabel[task.priority]}
          </Text>
        </View>

      </View>

      {/* INFORMATION */}
      <View style={styles.infoRow}>

        <Text style={styles.infoText}>
          ⏱ {task.estimatedMinutes} min
        </Text>

        <Text style={[
          styles.status,
          isActive && styles.activeStatus,
        ]}>
          {isActive ? '● ACTIVE' : statusLabel[task.status]}
        </Text>

      </View>

      {/* RATING */}
      {task.rating !== null && (
        <Text style={styles.rating}>
          ⭐ Évaluation : {task.rating}/10
        </Text>
      )}

      {/* ACTIONS */}
      <View style={styles.actions}>

        {!isCompleted && (
          <Pressable
            disabled={locked && !isActive}
            onPress={() => onSelect(task)}
            style={[
              styles.selectButton,
              isActive && styles.activeButton,
              locked && !isActive && styles.disabledButton,
            ]}
          >
            <Text style={styles.selectButtonText}>
              {isActive
                ? '✓ Tâche sélectionnée'
                : locked
                  ? 'Une autre tâche est active'
                  : 'Sélectionner'}
            </Text>
          </Pressable>
        )}

        <View style={styles.secondaryActions}>

          <Pressable
            onPress={() => onEdit(task)}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>✏️</Text>
          </Pressable>

          <Pressable
            onPress={() => onDelete(task)}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>🗑️</Text>
          </Pressable>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 22,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F5E9DD',
  },

  activeCard: {
    borderColor: '#FF923E',
    borderWidth: 2,
  },

  completedCard: {
    opacity: 0.75,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#302923',
  },

  completedTitle: {
    textDecorationLine: 'line-through',
  },

  description: {
    fontSize: 12,
    color: '#A18B7A',
    marginTop: 5,
  },

  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  priorityText: {
    fontSize: 10,
    fontWeight: '800',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  infoText: {
    color: '#8E7A6B',
    fontSize: 12,
    fontWeight: '600',
  },

  status: {
    color: '#8E7A6B',
    fontSize: 11,
    fontWeight: '800',
  },

  activeStatus: {
    color: '#FF923E',
  },

  rating: {
    marginTop: 12,
    color: '#D99035',
    fontSize: 12,
    fontWeight: '700',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },

  selectButton: {
    flex: 1,
    backgroundColor: '#FFF0E1',
    paddingVertical: 12,
    borderRadius: 13,
    alignItems: 'center',
  },

  activeButton: {
    backgroundColor: '#FF923E',
  },

  disabledButton: {
    opacity: 0.4,
  },

  selectButtonText: {
    color: '#8E6D55',
    fontSize: 12,
    fontWeight: '800',
  },

  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },

  iconButton: {
    backgroundColor: '#FFF5E9',
    padding: 10,
    borderRadius: 12,
  },

  iconText: {
    fontSize: 16,
  },

});
