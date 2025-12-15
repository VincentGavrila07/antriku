"use client";

import { useLanguage } from "@/app/languange-context";
import type { Translations } from "@/app/languange-context";
import { Spin, notification, Button } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { usePermission } from "@/app/context/permission-context";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

import { Berita } from "@/types/Berita";
import BeritaService from "@/services/BeritaService";
import TableBerita from "@/app/Tables/table-berita";
import { BeritaResponsePagination } from "@/types/Berita";

export default function BeritaManagementPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["berita"] | undefined = translations?.berita;

  const { permissions, loading: permissionLoading } = usePermission();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: berita,
    isLoading,
    error: beritaError,
    refetch,
  } = useQuery<BeritaResponsePagination<Berita[]>, Error>({
    queryKey: ["berita", page, pageSize],
    queryFn: () =>
      BeritaService.getAllBeritaPagination({
        page,
        pageSize,
      }),
    enabled: permissions.includes("view-berita-management"),
  });

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

  if (beritaError) {
    notification.error({
      title: t.ErrorLoadBerita,
      description: t.ErrorLoadBeritaDesc,
    });
  }

  const handleDeleteBerita = async (beritaId: string) => {
    try {
      await BeritaService.deleteBerita(
        beritaId,
        localStorage.getItem("token") || ""
      );
      refetch();
      notification.success({ title: t.SuccessDeleteBerita });
    } catch (error) {
      notification.error({
        title: t.ErrorDeleteBerita,
        description: t.ErrorDeleteBerita,
      });
    }
  };

  const handleDeleteConfirmation = (beritaId: string) => {
    Swal.fire({
      title: t.DeleteBeritaConfirmTitle,
      text: t.DeleteBeritaConfirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t.DeleteBeritaConfirmOk,
      cancelButtonText: t.DeleteBeritaConfirmCancel,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteBerita(beritaId);
      }
    });
  };

  return (
    <div>
      <Breadcrumbs
        items={[{ label: t.ListBerita, href: "/berita" }]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">
        {t.ListBerita}
      </h2>

      <div className="flex justify-end items-center mt-4 mb-6 gap-5">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/berita/add")}
        >
          {t.AddBerita}
        </Button>
      </div>

      <TableBerita
        data={berita?.data ?? []}
        total={berita?.total || 0}
        page={berita?.current_page || page}
        pageSize={berita?.per_page || pageSize}
        isLoading={isLoading}
        onChange={(newPage, newPageSize) => {
          setPage(newPage);
          if (newPageSize) setPageSize(newPageSize);
        }}
        onDelete={handleDeleteConfirmation}
      />
    </div>
  );
}
