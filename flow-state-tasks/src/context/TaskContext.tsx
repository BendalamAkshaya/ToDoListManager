import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Task, Category, Priority, TaskStatus } from "@/types/task";
import { useAuth } from "@/context/AuthContext";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByCategory: (category: Category) => Task[];
  getTasksByPriority: (priority: Priority) => Task[];
  getOverdueTasks: () => Task[];
  getTodayTasks: () => Task[];
  getCompletedToday: () => Task[];
  searchTasks: (query: string) => Task[];
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    productivity: number;
    completedToday: number;
    totalToday: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const today = () => new Date().toISOString().split("T")[0];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/tasks/";

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token, isAuthenticated } = useAuth();
  
  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }

    fetch(API_URL, { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch(err => console.error("Error fetching tasks:", err));
  }, [isAuthenticated, getHeaders]);

  const addTask = useCallback(async (task: Omit<Task, "id" | "createdAt" | "status" | "user">) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(task),
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }, [getHeaders]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)); // Optimistic
      await fetch(`${API_URL}${id}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }, [getHeaders]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      setTasks(prev => prev.filter(t => t.id !== id)); // Optimistic
      await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }, [getHeaders]);

  const toggleComplete = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const completedAt = newStatus === "completed" ? new Date().toISOString() : null;
    
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, status: newStatus, completedAt: completedAt || undefined };
    })); // Optimistic

    try {
      await fetch(`${API_URL}${id}/`, {
        method: "PATCH",
        headers: getHeaders(),
        // @ts-ignore
        body: JSON.stringify({ status: newStatus, completedAt }),
      });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  }, [tasks, getHeaders]);

  const getTasksByStatus = useCallback((status: TaskStatus) => tasks.filter(t => t.status === status), [tasks]);
  const getTasksByCategory = useCallback((category: Category) => tasks.filter(t => t.category === category), [tasks]);
  const getTasksByPriority = useCallback((priority: Priority) => tasks.filter(t => t.priority === priority), [tasks]);

  const getOverdueTasks = useCallback(() => {
    const now = new Date().toISOString();
    return tasks.filter(t => t.status === "pending" && t.dueDate < now);
  }, [tasks]);

  const getTodayTasks = useCallback(() => {
    const d = today();
    return tasks.filter(t => t.dueDate?.startsWith(d));
  }, [tasks]);

  const getCompletedToday = useCallback(() => {
    const d = today();
    // @ts-ignore
    return tasks.filter(t => t.status === "completed" && t.completedAt?.startsWith(d));
  }, [tasks]);

  const searchTasks = useCallback((query: string) => {
    const q = query.toLowerCase();
    return tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
  }, [tasks]);

  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const completedToday = getCompletedToday().length;
  const todayTasks = getTodayTasks().length;

  const stats = {
    total: tasks.length,
    completed,
    pending,
    overdue: getOverdueTasks().length,
    productivity: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    completedToday,
    totalToday: todayTasks,
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleComplete, getTasksByStatus, getTasksByCategory, getTasksByPriority, getOverdueTasks, getTodayTasks, getCompletedToday, searchTasks, stats }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
