import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: "primary" | "accent" | "success" | "warning" | "destructive";
  subtitle?: string;
  delay?: number;
}

const colorMap = {
  primary: "from-[#5f2eea] to-[#8b5cf6]",
  accent: "from-[#2bb7ff] to-[#06b6d4]",
  success: "from-[#10b981] to-[#34d399]",
  warning: "from-[#f59e0b] to-[#fbbf24]",
  destructive: "from-[#ef4444] to-[#f87171]",
};

const iconBgMap = {
  primary: "bg-[#5f2eea]/20",
  accent: "bg-[#2bb7ff]/20",
  success: "bg-[#10b981]/20",
  warning: "bg-[#f59e0b]/20",
  destructive: "bg-[#ef4444]/20",
};

export function StatCard({ title, value, icon: Icon, color, subtitle, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative rounded-2xl bg-card border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Gradient accent line */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", colorMap[color])} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-display font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn("p-3 rounded-xl", iconBgMap[color])}>
          <Icon className="w-5 h-5" style={{ color: color === "primary" ? "#5f2eea" : color === "accent" ? "#2bb7ff" : color === "success" ? "#10b981" : color === "warning" ? "#f59e0b" : "#ef4444" }} />
        </div>
      </div>
    </motion.div>
  );
}
