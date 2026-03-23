import { useState } from "react";
import { Search, Bell, Moon, Sun, Menu, X, LogOut, CheckSquare, LayoutDashboard, CheckCircle2, FolderOpen, BarChart3, Settings } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTasks } from "@/context/TaskContext";
import { useAuth } from "@/context/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/tasks", label: "My Tasks", icon: CheckSquare },
  { path: "/completed", label: "Completed", icon: CheckCircle2 },
  { path: "/categories", label: "Categories", icon: FolderOpen },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

interface TopNavProps {
  onSearch?: (query: string) => void;
}

export function TopNav({ onSearch }: TopNavProps) {
  const { isDark, toggle } = useTheme();
  const { getOverdueTasks } = useTasks();
  const { username, logout } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const overdueCount = getOverdueTasks().length;

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border bg-card/80 backdrop-blur-lg">
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-xl px-4 py-2 w-80">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
            value={searchValue}
            onChange={(e) => { setSearchValue(e.target.value); onSearch?.(e.target.value); }}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button onClick={toggle} className="p-2.5 rounded-xl hover:bg-muted transition-colors">
            {isDark ? <Sun className="w-[18px] h-[18px] text-muted-foreground" /> : <Moon className="w-[18px] h-[18px] text-muted-foreground" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-muted transition-colors">
            <Bell className="w-[18px] h-[18px] text-muted-foreground" />
            {overdueCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full gradient-bg text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {overdueCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-primary-foreground ml-1 uppercase">
            {username ? username[0] : "U"}
          </div>

          {/* Logout button */}
          <button 
            onClick={logout} 
            className="p-2.5 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors ml-1"
            title="Log out"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border p-4 animate-slide-in" style={{ background: "var(--gradient-sidebar)" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold gradient-text">TaskFlow</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive ? "gradient-bg text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
