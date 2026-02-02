export type TaskType = 'lead' | 'general' | 'vehicle_prep' | 'admin';
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'rejected';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Staff Name
  assignedBy: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: Date;
  type: TaskType;
  createdAt: Date;
  notes?: string;
  rejectionReason?: string;
}
