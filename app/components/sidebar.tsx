"use client";

import React, { useState } from "react";
import { Layout, Button, notification } from "antd";
import {
  LogoutOutlined,
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import UserService from "@/services/UserService";

const { Sider } = Layout;

interface SidebarProps {
  roleId: number;
}

export default function Sidebar({ roleId }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await UserService.logout(token);
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err: unknown) {
      let message = "Terjadi kesalahan saat logout";
      if (err instanceof Error) message = err.message;
      else if (typeof err === "string") message = err;

      notification.error({ title: "Logout Gagal", description: message });
    }
  };

  const menuStyle = "flex items-center gap-3 px-4 py-2 rounded text-white hover:bg-blue-500 transition-colors cursor-pointer";


  return (
    <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        width={250}
        className="h-screen shadow-lg bg-blue-700 flex flex-col justify-between"
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          {!collapsed && <h2 className="text-2xl font-bold mb-6 text-white">AntriKu</h2>}

          {/* Menu */}
          <div className="space-y-2">
            {roleId === 1 && (
              <>
                <a href="/dashboard" className={menuStyle}><DashboardOutlined /> {!collapsed && "Admin Dashboard"}</a>
                <a href="/users" className={menuStyle}><UserOutlined /> {!collapsed && "User Management"}</a>
                <a href="/reports" className={menuStyle}><FileTextOutlined /> {!collapsed && "Reports"}</a>
              </>
            )}

            {roleId === 2 && (
              <>
                <a href="/dashboard" className={menuStyle}><DashboardOutlined /> {!collapsed && "Staff Dashboard"}</a>
                <a href="/orders" className={menuStyle}><ShoppingCartOutlined /> {!collapsed && "Orders"}</a>
              </>
            )}

            {roleId === 3 && (
              <>
                <a href="/dashboard" className={menuStyle}><DashboardOutlined /> {!collapsed && "My Dashboard"}</a>
                <a href="/profile" className={menuStyle}><ProfileOutlined /> {!collapsed && "Profile"}</a>
              </>
            )}
          </div>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          type="primary"
          danger
          className="flex items-center justify-center gap-2 w-full mt-6"
          icon={<LogoutOutlined />}
        >
          {!collapsed && "Logout"}
        </Button>
      </div>
    </Sider>
  );
}
