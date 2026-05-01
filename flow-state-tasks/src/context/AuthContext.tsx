import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token || null);
      setUsername(session?.user?.user_metadata?.username || session?.user?.email || null);
      setIsLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token || null);
      setUsername(session?.user?.user_metadata?.username || session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback((newToken: string, user: string) => {
    // We keep this to be backward-compatible with any components strictly expecting this signature,
    // though Supabase handles token persistence internally.
    setToken(newToken);
    setUsername(user);
    navigate("/");
  }, [navigate]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setToken(null);
    setUsername(null);
    navigate("/login");
  }, [navigate]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
