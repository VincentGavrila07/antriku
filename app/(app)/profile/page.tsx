"use client";

import { useLanguage } from "@/app/languange-context";
import { Spin, Form, Input, Button, notification, Divider } from "antd";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/app/components/breadcrumbs";
import UserService from "@/services/UserService";
import { SaveOutlined } from "@ant-design/icons";
import { User } from "@/types/User";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateUserFormValues } from "@/types/User";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { translations, loading: langLoading } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  const { data: loggedInUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["profile-me"],
    queryFn: () => UserService.getMe(token),
    enabled: !!token,
  });
  
  const t = translations?.profile;

  useEffect(() => {
    if (loggedInUser) {
      form.setFieldsValue({
        name: loggedInUser.name,
        email: loggedInUser.email,
      });
    }
  }, [loggedInUser, form]);


  const handleFormSubmit = async (values: UpdateUserFormValues) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token") || "";

      const payload: {
        name: string;
        newPassword?: string;
        currentPassword?: string;
      } = {
        name: values.name,
      };

      if (values.newPassword) {
        payload.newPassword = values.newPassword;
        payload.currentPassword = values.currentPassword;
      }

      await UserService.updateProfile(payload, token);

      notification.success({
        title: "Profil berhasil diperbarui",
      });

      queryClient.invalidateQueries({ queryKey: ["profile-me"] });

      router.push('/dashboard');

    } catch (error: unknown) {
      notification.error({
        title: "Gagal memperbarui profil",
        description: "Terjadi kesalahan saat memperbarui profil.",
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

      <h2 className="text-3xl font-semibold mb-4 mt-5">{t?.EditProfile}</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="space-y-6"
      >
        <Form.Item
          label={t?.name}
          name="name"
          rules={[{ required: true, message: "Nama user harus diisi" }]}
        >
          <Input placeholder="Masukkan nama user" />
        </Form.Item>


        <Divider plain>Ganti Password (Opsional)</Divider>

        <Form.Item
          label={t?.NewPass}
          name="newPassword"
          rules={[{ min: 6, message: "Minimal 6 karakter" }]}
        >
          <Input.Password placeholder="Kosongkan jika tidak ingin mengganti" />
        </Form.Item>

        <Form.Item
          label={t?.ConfirmPass}
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
            {t?.Save}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
