"use client";

import { useLanguage } from "@/app/languange-context";
import type { Translations } from "@/app/languange-context";
import { Spin, Form, Input, Button, notification } from "antd";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePermission } from "@/app/context/permission-context";
import Breadcrumbs from "@/app/components/breadcrumbs";
import RoleService from "@/services/RoleService";
import { SaveOutlined } from "@ant-design/icons";
import { AddRoleFormValues, Role } from "@/types/Role";
import { useQuery } from "@tanstack/react-query";

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["userManagement"] | undefined = translations?.userManagement;
  const { permissions, loading: permissionLoading } = usePermission();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-user-management")) {
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);

  const { data: roleData, isLoading: roleLoading } = useQuery<Role>({
    queryKey: ["role", id],
    queryFn: () =>
      RoleService.getRoleById(id, localStorage.getItem("token") || ""),
    enabled: !!id && permissions.includes("view-user-management"),
  });

  useEffect(() => {
    if (roleData) {
      form.setFieldsValue({
        name: roleData.name,
      });
    }
  }, [roleData, form]);

  const handleFormSubmit = async (values: AddRoleFormValues) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || "";
      await RoleService.updateRole(id as string, values, token);
      notification.success({
        title: t?.SuccessEditRole,
      });
      router.push("/user-management/role");
    } catch (error) {
      notification.error({
        title: t?.ErrorEditRole,
        description: t?.ErrorEditRoleDesc,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (langLoading || permissionLoading || roleLoading || !t) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t.RoleName, href: "/user-management/role" },
          { label: t.EditRole, href: `/user-management/role/edit/${id}` },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">{t.EditRole}</h2>

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
