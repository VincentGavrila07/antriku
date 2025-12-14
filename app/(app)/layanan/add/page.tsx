"use client";

import { useLanguage } from "@/app/languange-context";
import {
  Spin,
  Form,
  Input,
  Button,
  Select,
  TimePicker,
  Switch,
  notification,
} from "antd";
import { Moment } from "moment";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/app/components/breadcrumbs";
import ServiceService from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { SaveOutlined } from "@ant-design/icons";
import { AddServiceFormValues } from "@/types/Service";
import { User } from "@/types/User";

export default function AddServicePage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();

  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= LOAD STAFF (roleId = 3) ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await UserService.getAllUsers({
          page: 1,
          pageSize: 100,
        });

        // ✅ HANYA STAFF
        const staffOnly = res.data.filter(
          (user: User) => user.roleId === 3
        );

        setUsers(staffOnly);
      } catch (error) {
        console.error(error);
        notification.error({
          title: "Gagal memuat data staff",
        });
      }
    };

    fetchUsers();
  }, []);

  /* ================= SUBMIT ================= */
  const handleFormSubmit = async (
    values: AddServiceFormValues & { estimated_time?: Moment | null }
  ) => {
    setIsSubmitting(true);

    try {
      const payload: AddServiceFormValues = {
        ...values,
        estimated_time:
          values.estimated_time && values.estimated_time !== null
            ? values.estimated_time.format("HH:mm:ss")
            : undefined,
        assigned_user_ids: values.assigned_user_ids ?? [],
      };

      await ServiceService.addService(payload as { name: string; description?: string | undefined; assigned_user_ids?: number[] | undefined; is_active?: boolean | undefined; estimated_time?: string | undefined });

      notification.success({
        title: "Service berhasil ditambahkan",
      });

      router.push("/admin/layanan");
    } catch (error) {
      console.error(error);
      notification.error({
        title: "Gagal menambahkan service",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (langLoading || users.length === 0) {
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
          { label: "Services", href: "/admin/layanan" },
          { label: "Tambah Service", href: "/admin/layanan/add" },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">
        Tambah Service
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{ is_active: true }}
        className="space-y-6"
      >
        <Form.Item
          label="Nama Service"
          name="name"
          rules={[{ required: true, message: "Nama service harus diisi" }]}
        >
          <Input placeholder="Masukkan nama service" />
        </Form.Item>

        <Form.Item
          label="Kode Service"
          name="code"
          rules={[{ required: true, message: "Kode Service harus diisi" }]}
        >
          <Input placeholder="Masukkan kode service" />
        </Form.Item>

        <Form.Item label="Deskripsi" name="description">
          <Input.TextArea placeholder="Deskripsi service" />
        </Form.Item>

        <Form.Item label="Assign Staff" name="assigned_user_ids">
          <Select
            mode="multiple"
            showSearch
            placeholder="Pilih staff"
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
          />
        </Form.Item>

        <Form.Item label="Estimasi Waktu" name="estimated_time">
          <TimePicker format="HH:mm:ss" />
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
