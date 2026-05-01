import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Task, Category, Priority, TaskStatus } from "@/types/task";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "status" | "user">) => void;
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

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { isAuthenticated } = useAuth();
  
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }
    const { data, error } = await supabase.from('tasks').select('*').order('createdAt', { ascending: false });
    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data || []);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (task: Omit<Task, "id" | "createdAt" | "status" | "user">) => {
    // Determine current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return;

    const newTask = {
        ...task,
        user_id: userData.user.id
    };

    const { data, error } = await supabase.from('tasks').insert([newTask]).select().single();
    if (error) {
      console.error("Error adding task:", error);
    } else if (data) {
      setTasks(prev => [data, ...prev]);
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)); // Optimistic
    
    // In strict mode, some keys might be passed that Supabase doesn't need to change if unchanged,
    // but a `.update` will correctly map to only those changes.
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (error) {
      console.error("Error updating task:", error);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id)); // Optimistic
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error("Error deleting task:", error);
    }
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const completedAt = newStatus === "completed" ? new Date().toISOString() : null;
    
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, status: newStatus, completedAt: completedAt || undefined };
    })); // Optimistic

    // @ts-ignore - Nullable types correctly handled by supabase
    const { error } = await supabase.from('tasks').update({ status: newStatus, completedAt }).eq('id', id);
    if (error) {
      console.error("Error toggling task completion:", error);
    }
  }, [tasks]);

  const getTasksByStatus = useCallback((status: TaskStatus) => tasks.filter(t => t.status === status), [tasks]);
  const getTasksByCategory = useCallback((category: Category) => tasks.filter(t => t.category === category), [tasks]);
  const getTasksByPriority = useCallback((priority: Priority) => tasks.filter(t => t.priority === priority), [tasks]);

  const getOverdueTasks = useCallback(() => {
    const now = new Date().toISOString();
    return tasks.filter(t => t.status === "pending" && t.dueDate && t.dueDate < now);
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
