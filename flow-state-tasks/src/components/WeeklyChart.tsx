import { useTasks } from "@/context/TaskContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export function WeeklyChart() {
  const { tasks } = useTasks();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const data = days.map((d) => {
    const dateStr = d.toISOString().split("T")[0];
    const completed = tasks.filter(
      (t) => t.status === "completed" && t.completedAt?.startsWith(dateStr)
    ).length;
    const created = tasks.filter((t) => t.createdAt.startsWith(dateStr)).length;
    return {
      day: d.toLocaleDateString("en", { weekday: "short" }),
      completed,
      created,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-card border border-border p-6 shadow-card"
    >
      <h3 className="font-display font-semibold text-foreground mb-4">Weekly Activity</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: 12,
              }}
            />
            <Bar dataKey="completed" fill="#5f2eea" radius={[6, 6, 0, 0]} name="Completed" />
            <Bar dataKey="created" fill="#2bb7ff" radius={[6, 6, 0, 0]} name="Created" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
