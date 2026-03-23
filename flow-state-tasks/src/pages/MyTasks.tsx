import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { Plus, Search, Filter } from "lucide-react";
import { Category, Priority } from "@/types/task";
import { cn } from "@/lib/utils";

export default function MyTasks() {
  const { tasks, searchTasks } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");

  let filtered = search ? searchTasks(search) : [...tasks];
  if (filterStatus !== "all") filtered = filtered.filter((t) => t.status === filterStatus);
  if (filterPriority !== "all") filtered = filtered.filter((t) => t.priority === filterPriority);
  if (filterCategory !== "all") filtered = filtered.filter((t) => t.category === filterCategory);

  // Sort: pending first, then by priority, then by due date
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  filtered.sort((a, b) => {
    if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
    if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const chipClass = (active: boolean) =>
    cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
      active ? "gradient-bg text-primary-foreground border-transparent shadow-glow" : "bg-muted text-muted-foreground border-border hover:bg-accent/10");

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} tasks</p>
        </div>
        <button onClick={() => setDialogOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-glow">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full" placeholder="Search tasks..." />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Filter className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Status:</span>
          </div>
          {(["all", "pending", "completed"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={chipClass(filterStatus === s)}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}

          <span className="text-border mx-1">|</span>
          <span className="text-xs text-muted-foreground self-center">Priority:</span>
          {(["all", "high", "medium", "low"] as const).map((p) => (
            <button key={p} onClick={() => setFilterPriority(p)} className={chipClass(filterPriority === p)}>
              {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}

          <span className="text-border mx-1">|</span>
          <span className="text-xs text-muted-foreground self-center">Category:</span>
          {(["all", "work", "personal", "study", "health"] as const).map((c) => (
            <button key={c} onClick={() => setFilterCategory(c)} className={chipClass(filterCategory === c)}>
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-sm">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      )}

      <AddTaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      {/* FAB mobile */}
      <button
        onClick={() => setDialogOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-bg text-primary-foreground shadow-glow flex items-center justify-center animate-float z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
