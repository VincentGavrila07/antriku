"use client";

import { useLanguage } from "@/app/languange-context";
import type { Translations } from "@/app/languange-context";
import { Spin, Form, Input, Button, Select, notification } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "@/app/context/permission-context";
import Breadcrumbs from "@/app/components/breadcrumbs";
import UserService from "@/services/UserService";
import RoleService from "@/services/RoleService";
import { SaveOutlined } from "@ant-design/icons";
import { AddUserFormValues } from "@/types/User";
import { Role } from "@/types/Role";

export default function AddUserPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["userManagement"] | undefined = translations?.userManagement;
  const { permissions, loading: permissionLoading } = usePermission();

  const [form] = Form.useForm();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-user-management")) {
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RoleService.getAllRole();
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          throw new Error("Invalid response format, roles should be an array.");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        notification.error({
          title: t?.ErrorLoadRole,
          description: t?.ErrorLoadRoleDesc,
        });
      }
    };
    fetchRoles();
  }, []); 

  const handleFormSubmit = async (values: AddUserFormValues) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || "";
      await UserService.createUser(values, token);
      notification.success({
        title: t?.SuccessAddUser,
      });
      router.push("/user-management/user");
    } catch (error) {
      notification.error({
        title: t?.ErrorAddUser,
        description: t?.ErrorAddUserDesc,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  if (langLoading || permissionLoading || !t || roles.length === 0) {
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
          { label: t.ListUser, href: "/user-management/user" },
          { label: t.AddUser, href: "/admin/user-management/user/add" },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">{t.AddUser}</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          roleId: roles[0]?.id, 
        }}
        className="space-y-6"
      >
        <Form.Item
          label={t.UserName}
          name="name"
          rules={[{ required: true, message: t.UserName + " " + t.UserPasswordRequired }]}
        >
          <Input placeholder={t.UserName} />
        </Form.Item>

        <Form.Item
          label={t.UserEmail}
          name="email"
          rules={[
            { required: true, message: t.UserEmail + " " + t.UserPasswordRequired },
            { type: "email", message: t.ErrorAddUserDesc },
          ]}
        >
          <Input placeholder={t.UserEmail} />
        </Form.Item>

        <Form.Item
          label={t.UserRole}
          name="roleId"
          rules={[{ required: true, message: t.UserRole + " " + t.UserPasswordRequired }]}
        >
          <Select
            placeholder={t.UserRole}
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
          />
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
