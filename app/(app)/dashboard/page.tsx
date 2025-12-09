"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/User";
import UserService from "@/services/UserService";
import AdminDashboard from "./admin/admindashboard";
import StaffDashboard from "./staff/staffdashboard";
import CustomerDashboard from "./customer/customerdashboard";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      UserService.getMe(token).then((res) => {
        setUser(res);
      });
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  // Render dashboard sesuai role
  if (user.roleId === 1) return <AdminDashboard user={user} />;
  if (user.roleId === 3) return <StaffDashboard user={user} />;
  if(user.roleId === 2) return <CustomerDashboard user={user} />;
  
}
