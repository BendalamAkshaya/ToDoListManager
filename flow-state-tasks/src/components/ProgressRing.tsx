import { motion } from "framer-motion";
import { useTasks } from "@/context/TaskContext";

export function ProgressRing() {
  const { stats } = useTasks();
  const pct = stats.productivity;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
          <motion.circle
            cx="64" cy="64" r={radius} fill="none"
            stroke="url(#progressGrad)"
            strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5f2eea" />
              <stop offset="100%" stopColor="#2bb7ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-foreground">{pct}%</span>
          <span className="text-[10px] text-muted-foreground">Done</span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Overall Progress</p>
        <p className="text-xs text-muted-foreground">{stats.completed} of {stats.total} tasks completed</p>
        <div className="flex gap-4 mt-2">
          <div>
            <p className="text-lg font-bold text-foreground">{stats.completedToday}</p>
            <p className="text-[10px] text-muted-foreground">Done Today</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{stats.overdue}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
