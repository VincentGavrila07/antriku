"use client";

import { useLanguage } from "@/app/languange-context";
import { Spin, Form, Input, Button, Select, TimePicker, Switch, notification } from "antd";
import { Moment } from "moment";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Breadcrumbs from "@/app/components/breadcrumbs";
import ServiceService from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { SaveOutlined } from "@ant-design/icons";
import { AddServiceFormValues, Service } from "@/types/Service";
import moment from "moment";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { translations, loading: langLoading } = useLanguage();
  const [form] = Form.useForm();
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load staff/users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await UserService.getAllUsers({});
        setUsers(res.data || []);
      } catch (error) {
        console.error(error);
        notification.error({ title: "Gagal memuat data user" });
      }
    };
    fetchUsers();
  }, []);

  // Load service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await ServiceService.getServiceById(id);
        setService(res.data);
      } catch (error) {
        console.error(error);
        notification.error({ title: "Gagal memuat data service" });
      }
    };
    fetchService();
  }, [id]);

  // Set form values setelah service siap
  useEffect(() => {
    if (!service) return;

    form.setFieldsValue({
      name: service.name,
      code: service.code,
      description: service.description,
      assigned_user_ids: service.assigned_user_ids || [],
      is_active: service.is_active,
      estimated_time: service.estimated_time ? moment(service.estimated_time, "HH:mm:ss") : null,
    });
  }, [service, form]);

  const handleFormSubmit = async (
    values: AddServiceFormValues & { estimated_time?: Moment | null; is_active?: boolean }
  ) => {
    setIsSubmitting(true);
    try {
      const payload: AddServiceFormValues & { is_active: boolean } = {
        ...values,
        assigned_user_ids: values.assigned_user_ids ?? [],
        estimated_time: values.estimated_time ? values.estimated_time.format("HH:mm:ss") : null,
        is_active: values.is_active ?? true,
      };

      await ServiceService.updateService(id, payload);

      notification.success({ title: "Service berhasil diperbarui" });
      router.push("/layanan");
    } catch (error) {
      console.error(error);
      notification.error({ title: "Gagal memperbarui service" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (langLoading || users.length === 0 || !service) {
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
          { label: "Edit Service", href: `/admin/layanan/edit/${id}` },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">Edit Service</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
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
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={users.map((user) => ({ value: user.id, label: user.name }))}
          />
        </Form.Item>

        <Form.Item label="Estimasi Waktu" name="estimated_time">
          <TimePicker format="HH:mm:ss" />
        </Form.Item>

        <Form.Item label="Aktif?" name="is_active" valuePropName="checked">
          <Switch />
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
