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
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePermission } from "@/app/context/permission-context";
import Breadcrumbs from "@/app/components/breadcrumbs";
import BeritaService from "@/services/BeritaService";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface UpdateBeritaFormValues {
  judul: string;
  deskripsi: string;
  published_at?: dayjs.Dayjs;
}

export default function EditBeritaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["berita"] | undefined = translations?.berita;
  const { permissions, loading: permissionLoading } = usePermission();

  const [form] = Form.useForm<UpdateBeritaFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  /** permission guard */
  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-berita-management")) {
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);

  /** fetch detail */
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await BeritaService.getDetailBerita(id);
        const berita = res.data;

        form.setFieldsValue({
          judul: berita.judul,
          deskripsi: berita.deskripsi,
          published_at: berita.published_at
            ? dayjs(berita.published_at)
            : undefined,
        });

        // preload foto lama
        if (berita.foto) {
          setFileList([
            {
              uid: "-1",
              name: "foto",
              status: "done",
              url: berita.foto,
            },
          ]);
        }
      } catch {
        notification.error({ title: t?.ErrorLoadBerita });
      } finally {
        setLoadingData(false);
      }
    };

    fetchDetail();
  }, [id, form, t]);

  if (langLoading || permissionLoading || loadingData || !t) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  /** submit */
  const handleSubmit = async (values: UpdateBeritaFormValues) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || "";

      const payload = new FormData();
      payload.append("judul", values.judul);
      payload.append("deskripsi", values.deskripsi);

      if (values.published_at) {
        payload.append(
          "published_at",
          values.published_at.format("YYYY-MM-DD HH:mm:ss")
        );
      }

      // upload foto baru jika ada
      const file = fileList[0]?.originFileObj;
      if (file instanceof File) {
        payload.append("foto", file);
      }

      await BeritaService.updateBerita(id, payload, token);

      notification.success({ title: t.SuccessEditBerita });
      router.push("/berita");
    } catch {
      notification.error({ title: t.ErrorEditBerita });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t.BeritaName, href: "/berita" },
          { label: t.EditBerita, href: `/berita/${id}/edit` },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">
        {t.EditBerita}
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
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

        {/* Foto */}
        <Form.Item label={t.Image}>
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) =>
              setFileList(fileList as UploadFile[])
            }
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>
              Upload Foto
            </Button>
          </Upload>
        </Form.Item>

        {/* Published At */}
        <Form.Item label={t.PublishedAt} name="published_at">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        {/* Submit */}
        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
          >
            {t.save}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
