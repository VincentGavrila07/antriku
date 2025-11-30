"use client";

import { useLanguage } from "@/app/languange-context";
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
          title: "Gagal memuat roles",
          description: "Terjadi kesalahan saat memuat data roles.",
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
        title: "User berhasil ditambahkan",
      });
      router.push("/user-management/user"); 
    } catch (error) {
      notification.error({
        title: "Gagal menambahkan user",
        description: "Terjadi kesalahan saat menambahkan user.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  if (langLoading || permissionLoading || !translations || roles.length === 0) {
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
            { label: "User", href: "/admin/user-management/user" },
            { label: "Tambah User", href: "/admin/user-management/user/add" },
          ]}
        />


      <h2 className="text-3xl font-semibold mb-4 mt-5">Tambah User</h2>

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
          label="Nama"
          name="name"
          rules={[{ required: true, message: "Nama user harus diisi" }]}
        >
          <Input placeholder="Masukkan nama user" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email user harus diisi" },
            { type: "email", message: "Format email tidak valid" },
          ]}
        >
          <Input placeholder="Masukkan email user" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="roleId"
          rules={[{ required: true, message: "Pilih role user" }]}
        >
          <Select
            placeholder="Pilih role user"
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
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
