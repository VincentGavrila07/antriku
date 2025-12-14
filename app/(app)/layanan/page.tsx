"use client";

import { useLanguage } from "@/app/languange-context";
import { Spin, Input, notification, Button } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/app/utils/useDebounce";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { usePermission } from "@/app/context/permission-context";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { Service, ServiceResponsePagination } from "@/types/Service";
import ServiceService from "@/services/ServiceService";
import TableService from "@/app/Tables/table-service";

export default function ServiceManagementPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const { permissions, loading: permissionLoading } = usePermission();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 1500);

  const t = translations?.service;

  const {
    data: services,
    isLoading: loadingServices,
    error: errorServices,
    refetch,
  } = useQuery<ServiceResponsePagination<Service[]>, Error>({
    queryKey: ["services", page, pageSize, debouncedSearch],
    queryFn: () =>
      ServiceService.getAllService({
        page,
        pageSize,
        filters: { name: debouncedSearch },
      }),
    enabled: permissions.includes("view-Service-management"),
  });

  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-Service-management")) {
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);

  useEffect(() => {
    if (errorServices) {
      notification.error({
        title: "Gagal Memuat Data Service",
        description: "Terjadi kesalahan dalam memuat data service",
      });
    }
  }, [errorServices]);

  if (langLoading || permissionLoading || !translations) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }

  const handleDeleteService = async (serviceId: string) => {
    try {
      await ServiceService.deleteService(
        serviceId,
        localStorage.getItem("token") || ""
      );
      refetch();
      notification.success({ title: "Service berhasil dihapus" });
    } catch {
      notification.error({
        title: "Gagal Menghapus Service",
        description: "Terjadi kesalahan saat menghapus Service",
      });
    }
  };

  const handleDeleteConfirmation = (serviceId: string) => {
    Swal.fire({
      title: "Konfirmasi Hapus Service",
      text: "Apakah Anda yakin ingin menghapus Service ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteService(serviceId);
      }
    });
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: t?.page.ListService || "List Service",
            href: "/layanan",
          },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">
        {t?.page.ListService}
      </h2>

      <div className="flex justify-end items-center mt-4 mb-6 gap-5">
        <Input
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-80 max-w-xs"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/layanan/add")}
        >
          {t?.page.AddLayanan}
        </Button>
      </div>

      <TableService
        data={services?.data ?? []}
        total={services?.total || 0}
        page={services?.current_page || page}
        pageSize={services?.per_page || pageSize}
        isLoading={loadingServices}
        onChange={(newPage, newPageSize) => {
          setPage(newPage);
          if (newPageSize) setPageSize(newPageSize);
        }}
        onDelete={handleDeleteConfirmation}
      />
    </div>
  );
}
