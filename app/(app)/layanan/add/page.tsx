"use client";

import { Translations, useLanguage } from "@/app/languange-context";
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
  const t: Translations["service"] | undefined = translations?.service;

  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await UserService.getAllUsers({});
        setUsers(res.data || []);
      } catch (error) {
        console.error(error);
        notification.error({ title: t?.ErrorLoadUser });
      }
    };

    fetchUsers();
  }, []);

  // Form submit handler
  const handleFormSubmit = async (
    values: AddServiceFormValues & { estimated_time?: Moment | null }
  ) => {
    setIsSubmitting(true);

    try {
      const payload: AddServiceFormValues = {
        ...values,
        code: values.code,
        estimated_time: values.estimated_time
          ? values.estimated_time.format("HH:mm:ss")
          : undefined,
        assigned_user_ids: values.assigned_user_ids ?? [],
      };

      await ServiceService.addService(payload);

      notification.success({ title: t?.SuccessAddService });
      router.push("/layanan");
    } catch (error) {
      console.error(error);
      notification.error({ title: t?.ErrorAddService });
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
          { label: t?.Services ?? "", href: "/admin/layanan" },
          { label: t?.AddService ?? "", href: "/admin/layanan/add" },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">{t?.AddService}</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{ is_active: true }}
        className="space-y-6"
      >
        <Form.Item
          label={t?.ServiceName}
          name="name"
          rules={[{ required: true, message: t?.ServiceNameRequired }]}
        >
          <Input placeholder={t?.ServiceNamePlaceholder} />
        </Form.Item>

        <Form.Item
          label={t?.ServiceCode}
          name="code"
          rules={[{ required: true, message: t?.ServiceCodeRequired }]}
        >
          <Input placeholder={t?.ServiceNamePlaceholder} />
        </Form.Item>

        <Form.Item label={t?.Description} name="description">
          <Input.TextArea placeholder={t?.DescriptionPlaceholder} />
        </Form.Item>

        <Form.Item label={t?.AssignStaff} name="assigned_user_ids">
          <Select
            mode="multiple"
            showSearch
            placeholder={t?.AssignStaffPlaceholder}
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

        <Form.Item label={t?.EstimatedTime} name="estimated_time">
          <TimePicker format="HH:mm:ss" />
        </Form.Item>

        <Form.Item label={t?.IsActive} name="is_active" valuePropName="checked">
          <Switch />
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
