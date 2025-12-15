"use client";

import { useLanguage } from "@/app/languange-context";
import type { Translations } from "@/app/languange-context";
import { Spin, Form, Input, Button } from "antd";
import {  useEffect } from "react";
import { useQuery } from "@tanstack/react-query"; 
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import UserService from "@/services/UserService";
import { User } from "@/types/User";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { usePermission } from "@/app/context/permission-context";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["userManagement"] | undefined =
    translations?.userManagement;
  const { permissions, loading: permissionLoading } = usePermission();

  const id = params?.id as string;

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () =>
      UserService.getUserById(
        id as string,
        localStorage.getItem("token") || ""
      ),
    enabled: !!id && permissions.includes("view-user-management"),
  });

  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-user-management")) {
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);

  if (langLoading || permissionLoading || !t) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  if (isLoading || !userData) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumbs
          items={[{ label: t.ListUser, href: "/user-management/user" }]}
        />
        <h1>{t.ErrorLoadUser}</h1>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Breadcrumbs
        items={[{ label: t.ListUser, href: "/user-management/user" }]}
      />

      <h2 className="text-2xl font-semibold mb-4">{t.UserDetail}</h2>

      <Form layout="vertical" initialValues={userData} className="space-y-4">
        <Form.Item label={t.UserId} name="id">
          <Input readOnly />
        </Form.Item>
        <Form.Item label={t.UserName} name="name">
          <Input readOnly />
        </Form.Item>
        <Form.Item label={t.UserEmail} name="email">
          <Input readOnly />
        </Form.Item>
        <Form.Item label={t.UserRole} name="roleName">
          <Input readOnly />
        </Form.Item>
      </Form>
    </div>
  );
}
