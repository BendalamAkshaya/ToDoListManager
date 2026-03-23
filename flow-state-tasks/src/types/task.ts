export type Priority = "high" | "medium" | "low";
export type Category = "work" | "personal" | "study" | "health";
export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // ISO string
  createdAt: string;
  completedAt?: string;
}

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "work", label: "Work", emoji: "💼" },
  { value: "personal", label: "Personal", emoji: "🏠" },
  { value: "study", label: "Study", emoji: "📚" },
  { value: "health", label: "Health", emoji: "💪" },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
