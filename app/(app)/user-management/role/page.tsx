"use client";

import { useLanguage } from "@/app/languange-context";
import { Spin, notification, Button } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { usePermission } from "@/app/context/permission-context";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";  
import { Role, RoleResponsePagination } from "@/types/Role";
import RoleService from "@/services/RoleService";
import TableRole from "@/app/Tables/table-role";

export default function RoleManagementPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const { permissions, loading: permissionLoading } = usePermission();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

    const { data: roles, isLoading, error:roleError , refetch } =
    useQuery<RoleResponsePagination<Role[]>, Error>({
        queryKey: ["roles", page, pageSize],
        queryFn: () =>
        RoleService.getAllRolePagination({
            page,
            pageSize,
            
        }),
        enabled: permissions.includes("view-user-management"),
    });


  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-user-management")) {
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

    if (roleError) {
      notification.error({
        title: "Gagal Memuat Data User",
        description: "Terjadi kesalahan dalam memuat data user",
      });
    }


  const t = translations.Sidebar;

  const handleDeleteRole = async (roleId: string) => {
    console.log("Attempting to delete Role:", roleId); 
    try {
      await RoleService.deleteRole(roleId, localStorage.getItem("token") || "");

      refetch();

      notification.success({ title: "Role berhasil dihapus" });
    } catch (error) {
      console.error("Delete failed:", error);  
      notification.error({
        title: "Gagal Menghapus role",
        description: "Terjadi kesalahan saat menghapus role",
      });
    }
  };

  const handleDeleteConfirmation = (userId: string) => {
    Swal.fire({
      title: "Konfirmasi Hapus User",
      text: "Apakah Anda yakin ingin menghapus role ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteRole(userId);
      }
    });
  };

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Role", href: "/admin/user-management/role" }]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">List Role</h2>

      <div className="flex justify-end items-center mt-4 mb-6 gap-5">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            router.push("/user-management/role/add");
          }}
        >
          Add Role
        </Button>
      </div>

      <TableRole
        data={roles?.data ?? []}
        total={roles?.total || 0}
        page={roles?.current_page || page}
        pageSize={roles?.per_page || pageSize}
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
