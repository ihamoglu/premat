"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  userEmail: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function applySession(
      session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]
    ) {
      const nextAuthenticated = Boolean(session);
      const nextEmail = session?.user?.email ?? null;
      let nextIsAdmin = false;

      if (session) {
        try {
          const response = await fetch("/api/admin/session", {
            cache: "no-store",
          });
          const data = (await response.json()) as { isAdmin?: boolean };
          nextIsAdmin = Boolean(response.ok && data.isAdmin);
        } catch {
          nextIsAdmin = false;
        }
      }

      if (!mounted) return;

      setIsAuthenticated(nextAuthenticated);
      setUserEmail(nextEmail);
      setIsAdmin(nextIsAdmin);
      setIsLoading(false);
    }

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await applySession(session);
    }

    loadSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return { ok: true };
  }

  async function logout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserEmail(null);
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      isAdmin,
      isLoading,
      userEmail,
      login,
      logout,
    }),
    [isAuthenticated, isAdmin, isLoading, userEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
