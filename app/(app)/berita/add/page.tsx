"use client";

import { useLanguage } from "@/app/languange-context";
import type { Translations } from "@/app/languange-context";
import {
  Spin,
  Form,
  Input,
  notification,
  DatePicker,
  Upload,
  Button,
} from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "@/app/context/permission-context";
import Breadcrumbs from "@/app/components/breadcrumbs";
import BeritaService from "@/services/BeritaService";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { UploadFile } from "antd/es/upload/interface";

interface AddBeritaFormValues {
  judul: string;
  deskripsi: string;
  foto: UploadFile[];
  published_at?: dayjs.Dayjs;
}

export default function AddBeritaPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["berita"] | undefined = translations?.berita;
  const { permissions, loading: permissionLoading } = usePermission();

  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-berita-management")) {
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);

  if (langLoading || permissionLoading || !t) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const handleFormSubmit = async (values: AddBeritaFormValues) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token") || "";

      const fileList = values.foto;
      if (!fileList || fileList.length === 0) {
        notification.error({ title: "Foto wajib diisi" });
        return;
      }

      const fotoFile = fileList[0].originFileObj as File;

      await BeritaService.createBerita(
        {
          judul: values.judul,
          deskripsi: values.deskripsi,
          foto: fotoFile, // FILE ASLI
          published_at: values.published_at
            ? values.published_at.format("YYYY-MM-DD HH:mm:ss")
            : null,
        },
        token
      );

      notification.success({ title: t.SuccessAddBerita });
      router.push("/berita");
    } catch (error) {
      notification.error({ title: t.ErrorAddBerita });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t.BeritaName, href: "/berita" },
          { label: t.AddBerita, href: "/berita/add" },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">
        {t.AddBerita}
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        {/* Judul */}
        <Form.Item
          label={t.Title}
          name="judul"
          rules={[{ required: true, message: t.TitleRequired }]}
        >
          <Input />
        </Form.Item>

        {/* Deskripsi */}
        <Form.Item
          label={t.Description}
          name="deskripsi"
          rules={[{ required: true, message: t.DescriptionRequired }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>

        {/* FOTO — FINAL FIX */}
        <Form.Item
          label={t.Image}
          name="foto"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={[{ required: true, message: t.ImageRequired}]}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>
              {t.ImagePlaceholder}
            </Button>
          </Upload>
        </Form.Item>

        {/* Published At */}
        <Form.Item label={t.PublishedAt} name="published_at">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
          >
            Simpan
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
