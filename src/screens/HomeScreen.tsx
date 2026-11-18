
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

import TaskCard from '../components/TaskCard';


import FocusScreen from './FocusScreen';


import EvaluationScreen from './EvaluationScreen';


import { Task, TaskFormData, TaskPriority } from '../types/task';

import { taskStorage } from '../storage/taskStorage';

type FilterType = 'all' | 'todo' | 'completed';

export default function HomeScreen() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [showFocus, setShowFocus] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('30');
  const [priority, setPriority] = useState<TaskPriority>('medium');


    const [currentScreen, setCurrentScreen] = useState<'home' | 'focus' | 'evaluation'>('home');
    const [sessionMinutes, setSessionMinutes] = useState<number | undefined>(undefined);
    const [evaluationActualSeconds, setEvaluationActualSeconds] = useState(0);


  // CHARGEMENT INITIAL
  useEffect(() => {

    const loadData = async () => {
      try {

        const savedTasks = await taskStorage.getTasks();
        const savedActiveId = await taskStorage.getActiveTaskId();

        const normalizedTasks = savedTasks.map(task => ({
            ...task,
            actualSeconds: task.actualSeconds ?? 0,
        }));

        setTasks(normalizedTasks);

        const validActiveTask = savedTasks.find(
          task =>
            task.id === savedActiveId &&
            task.status === 'in_progress'
        );

        setActiveTaskId(validActiveTask ? validActiveTask.id : null);

      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger les tâches.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, []);

  // SAUVEGARDE DES TÂCHES
  useEffect(() => {

    if (!loading) {
      taskStorage.saveTasks(tasks).catch(error => {
        console.error(error);
      });
    }

  }, [tasks, loading]);

  // SAUVEGARDE DE LA TÂCHE ACTIVE
  useEffect(() => {

    if (!loading) {
      taskStorage.saveActiveTaskId(activeTaskId).catch(error => {
        console.error(error);
      });
    }

  }, [activeTaskId, loading]);

  // OUVRIR LE FORMULAIRE
  const openAddModal = () => {

    setEditingTask(null);

    setTitle('');
    setDescription('');
    setEstimatedMinutes('30');
    setPriority('medium');

    setModalVisible(true);

  };

  // OUVRIR LE FORMULAIRE DE MODIFICATION
  const openEditModal = (task: Task) => {

    setEditingTask(task);

    setTitle(task.title);
    setDescription(task.description);
    setEstimatedMinutes(String(task.estimatedMinutes));
    setPriority(task.priority);

    setModalVisible(true);

  };

  // ENREGISTRER UNE TÂCHE
  const saveTask = () => {

    
    const cleanTitle = title.trim();
    const duration = Number(estimatedMinutes);

    if (!cleanTitle) {
      Alert.alert('Attention', 'Le titre de la tâche est obligatoire.');
      return;
    }

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 1440
    ) {
      Alert.alert(
        'Durée invalide',
        'Choisis une durée comprise entre 1 et 1440 minutes.'
      );
      return;
    }

    const now = new Date().toISOString();

    const formData: TaskFormData = {

      title: cleanTitle,
      description: description.trim(),
      estimatedMinutes: duration,
      priority,
    };

    if (editingTask) {

      setTasks(previous =>
        previous.map(task =>
          task.id === editingTask.id
            ? {
                ...task,
                ...formData,
                updatedAt: now,
              }
            : task
        )
      );

    } else {

      const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...formData,
        actualSeconds: 0,
        status: 'todo',
        rating: null,
        createdAt: now,
        updatedAt: now,
      };

      setTasks(previous => [newTask, ...previous]);

    }

    setModalVisible(false);

  };

  // SUPPRIMER UNE TÂCHE
  const deleteTask = (task: Task) => {

    Alert.alert(
      'Supprimer la tâche',
      `Veux-tu vraiment supprimer "${task.title}" ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {

            setTasks(previous =>
              previous.filter(item => item.id !== task.id)
            );

            if (activeTaskId === task.id) {
              setActiveTaskId(null);
            }

          },
        },
      ]
    );

  };

  // SÉLECTIONNER UNE TÂCHE
  const selectTask = (task: Task) => {

    if (task.status === 'completed') return;

    // Désélectionner la tâche active
    if (activeTaskId === task.id) {

      Alert.alert(
        'Libérer la tâche',
        'Veux-tu désélectionner cette tâche ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Libérer',
            onPress: () => {

              setTasks(previous =>
                previous.map(item =>
                  item.id === task.id
                    ? {
                        ...item,
                        status: 'todo',
                        updatedAt: new Date().toISOString(),
                      }
                    : item
                )
              );

              setActiveTaskId(null);

            },
          },
        ]
      );

      return;
    }

    // Vérifier si une autre tâche est déjà active
    if (activeTaskId !== null) {

      Alert.alert(
        'Une tâche est déjà active',
        'Libère ou termine la tâche actuelle avant d\'en sélectionner une autre.'
      );

      return;
    }

    setTasks(previous =>
      previous.map(item =>
        item.id === task.id
          ? {
              ...item,
              status: 'in_progress',
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    setActiveTaskId(task.id);

  };

  // DÉMARRER UNE SESSION DE FOCUS
    const startFocus = () => {
        if (!activeTask) {
            Alert.alert('Aucune tâche', 'Sélectionne d’abord une tâche.');
            return;
        }

        setSessionMinutes(undefined);
        setCurrentScreen('focus');
    };

    // GÉRER LA FIN D'UNE SESSION DE FOCUS
    const handleFocusFinished = (sessionActualSeconds: number) => {
        if (!activeTask) return;

        const totalActualSeconds = (activeTask.actualSeconds ?? 0) + sessionActualSeconds;

        setTasks(previous =>
            previous.map(task =>
            task.id === activeTask.id
                ? {
                    ...task,
                    actualSeconds: totalActualSeconds,
                    updatedAt: new Date().toISOString(),
                }
                : task
            )
        );

        setEvaluationActualSeconds(totalActualSeconds);
        setCurrentScreen('evaluation');
    };

    // GÉRER LA FIN D'UNE TÂCHE
    const handleTaskCompleted = (rating: number) => {
        if (!activeTask) return;

        setTasks(previous =>
            previous.map(task =>
            task.id === activeTask.id
                ? {
                    ...task,
                    status: 'completed',
                    rating,
                    updatedAt: new Date().toISOString(),
                }
                : task
            )
        );

        setActiveTaskId(null);
        setSessionMinutes(undefined);
        setCurrentScreen('home');
    };


    // GÉRER L'AJOUT DE TEMPS À UNE TÂCHE
    const handleAddTime = (rating: number, minutes: number) => {
    if (!activeTask) return;

    setTasks(previous =>
        previous.map(task =>
        task.id === activeTask.id
            ? {
                ...task,
                rating,
                updatedAt: new Date().toISOString(),
            }
            : task
        )
    );

    setSessionMinutes(minutes);
    setCurrentScreen('focus');
    };

    // GÉRER LE REPORT D'UNE TÂCHE
    const handlePostpone = (rating: number) => {
    if (!activeTask) return;

    setTasks(previous =>
        previous.map(task =>
        task.id === activeTask.id
            ? {
                ...task,
                status: 'postponed',
                rating,
                updatedAt: new Date().toISOString(),
            }
            : task
        )
    );

    setActiveTaskId(null);
    setSessionMinutes(undefined);
    setCurrentScreen('home');
    };


  // FILTRER LES TÂCHES
  const filteredTasks = tasks.filter(task => {

    if (filter === 'todo') {
      return task.status === 'todo' ||
        task.status === 'in_progress';
    }

    if (filter === 'completed') {
      return task.status === 'completed';
    }

    return true;

  });

  const completedCount = tasks.filter(
    task => task.status === 'completed'
  ).length;

  const activeTask = tasks.find(
    task => task.id === activeTaskId
  );

  // ÉCRAN DE CHARGEMENT
    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF923E" />
                <Text style={styles.loadingText}>
                Loading your tasks...
                </Text>
            </View>
            </SafeAreaView>
        );
    }

    // ÉCRAN FOCUS
    if (currentScreen === 'focus' && activeTask) {
        return (
            <FocusScreen
            key={`${activeTask.id}-${sessionMinutes ?? 'initial'}`}
            task={activeTask}
            sessionMinutes={sessionMinutes}
            onBack={() => setCurrentScreen('home')}
            onFinished={handleFocusFinished}
            />
        );
    }

    // ÉCRAN ÉVALUATION
    if (currentScreen === 'evaluation' && activeTask) {
        return (
            <EvaluationScreen
            task={activeTask}
            actualSeconds={evaluationActualSeconds}
            onComplete={handleTaskCompleted}
            onAddTime={handleAddTime}
            onPostpone={handlePostpone}
            />
        );
    }

  return (

    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF5E9"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View
        style={{
            flex: 1,
            display: showFocus ? 'none' : 'flex',
        }}
        >

        {/* HEADER */}
        <View style={styles.header}>

          <View>
            <Text style={styles.logo}>Countdown.</Text>
            <Text style={styles.headerSubtitle}>
              Make time for you! ✨
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.sun}>☀️</Text>
          </View>

        </View>

        {/* SUMMARY */}
        <View style={styles.summary}>

          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>
              Your tasks
            </Text>

            <Text style={styles.summarySubtitle}>
              Small steps, big achievements.
            </Text>
          </View>

          <View style={styles.summaryCount}>
            <Text style={styles.countNumber}>
              {completedCount}/{tasks.length}
            </Text>

            <Text style={styles.countLabel}>
              Completed
            </Text>
          </View>

        </View>

        {/* ACTIVE TASK */}
        {activeTask && (
          <View style={styles.activeBanner}>

            <Text style={styles.activeBannerLabel}>
              CURRENT TASK
            </Text>

            <Text style={styles.activeBannerTitle}>
              {activeTask.title}
            </Text>

            <Text style={styles.activeBannerSubtitle}>
              Estimated time: {activeTask.estimatedMinutes} min
            </Text>

            <Text style={styles.activeBannerHint}>
              Complete or release this task before choosing another.
            </Text>

            <Pressable
                style={styles.startFocusButton}
                onPress={startFocus}
                >
                <Text style={styles.startFocusButtonText}>
                    ▶ Start working
                </Text>
            </Pressable>

            {/* <Pressable
                style={styles.focusButton}
                onPress={() => setShowFocus(true)}
            >
            <Text style={styles.focusButtonText}>
                ▶  Start focus
            </Text>
            </Pressable> */}


            


          </View>
        )}

        {/* FILTERS */}
        <View style={styles.filterContainer}>

          {[
            { key: 'all', label: 'All' },
            { key: 'todo', label: 'To do' },
            { key: 'completed', label: 'Completed' },
          ].map(item => (

            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key as FilterType)}
              style={[
                styles.filterButton,
                filter === item.key && styles.filterButtonActive,
              ]}
            >
              <Text style={[
                styles.filterText,
                filter === item.key && styles.filterTextActive,
              ]}>
                {item.label}
              </Text>
            </Pressable>

          ))}

        </View>

        {/* TASK LIST */}
        <View style={styles.taskHeader}>

          <Text style={styles.sectionTitle}>
            My list
          </Text>

          <Text style={styles.taskCount}>
            {filteredTasks.length} tasks
          </Text>

        </View>

        {filteredTasks.length === 0 ? (

          <View style={styles.emptyState}>

            <Text style={styles.emptyEmoji}>
              {filter === 'completed' ? '🎉' : '📝'}
            </Text>

            <Text style={styles.emptyTitle}>
              {filter === 'completed'
                ? 'No completed tasks yet'
                : 'Your list is empty'}
            </Text>

            <Text style={styles.emptyDescription}>
              {filter === 'completed'
                ? 'Your achievements will appear here.'
                : 'Add your first task and get started!'}
            </Text>

          </View>

        ) : (

          filteredTasks.map(task => (

            <TaskCard
              key={task.id}
              task={task}
              isActive={activeTaskId === task.id}
              locked={
                activeTaskId !== null &&
                activeTaskId !== task.id
              }
              onSelect={selectTask}
              onEdit={openEditModal}
              onDelete={deleteTask}
            />

          ))

        )}

        {/* ADD BUTTON */}
        <Pressable
          style={styles.addButton}
          onPress={openAddModal}
        >
          <Text style={styles.addButtonText}>
            +  Add a new task
          </Text>
        </Pressable>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for your time
          </Text>
        </View>



        </View>

        {activeTask && (
        <View
            style={{
            flex: 1,
            display: showFocus ? 'flex' : 'none',
            }}
        >
            {activeTask && (
  <View
    style={{
      flex: 1,
      display: showFocus ? 'flex' : 'none',
        }}
    >
        <FocusScreen
        key={activeTask.id}
        task={activeTask}
        onBack={() => setShowFocus(false)}
        onFinished={(actualSeconds) => {
            setTasks(previous =>
            previous.map(item =>
                item.id === activeTask.id
                ? {
                    ...item,
                    actualSeconds:
                        (item.actualSeconds ?? 0) + actualSeconds,
                    updatedAt: new Date().toISOString(),
                    }
                : item
            )
            );
        }}
        />
    </View>
    )}
        </View>
        )}

      </ScrollView>

      {/* ADD / EDIT MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>

              <Text style={styles.modalTitle}>
                {editingTask ? 'Edit task ✏️' : 'New task ✨'}
              </Text>

              <Pressable
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>

            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              <Text style={styles.inputLabel}>
                Task title *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="What do you want to do?"
                placeholderTextColor="#B9A99C"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />

              <Text style={styles.inputLabel}>
                Description
              </Text>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add some details..."
                placeholderTextColor="#B9A99C"
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
              />

              <Text style={styles.inputLabel}>
                Estimated time (minutes)
              </Text>

              <TextInput
                style={styles.input}
                placeholder="30"
                placeholderTextColor="#B9A99C"
                keyboardType="number-pad"
                value={estimatedMinutes}
                onChangeText={setEstimatedMinutes}
                maxLength={4}
              />

              <Text style={styles.inputLabel}>
                Priority
              </Text>

              <View style={styles.priorityContainer}>

                {[
                  { key: 'low', label: 'Low' },
                  { key: 'medium', label: 'Medium' },
                  { key: 'high', label: 'High' },
                ].map(item => (

                  <Pressable
                    key={item.key}
                    onPress={() => setPriority(item.key as TaskPriority)}
                    style={[
                      styles.priorityButton,
                      priority === item.key &&
                        styles.priorityButtonActive,
                    ]}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      priority === item.key &&
                        styles.priorityButtonTextActive,
                    ]}>
                      {item.label}
                    </Text>
                  </Pressable>

                ))}

              </View>

              <Pressable
                style={styles.saveButton}
                onPress={saveTask}
              >
                <Text style={styles.saveButtonText}>
                  {editingTask ? 'Save changes' : 'Create task'}
                </Text>
              </Pressable>

            </ScrollView>

          </View>

        </View>

      </Modal>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E9',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 30,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#8E7A6B',
    marginTop: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: 25,
    fontWeight: '900',
    color: '#302923',
  },

  headerSubtitle: {
    color: '#A18B7A',
    fontSize: 12,
    marginTop: 4,
  },

  headerIcon: {
    backgroundColor: '#FFE2C2',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sun: {
    fontSize: 22,
  },

  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 22,
  },

  summaryText: {
    flex: 1,
  },

  summaryTitle: {
    color: '#302923',
    fontSize: 26,
    fontWeight: '900',
  },

  summarySubtitle: {
    color: '#A18B7A',
    fontSize: 12,
    marginTop: 5,
  },

  summaryCount: {
    backgroundColor: '#FFE8D2',
    borderRadius: 18,
    padding: 13,
    alignItems: 'center',
  },

  countNumber: {
    color: '#D97829',
    fontSize: 19,
    fontWeight: '900',
  },

  countLabel: {
    color: '#9E7758',
    fontSize: 10,
  },

  activeBanner: {
    backgroundColor: '#FF923E',
    padding: 18,
    borderRadius: 22,
    marginBottom: 22,
  },

  activeBannerLabel: {
    color: '#FFF1E6',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  activeBannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },

  activeBannerSubtitle: {
    color: '#FFF1E6',
    fontSize: 12,
    marginTop: 5,
  },

  activeBannerHint: {
    color: '#FFF1E6',
    fontSize: 10,
    marginTop: 12,
  },

  filterContainer: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 25,
  },

  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#FFEBDD',
  },

  filterButtonActive: {
    backgroundColor: '#FF923E',
  },

  filterText: {
    color: '#98765B',
    fontSize: 12,
    fontWeight: '700',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    color: '#302923',
    fontSize: 19,
    fontWeight: '900',
  },

  taskCount: {
    color: '#A18B7A',
    fontSize: 12,
  },

  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    color: '#302923',
    fontSize: 16,
    fontWeight: '800',
  },

  emptyDescription: {
    color: '#A18B7A',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },

  addButton: {
    backgroundColor: '#FF923E',
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },

  footer: {
    alignItems: 'center',
    marginTop: 30,
  },

  footerText: {
    color: '#A18B7A',
    fontSize: 11,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(48,41,35,0.45)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFF9F3',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 35,
    maxHeight: '90%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  modalTitle: {
    fontSize: 22,
    color: '#302923',
    fontWeight: '900',
  },

  closeButton: {
    color: '#8E7A6B',
    fontSize: 22,
    padding: 5,
  },

  inputLabel: {
    color: '#6F5A48',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 9,
    marginTop: 15,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E3D8',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 14,
    color: '#302923',
  },

  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },

  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  priorityButton: {
    flex: 1,
    backgroundColor: '#FFEBDD',
    paddingVertical: 13,
    borderRadius: 13,
    alignItems: 'center',
  },

  priorityButtonActive: {
    backgroundColor: '#FF923E',
  },

  priorityButtonText: {
    color: '#98765B',
    fontWeight: '700',
    fontSize: 12,
  },

  priorityButtonTextActive: {
    color: '#FFFFFF',
  },

  saveButton: {
    backgroundColor: '#FF923E',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 28,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  focusButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginTop: 14,
 },

 focusButtonText: {
    color: '#D97829',
    fontSize: 13,
    fontWeight: '900',
 },

startFocusButton: {
  backgroundColor: '#FFFFFF',
  paddingVertical: 13,
  borderRadius: 13,
  alignItems: 'center',
  marginTop: 15,
},

startFocusButtonText: {
  color: '#D97829',
  fontSize: 13,
  fontWeight: '900',
},


});
