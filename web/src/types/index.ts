export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  category: string;
  isCompleted: boolean;
  deadline: string;
  reminderAt: string | null;
  userId: number;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
