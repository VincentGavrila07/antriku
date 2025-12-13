"use client";

import React, { useState } from "react";
import { Layout, Button, notification, Spin, Menu, MenuProps } from "antd";
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
import Link from "next/link";

const { Sider } = Layout;

interface SidebarProps {
    roleId: number;
}

export default function Sidebar({ roleId }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { translations, loading } = useLanguage();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  if (loading || !translations) {
    return (
      <Sider
        width={250}
        className="h-screen shadow-lg bg-blue-700 flex items-center justify-center"
      >
        <Spin />
      </Sider>
    );
  }

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

  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: (
        <Link href="/dashboard">
          {roleId === 1
            ? t.adminDashboard
            : roleId === 3
            ? t.staffDashboard
            : t.myDashboard}
        </Link>
      ),
    },

    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: <Link href={'/profile'}>Profile</Link>,
    },

    roleId === 1 && {
      key: "userManagement",
      icon: <UserOutlined />,
      label: t.userManagement,
      children: [
        {
          key: "user",
          label: <Link href="/user-management/user">{t.user}</Link>,
        },
        {
          key: "role",
          label: <Link href="/user-management/role">{t.role}</Link>,
        },
        {
          key: "permission",
          label: <Link href="/user-management/permission">{t.permission}</Link>,
        },
      ],
    },
    roleId === 1 && {
      key: "service",
      icon: <FileTextOutlined />,
      label: <Link href="/layanan">{t.service}</Link>,
    },
    roleId === 1 && {
      key: "reports",
      icon: <FileTextOutlined />,
      label: <Link href="/reports">{t.reports}</Link>,
    },
    roleId === 2 && {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: <Link href="/order">Order</Link>,
    },
  ].filter(Boolean) as MenuProps["items"];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      width={250}
      className="h-screen shadow-lg bg-blue-700 flex flex-col justify-between overflow-y-auto fixed scrollbar-hide"
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {!collapsed && (
            <h2 className="text-2xl font-bold mb-6 text-white">{t.appName}</h2>
          )}

          <Menu
            theme="dark"
            mode="inline"
            inlineCollapsed={collapsed}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            items={menuItems}
            className="bg-blue-700"
          />
        </div>

        <Button
          onClick={handleLogout}
          type="primary"
          danger
          className="flex items-center justify-center gap-2 w-full mt-6 shrink-0"
          icon={<LogoutOutlined />}
        >
          {!collapsed && t.logout}
        </Button>
      </div>
    </Sider>
  );
}