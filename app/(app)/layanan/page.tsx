"use client";

import { Translations, useLanguage } from "@/app/languange-context";
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
  const t: Translations["service"] | undefined = translations?.service;
  const { permissions, loading: permissionLoading } = usePermission();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 1500);

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
    if (
      !permissionLoading &&
      !permissions.includes("view-Service-management")
    ) {
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

  if (errorServices) {
    notification.error({
      title: t?.ErrorLoadServiceTitle,
      description: t?.ErrorLoadServiceDesc,
    });
  }

  const handleDeleteService = async (userId: string) => {
    console.log("Attempting to delete Service:", userId);
    try {
      await ServiceService.deleteService(
        userId,
        localStorage.getItem("token") || ""
      );

      refetch();

      notification.success({ title: t?.SuccessDeleteService });
    } catch (error) {
      console.error("Delete failed:", error);
      notification.error({
        title: t?.ErrorDeleteServiceTitle,
        description: t?.ErrorDeleteServiceDesc,
      });
    }
  };

  const handleDeleteConfirmation = (serviceId: string) => {
    Swal.fire({
      title: t?.DeleteServiceConfirmTitle,
      text: t?.DeleteServiceConfirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t?.DeleteServiceConfirmOk,
      cancelButtonText: t?.DeleteServiceConfirmCancel,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteService(serviceId);
      }
    });
  };

  return (
    <div>
      <Breadcrumbs
        items={[{ label: t?.Services ?? "", href: "/admin/layanan" }]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">{t?.ListService}</h2>

      <div className="flex justify-end items-center mt-4 mb-6 gap-5">
        <Input
          placeholder={t?.SearchByNameService}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-80 max-w-xs mr-4"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/layanan/add")}
        >
          {t?.AddServiceButton}
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
