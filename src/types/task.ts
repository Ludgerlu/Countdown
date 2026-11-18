
export type TaskStatus =
  | 'todo'
  | 'in_progress'
  | 'completed'
  | 'postponed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  actualSeconds: number;
  priority: TaskPriority;
  status: TaskStatus;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  estimatedMinutes: number;
  priority: TaskPriority;
}
