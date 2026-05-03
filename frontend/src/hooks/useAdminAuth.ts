"use client";

import { useState, useEffect, useCallback } from "react";
import type { AdminUser } from "@/types/admin";

interface UseAdminAuthReturn {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("admin_token");
      const storedAdmin = localStorage.getItem("admin_user");
      if (storedToken && storedAdmin) {
        try {
          setToken(storedToken);
          setAdmin(JSON.parse(storedAdmin));
        } catch {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
        }
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken: string, newAdmin: AdminUser) => {
    localStorage.setItem("admin_token", newToken);
    localStorage.setItem("admin_user", JSON.stringify(newAdmin));
    setToken(newToken);
    setAdmin(newAdmin);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setAdmin(null);
  }, []);

  return {
    admin,
    token,
    isAuthenticated: !!token && !!admin,
    loading,
    login,
    logout,
  };
}
