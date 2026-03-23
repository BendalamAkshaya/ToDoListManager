import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  CheckCircle2,
  FolderOpen,
  BarChart3,
  Settings,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/tasks", label: "My Tasks", icon: CheckSquare },
  { path: "/completed", label: "Completed", icon: CheckCircle2 },
  { path: "/categories", label: "Categories", icon: FolderOpen },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { username, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen border-r border-border bg-card" style={{ background: "var(--gradient-sidebar)" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
          <CheckSquare className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-display text-xl font-bold gradient-text">TaskFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "gradient-bg text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </RouterNavLink>
          );
        })}
      </nav>

      {/* Pro Tip card */}
      <div className="p-4 space-y-4">
        <div className="rounded-xl p-4 border border-border bg-muted/50">
          <p className="text-xs font-medium text-muted-foreground mb-1">Pro Tip</p>
          <p className="text-xs text-muted-foreground/80">Press <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">⌘K</kbd> to quickly add tasks</p>
        </div>

        {/* User & Logout */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-[10px] font-bold text-primary-foreground uppercase">
              {username ? username[0] : "U"}
            </div>
            <span className="text-sm font-medium text-foreground truncate max-w-[100px]">{username || "User"}</span>
          </div>
          <button 
            onClick={logout}
            className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
