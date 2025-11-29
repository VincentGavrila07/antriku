"use client";

import React, { useState } from "react";
import { Layout, Button, notification, Spin } from "antd";
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
import { useLanguage } from "@/app/languange-context";

const { Sider } = Layout;

interface SidebarProps {
  roleId: number;
}

export default function Sidebar({ roleId }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { translations, loading } = useLanguage();

  if (loading || !translations) {
    return (
      <Sider
        width={250}
        className="h-screen shadow-lg bg-blue-700 flex items-center justify-center"
      >
        <Spin tip="Loading..." />
      </Sider>
    );
  }


  // Now safe to access!
  const t = translations.Sidebar;

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await UserService.logout(token);
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err: unknown) {
      let message = "Logout failed";
      if (err instanceof Error) message = err.message;
      else if (typeof err === "string") message = err;

      notification.error({ title: "Logout Error", description: message });
    }
  };

  const menuStyle =
    "flex items-center gap-3 px-4 py-2 rounded text-white hover:bg-blue-500 transition-colors cursor-pointer";

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
          {!collapsed && (
            <h2 className="text-2xl font-bold mb-6 text-white">{t.appName}</h2>
          )}

          <div className="space-y-2">
            {roleId === 1 && (
              <>
                <a href="/dashboard" className={menuStyle}>
                  <DashboardOutlined /> {!collapsed && t.adminDashboard}
                </a>
                <a href="/users" className={menuStyle}>
                  <UserOutlined /> {!collapsed && t.userManagement}
                </a>
                <a href="/reports" className={menuStyle}>
                  <FileTextOutlined /> {!collapsed && t.reports}
                </a>
              </>
            )}

            {roleId === 2 && (
              <>
                <a href="/dashboard" className={menuStyle}>
                  <DashboardOutlined /> {!collapsed && t.staffDashboard}
                </a>
                <a href="/orders" className={menuStyle}>
                  <ShoppingCartOutlined /> {!collapsed && t.orders}
                </a>
              </>
            )}

            {roleId === 3 && (
              <>
                <a href="/dashboard" className={menuStyle}>
                  <DashboardOutlined /> {!collapsed && t.myDashboard}
                </a>
                <a href="/profile" className={menuStyle}>
                  <ProfileOutlined /> {!collapsed && t.profile}
                </a>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={handleLogout}
          type="primary"
          danger
          className="flex items-center justify-center gap-2 w-full mt-6"
          icon={<LogoutOutlined />}
        >
          {!collapsed && t.logout}
        </Button>
      </div>
    </Sider>
  );
}
