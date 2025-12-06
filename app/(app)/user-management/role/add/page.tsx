"use client";

import { useLanguage } from "@/app/languange-context";
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
  const { permissions, loading: permissionLoading } = usePermission();

  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-user-management")) {
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);




  const handleFormSubmit = async (values: AddRoleFormValues) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token") || ""; 
      await RoleService.createRole(values, token); 
      notification.success({
        title: "Role berhasil ditambahkan",
      });
      router.push("/user-management/role"); 
    } catch (error) {
      notification.error({
        title: "Gagal menambahkan role",
        description: "Terjadi kesalahan saat menambahkan role.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  if (langLoading || permissionLoading || !translations) {
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
            { label: "Role", href: "/user-management/role" },
            { label: "Tambah Role", href: "/admin/user-management/role/add" },
          ]}
        />


      <h2 className="text-3xl font-semibold mb-4 mt-5">Tambah Role</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="space-y-6"
      >
        <Form.Item
          label="Nama"
          name="name"
          rules={[{ required: true, message: "Nama role harus diisi" }]}
        >
          <Input placeholder="Masukkan nama role" />
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
