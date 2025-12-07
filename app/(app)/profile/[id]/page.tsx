"use client";

import { useLanguage } from "@/app/languange-context";
import { Spin, Form, Input, Button, notification, Divider } from "antd";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/app/components/breadcrumbs";
import UserService from "@/services/UserService";
import { SaveOutlined } from "@ant-design/icons";
import { User } from "@/types/User";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UpdateUserPayload {
  name: string;
  email: string;
  password?: string;
  currentPassword?: string;
}

export default function EditProfilePage() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { translations, loading: langLoading } = useLanguage();

  const queryClient = useQueryClient();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  const { data: loggedInUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["profile-me"],
    queryFn: () => UserService.getMe(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (loggedInUser) {
      form.setFieldsValue({
        name: loggedInUser.name,
        email: loggedInUser.email,
      });
    }
  }, [loggedInUser, form]);

  const handleFormSubmit = async (values: {
    name: string;
    email: string;
    newPassword?: string;
    currentPassword?: string;
  }) => {
    if (!loggedInUser?.id) return;

    setIsSubmitting(true);
    try {
      const payload: UpdateUserPayload = {
        name: values.name,
        email: values.email,
      };

      if (values.newPassword) payload.password = values.newPassword;
      if (values.currentPassword)
        payload.currentPassword = values.currentPassword;

      const response = await UserService.updateProfile(payload, token);

      notification.success({
        title: "Profile berhasil diperbarui",
      });

      await queryClient.invalidateQueries({ queryKey: ["profile-me"] });

      if (response?.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      form.setFieldValue("currentPassword", "");
      form.setFieldValue("newPassword", "");
    } catch (error: any) {
      notification.error({
        title: "Gagal memperbarui profile",
        description: error?.response?.data?.message || "Terjadi kesalahan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (langLoading || userLoading || !translations || !loggedInUser) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "My Profile", href: `/profile/${loggedInUser.id}` }]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">Edit Profile</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
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
            { required: true, message: "Email harus diisi" },
            { type: "email", message: "Format email tidak valid" },
          ]}
        >
          <Input placeholder="nama@email.com" />
        </Form.Item>

        <Divider plain>Ganti Password (Opsional)</Divider>

        <Form.Item
          label="Password Baru"
          name="newPassword"
          rules={[{ min: 6, message: "Minimal 6 karakter" }]}
        >
          <Input.Password placeholder="Kosongkan jika tidak ingin mengganti" />
        </Form.Item>

        <Form.Item
          label="Konfirmasi Password Saat Ini"
          name="currentPassword"
          dependencies={["newPassword"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value && getFieldValue("newPassword")) {
                  return Promise.reject(
                    new Error("Masukkan password lama untuk konfirmasi!")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password placeholder="Masukkan password lama Anda" />
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
