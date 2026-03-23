import { useTasks } from "@/context/TaskContext";
import { TaskCard } from "@/components/TaskCard";

export default function CompletedTasks() {
  const { getTasksByStatus } = useTasks();
  const completed = getTasksByStatus("completed");

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Completed Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">{completed.length} tasks completed</p>
      </div>

      {completed.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-2">🎯</p>
          <p className="text-muted-foreground text-sm">No completed tasks yet. Keep going!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completed.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
