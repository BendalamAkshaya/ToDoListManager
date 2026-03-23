import { motion } from "framer-motion";
import { Task, CATEGORIES, PRIORITIES } from "@/types/task";
import { useTasks } from "@/context/TaskContext";
import { cn } from "@/lib/utils";
import { Check, Trash2, Calendar, Flag, MoreHorizontal } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { useState } from "react";

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

const categoryColors = {
  work: "bg-primary/10 text-primary",
  personal: "bg-accent/10 text-accent",
  study: "bg-[#8b5cf6]/10 text-[#8b5cf6]",
  health: "bg-success/10 text-success",
};

interface TaskCardProps {
  task: Task;
  index?: number;
}

export function TaskCard({ task, index = 0 }: TaskCardProps) {
  const { toggleComplete, deleteTask } = useTasks();
  const [showMenu, setShowMenu] = useState(false);
  const cat = CATEGORIES.find((c) => c.value === task.category);
  const isOverdue = task.status === "pending" && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = isToday(new Date(task.dueDate));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group relative rounded-2xl bg-card border border-border p-4 shadow-card hover:shadow-card-hover transition-all duration-300",
        task.status === "completed" && "opacity-70"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleComplete(task.id)}
          className={cn(
            "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0",
            task.status === "completed"
              ? "gradient-bg border-transparent"
              : "border-muted-foreground/30 hover:border-primary"
          )}
        >
          {task.status === "completed" && <Check className="w-3 h-3 text-primary-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium text-foreground leading-snug", task.status === "completed" && "line-through text-muted-foreground")}>
            {task.title}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", categoryColors[task.category])}>
              {cat?.emoji} {cat?.label}
            </span>
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", priorityColors[task.priority])}>
              {task.priority}
            </span>
          </div>

          {/* Due date */}
          <div className="flex items-center gap-1 mt-2">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className={cn("text-[11px]", isOverdue ? "text-destructive font-medium" : isDueToday ? "text-warning font-medium" : "text-muted-foreground")}>
              {isOverdue ? "Overdue · " : isDueToday ? "Today · " : ""}
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-10 bg-card border border-border rounded-xl shadow-lg py-1 w-32 animate-scale-in">
              <button
                onClick={() => { deleteTask(task.id); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-destructive hover:bg-muted transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
