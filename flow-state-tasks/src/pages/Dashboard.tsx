import { useTasks } from "@/context/TaskContext";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/StatCard";
import { ProgressRing } from "@/components/ProgressRing";
import { WeeklyChart } from "@/components/WeeklyChart";
import { TaskCard } from "@/components/TaskCard";
import { ListChecks, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { stats, getOverdueTasks, getTodayTasks } = useTasks();
  const { username } = useAuth();
  const overdue = getOverdueTasks();
  const todayTasks = getTodayTasks();

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground capitalize">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {username || "User"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your tasks today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={stats.total} icon={ListChecks} color="primary" delay={0} />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="success" delay={0.1} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="accent" delay={0.2} />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertTriangle} color="destructive" subtitle={stats.overdue > 0 ? "Needs attention" : "All clear!"} delay={0.3} />
      </div>

      {/* Progress + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl bg-card border border-border p-6 shadow-card"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">Productivity</h3>
          <ProgressRing />
        </motion.div>
        <div className="lg:col-span-3">
          <WeeklyChart />
        </div>
      </div>

      {/* Overdue / Today tasks */}
      {overdue.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" /> Overdue Tasks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdue.slice(0, 3).map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        </div>
      )}

      {todayTasks.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">Today's Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayTasks.slice(0, 6).map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
