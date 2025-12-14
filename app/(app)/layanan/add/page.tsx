"use client";

import { useLanguage } from "@/app/languange-context";
import {
  Spin,
  Form,
  Input,
  Button,
  Select,
  TimePicker,
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
  const t = translations?.service;

  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await UserService.getAllUsers({
          page: 1,
          pageSize: 100,
        });

        setUsers(res.data.filter((user: User) => user.roleId === 3));
      } catch {
        notification.error({
          title: "Failed to load staff data",
        });
      }
    };

    fetchUsers();
  }, []);

  const handleFormSubmit = async (
    values: AddServiceFormValues & { estimated_time?: Moment | null }
  ) => {
    setIsSubmitting(true);

    try {
      const payload: AddServiceFormValues = {
        ...values,
        estimated_time: values.estimated_time
          ? values.estimated_time.format("HH:mm:ss")
          : undefined,
        assigned_user_ids: values.assigned_user_ids ?? [],
      };

      await ServiceService.addService(payload);

      notification.success({
        title:"Service added successfully",
      });

      router.push("/layanan");
    } catch {
      notification.error({
        title:  "Failed to add service",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (langLoading || !translations) {
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
          { label: t?.page.ListService ?? "Services", href: "/layanan" },
          { label: t?.page.AddLayanan ?? "Add Service", href: "/layanan/add" },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">
        {t?.page.AddLayanan}
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{ is_active: true }}
        className="space-y-6"
      >
        <Form.Item
          label={t?.AddService.Name}
          name="name"
          rules={[
            {
              required: true,
              message: `${t?.AddService.Name} is required`,
            },
          ]}
        >
          <Input placeholder={t?.AddService.Name} />
        </Form.Item>

        <Form.Item
          label={t?.AddService.ServiceCode}
          name="code"
          rules={[
            {
              required: true,
              message: `${t?.AddService.ServiceCode} is required`,
            },
          ]}
        >
          <Input placeholder={t?.AddService.ServiceCode} />
        </Form.Item>

        <Form.Item
          label={t?.AddService.Description}
          name="description"
        >
          <Input.TextArea placeholder={t?.AddService.Description} />
        </Form.Item>

        <Form.Item
          label={t?.AddService.AssignStaf}
          name="assigned_user_ids"
        >
          <Select
            mode="multiple"
            showSearch
            placeholder={t?.AddService.AssignStaf}
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

        <Form.Item
          label={t?.AddService.EstimatedTime}
          name="estimated_time"
        >
          <TimePicker format="HH:mm:ss" />
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
          >
            {t?.AddService.Save}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
