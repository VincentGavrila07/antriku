"use client";

import { useLanguage } from "@/app/languange-context";
import type { Translations } from "@/app/languange-context";
import { Spin, Form, Input, Button, notification } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "@/app/context/permission-context";
import Breadcrumbs from "@/app/components/breadcrumbs";
import RoleService from "@/services/RoleService";
import { SaveOutlined } from "@ant-design/icons";
import { AddRoleFormValues } from "@/types/Role";

export default function AddRolePage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["userManagement"] | undefined = translations?.userManagement;
  const { permissions, loading: permissionLoading } = usePermission();

  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-role-management")) {
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);

  if (langLoading || permissionLoading || !t) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }

  const handleFormSubmit = async (values: AddRoleFormValues) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || "";
      await RoleService.createRole(values, token);
      notification.success({
        title: t.SuccessAddRole,
      });
      router.push("/user-management/role");
    } catch (error) {
      notification.error({
        title: t.ErrorAddRole,
        description: t.ErrorAddRoleDesc,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (langLoading || permissionLoading || !t) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t.RoleName, href: "/user-management/role" },
          { label: t.AddRole, href: "/user-management/role/add" },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">{t.AddRole}</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="space-y-6"
      >
        <Form.Item
          label={t.RoleName}
          name="name"
          rules={[{ required: true, message: t.RoleNameRequired }]}
        >
          <Input placeholder={t.RoleNamePlaceholder} />
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
          >
            {t.Save}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
