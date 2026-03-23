import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("taskflow-auth-token"));
  const [username, setUsername] = useState<string | null>(localStorage.getItem("taskflow-username"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // The frontend doesn't actually know the username since SimpleJWT only encodes user_id by default.
        // For simplicity we will fetch it from a custom endpoint, or we can just fetch the username directly during login.
        // Let's decode the token, see if username is there, or just use "User".
      } catch (e) {
        console.error("Invalid token");
      }
    } else {
      setUsername(null);
    }
  }, [token]);

  const login = useCallback((newToken: string, user: string) => {
    localStorage.setItem("taskflow-auth-token", newToken);
    localStorage.setItem("taskflow-username", user);
    setToken(newToken);
    setUsername(user);
    navigate("/");
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem("taskflow-auth-token");
    localStorage.removeItem("taskflow-username");
    setToken(null);
    setUsername(null);
    navigate("/login");
  }, [navigate]);


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
