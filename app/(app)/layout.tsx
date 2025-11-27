"use client";

import Sidebar from "../components/sidebar";
import UserService from "@/services/UserService";
import { User } from "@/types/User";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    UserService.getMe(token)
      .then((res) => setUser(res))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  console.log("USER DARI API:", user);
  console.log("ROLEID YANG DIKIRIM:", user?.roleId);

  return (
    <div className="flex min-h-screen">
      <Sidebar roleId={user?.roleId ?? 0} />
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
