"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "SUPER_ADMIN" | "SUPERVISOR" | "ADMIN" | "DELIVERY_PARTNER" | "INVENTORY_MANAGER" | "ORDER_MANAGER" | "DELIVERY_MANAGER" | "CONTENT_MANAGER";
  avatar?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        try {
          localStorage.setItem("townkart_user_session", JSON.stringify(data));
        } catch {}
      } else {
        setUser(null);
        try {
          localStorage.removeItem("townkart_user_session");
        } catch {}
      }
    } catch {
      // keep current state if offline/network error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hydrate from localStorage once mounted in browser, then verify with server
  useEffect(() => {
    try {
      const cached = localStorage.getItem("townkart_user_session");
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch {}
    refreshSession();
  }, [refreshSession]);

  // Listen for auth changes triggered after login (dispatched from login page)
  useEffect(() => {
    const handler = () => refreshSession();
    window.addEventListener("townkart_auth_changed", handler);
    return () => window.removeEventListener("townkart_auth_changed", handler);
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error };
    setUser(data);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem("townkart_user_session");
    } catch {}
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
