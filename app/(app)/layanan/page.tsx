"use client";

import { useLanguage } from "@/app/languange-context";
import { Spin, Input, notification, Button } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import UserService from "@/services/UserService";
import { useDebounce } from "@/app/utils/useDebounce";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { usePermission } from "@/app/context/permission-context";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";  
import { Service, ServiceResponsePagination } from "@/types/Service";
import ServiceService from "@/services/ServiceService";
import TableService from "@/app/Tables/table-service";

export default function SeriveManagementPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const { permissions, loading: permissionLoading } = usePermission();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 1500);


  const { data: services, isLoading:loadingServices, error:errorServices, refetch } = useQuery<ServiceResponsePagination<Service[]>, Error>({
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

  if (langLoading || permissionLoading || !translations) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }

  if (errorServices) {
    notification.error({
      title: "Gagal Memuat Data Service",
      description: "Terjadi kesalahan dalam memuat data service",
    });
  }

  const t = translations.Sidebar;

  const handleDeleteUser = async (userId: string) => {
    console.log("Attempting to delete Service:", userId); 
    try {
      await ServiceService.deleteService(userId, localStorage.getItem("token") || "");

      refetch();

      notification.success({ title: "Service berhasil dihapus" });
    } catch (error) {
      console.error("Delete failed:", error);  
      notification.error({
        title: "Gagal Menghapus Service",
        description: "Terjadi kesalahan saat menghapus Service",
      });
    }
  };

  const handleDeleteConfirmation = (userId: string) => {
    Swal.fire({
      title: "Konfirmasi Hapus Service",
      text: "Apakah Anda yakin ingin menghapus Service ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser(userId);
      }
    });
  };

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "User", href: "/admin/user-management/user" }]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">List Service</h2>

      <div className="flex justify-end items-center mt-4 mb-6 gap-5">
        <Input
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-80 max-w-xs mr-4" 
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            router.push("/layanan/add");
          }}
        >
          Add Layanan
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
