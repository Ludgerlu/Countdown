
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const TASKS_KEY = '@countdown/tasks';
const ACTIVE_TASK_KEY = '@countdown/active_task';

export const taskStorage = {

  // Récupérer toutes les tâches
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);

      return data ? JSON.parse(data) : [];

    } catch (error) {
      console.error('Erreur de lecture des tâches:', error);
      return [];
    }
  },

  // Enregistrer les tâches
  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        TASKS_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      throw error;
    }
  },

  // Récupérer la tâche active
  async getActiveTaskId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACTIVE_TASK_KEY);
    } catch (error) {
      console.error('Erreur de lecture de la tâche active:', error);
      return null;
    }
  },

  // Enregistrer la tâche active
  async saveActiveTaskId(id: string | null): Promise<void> {
    try {
      if (id) {
        await AsyncStorage.setItem(ACTIVE_TASK_KEY, id);
      } else {
        await AsyncStorage.removeItem(ACTIVE_TASK_KEY);
      }
    } catch (error) {
      console.error('Erreur de sauvegarde de la tâche active:', error);
      throw error;
    }
  },

};
