"use client";

import { useLanguage } from "@/app/languange-context";
import type { Translations } from "@/app/languange-context";
import { Spin, Form, Input, Button, Select, notification } from "antd";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePermission } from "@/app/context/permission-context";
import Breadcrumbs from "@/app/components/breadcrumbs";
import UserService from "@/services/UserService";
import RoleService from "@/services/RoleService";
import { SaveOutlined } from "@ant-design/icons";
import { AddUserFormValues, User } from "@/types/User";
import { Role } from "@/types/Role";
import { useQuery } from "@tanstack/react-query";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

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

  const {
    data: userData,
    isLoading: userLoading,
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () =>
      UserService.getUserById(
        id,
        localStorage.getItem("token") || ""
      ),
    enabled: !!id && permissions.includes("view-user-management"),
  });

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RoleService.getAllRole();
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          throw new Error("Invalid roles response");
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

  useEffect(() => {
    if (userData && roles.length > 0) {
      form.setFieldsValue({
        name: userData.name,
        roleId: userData.roleId,
      });
    }
  }, [userData, roles, form]);

  const handleFormSubmit = async (values: AddUserFormValues) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token") || "";

      await UserService.updateUser(id as string, values, token);

      notification.success({
        title: t?.SuccessEditUser,
      });

      router.push("/user-management/user");
    } catch (error) {
      notification.error({
        title: t?.ErrorEditUser,
        description: t?.ErrorEditUserDesc,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    langLoading ||
    permissionLoading ||
    userLoading ||
    !t
  ) {
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
          { label: t.EditUser, href: `/user-management/user/edit/${id}` },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">{t.EditUser}</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
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
          label={t.UserRole}
          name="roleId"
          rules={[{ required: true, message: t.UserRole + " " + t.UserPasswordRequired }]}
        >
          <Select
            placeholder={t.UserRole}
            disabled={roles.length === 0}
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
