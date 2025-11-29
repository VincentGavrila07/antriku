"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import PermissionService from "@/services/PermissionService";

interface PermissionContextProps {
  permissions: string[];
  loading: boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextProps>({
  permissions: [],
  loading: true,
  refreshPermissions: async () => {},
});

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPermissions = async () => {
    if (typeof window === "undefined") return; // pastikan client
    const token = localStorage.getItem("token") || "";
    if (!token) return setLoading(false);

    setLoading(true);
    try {
      const data = await PermissionService.getPermissions(token);
      setPermissions(data.permissions || []);
    } catch (err) {
      console.error("Failed to load permissions", err);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PermissionContext.Provider
      value={{ permissions, loading, refreshPermissions: loadPermissions }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hook untuk konsumsi context
export const usePermission = () => {
  return useContext(PermissionContext);
};
