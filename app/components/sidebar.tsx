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
import {
  GlobalOutlined,
} from "@ant-design/icons";

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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { lang, changeLanguage } = useLanguage();

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
      label: <Link href={"/profile"}>{t.profile}</Link>,
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
      label: <Link href="/order">{t.orders}</Link>,
    },
    roleId === 2 && {
      key: "history",
      icon: <ShoppingCartOutlined />,
      label: <Link href="/riwayat">{t.history}</Link>,
    },
    roleId === 1 && {
      key: "history",
      icon: <ShoppingCartOutlined />,
      label: <Link href="/riwayat">{t.history}</Link>,
    },
    roleId === 1 && {
      key: "display",
      icon: <ShoppingCartOutlined />,
      label: <Link href="/DisplayService">{t.display}</Link>,
    },
    roleId === 1 && {
      key: "berita",
      icon: <ShoppingCartOutlined />,
      label: <Link href="/berita">Berita</Link>,
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

        {/* --- FOOTER AREA (Language & Logout) --- */}
        <div className="pt-4 mt-auto border-t border-blue-500/30">
          
          {/* 1. LANGUAGE CONTROL PANEL */}
          <div className={`
            bg-blue-900/30 rounded-xl p-3 mb-4 backdrop-blur-sm transition-all duration-300
            ${collapsed ? "flex flex-col items-center justify-center gap-2" : "block"}
          `}>
            
            {/* Label 'Language' (Hanya muncul saat tidak collapsed) */}
            {!collapsed && (
              <div className="flex items-center gap-2 mb-3 text-blue-200 px-1">
                <GlobalOutlined className="text-sm" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  Language
                </span>
              </div>
            )}

            {/* Ikon Globe (Muncul saat Collapsed sebagai pengganti label) */}
            {collapsed && <GlobalOutlined className="text-blue-200 text-lg mb-1" />}

            {/* Tombol Switcher (Grid Layout biar lega) */}
            <div className={`
               w-full transition-all duration-300
               ${collapsed ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"}
            `}>
              {/* Tombol EN */}
              <button
                onClick={() => changeLanguage("en")}
                className={`
                  relative flex items-center justify-center font-bold transition-all duration-300 rounded-lg
                  ${collapsed ? "w-8 h-8 text-[10px] p-0" : "py-2 text-xs"}
                  ${lang === "en"
                    ? "bg-white text-blue-700 shadow-md scale-[1.02]" // Aktif: Putih
                    : "bg-blue-800/50 text-blue-200 hover:bg-blue-700 hover:text-white" // Tidak Aktif: Transparan
                  }
                `}
              >
                EN
              </button>

              {/* Tombol ID */}
              <button
                onClick={() => changeLanguage("id")}
                className={`
                  relative flex items-center justify-center font-bold transition-all duration-300 rounded-lg
                  ${collapsed ? "w-8 h-8 text-[10px] p-0" : "py-2 text-xs"}
                  ${lang === "id"
                    ? "bg-white text-blue-700 shadow-md scale-[1.02]" // Aktif: Putih
                    : "bg-blue-800/50 text-blue-200 hover:bg-blue-700 hover:text-white" // Tidak Aktif: Transparan
                  }
                `}
              >
                ID
              </button>
            </div>
          </div>

          {/* 2. LOGOUT BUTTON */}
          <Button
            onClick={handleLogout}
            type="primary"
            danger
            block={!collapsed}
            shape={collapsed ? "circle" : "default"}
            className={`
              flex items-center justify-center shadow-lg border-none transition-all duration-300
              ${collapsed ? "w-10 h-10 mx-auto" : "h-11 font-semibold tracking-wide bg-red-500 hover:bg-red-600"}
            `}
            icon={<LogoutOutlined />}
          >
            {!collapsed && t.logout}
          </Button>
        </div>
        </div>
    </Sider>
  );
}