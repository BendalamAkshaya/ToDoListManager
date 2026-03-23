import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();
  const { username } = useAuth();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your TaskFlow experience</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-6 shadow-card space-y-6">
        {/* Theme */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground text-sm">Appearance</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle dark or light mode</p>
          </div>
          <button onClick={toggle} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-accent/10 transition-colors text-sm font-medium text-foreground">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <hr className="border-border" />

        {/* Profile */}
        <div>
          <h3 className="font-medium text-foreground text-sm mb-3">Profile</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-xl font-bold text-primary-foreground uppercase">
              {username ? username[0] : "U"}
            </div>
            <div>
              <p className="font-medium text-foreground capitalize">{username || "User"}</p>
              <p className="text-xs text-muted-foreground">{username ? `${username.toLowerCase()}@taskflow.com` : "user@example.com"}</p>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        <div>
          <h3 className="font-medium text-foreground text-sm mb-2">About</h3>
          <p className="text-xs text-muted-foreground">TaskFlow v1.0 — Smart To-Do Manager</p>
          <p className="text-xs text-muted-foreground mt-1">Built with React, TypeScript & Tailwind CSS</p>
        </div>
      </motion.div>
    </div>
  );
}
