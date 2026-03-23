import { useTasks } from "@/context/TaskContext";
import { TaskCard } from "@/components/TaskCard";
import { CATEGORIES } from "@/types/task";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  const { getTasksByCategory, tasks } = useTasks();

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">Organize your tasks by category</p>
      </div>

      {CATEGORIES.map((cat, ci) => {
        const catTasks = getTasksByCategory(cat.value);
        const completed = catTasks.filter((t) => t.status === "completed").length;
        const pct = catTasks.length > 0 ? Math.round((completed / catTasks.length) * 100) : 0;

        return (
          <motion.div key={cat.value} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                <span className="text-lg">{cat.emoji}</span> {cat.label}
                <span className="text-xs text-muted-foreground font-normal ml-1">({catTasks.length})</span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full gradient-bg transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{pct}%</span>
              </div>
            </div>

            {catTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No tasks in this category</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
