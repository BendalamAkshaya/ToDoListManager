import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { Category, Priority, CATEGORIES, PRIORITIES } from "@/types/task";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddTaskDialog({ open, onClose }: AddTaskDialogProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("work");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), description: description.trim() || undefined, category, priority, dueDate: new Date(dueDate).toISOString() });
    setTitle(""); setDescription(""); setCategory("work"); setPriority("medium");
    setDueDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-lg w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-foreground">Add New Task</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all" placeholder="What needs to be done?" autoFocus />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none h-20" placeholder="Add details..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground outline-none">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground outline-none">
                {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>

          <button type="submit" className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-glow">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
