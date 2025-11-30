"use client";

import { useLanguage } from "@/app/languange-context";
import { Spin, Input, notification, Button } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TableUser from "@/app/Tables/table-user";
import UserService from "@/services/UserService";
import { User, UserResponsePagination } from "@/types/User";
import { useDebounce } from "@/app/utils/useDebounce";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { usePermission } from "@/app/context/permission-context";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";  

export default function UserManagementPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const { permissions, loading: permissionLoading } = usePermission();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 1500);


  const { data: users, isLoading, error, refetch } = useQuery<UserResponsePagination<User[]>, Error>({
    queryKey: ["users", page, pageSize, debouncedSearch],
    queryFn: () =>
      UserService.getAllUsers({
        page,
        pageSize,
        filters: { name: debouncedSearch },
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

  if (error) {
    notification.error({
      title: "Gagal Memuat Data User",
      description: "Terjadi kesalahan dalam memuat data user",
    });
  }

  const t = translations.Sidebar;

  const handleDeleteUser = async (userId: string) => {
    console.log("Attempting to delete user:", userId); 
    try {
      await UserService.deleteUser(userId, localStorage.getItem("token") || "");

      refetch();

      notification.success({ title: "User berhasil dihapus" });
    } catch (error) {
      console.error("Delete failed:", error);  
      notification.error({
        title: "Gagal Menghapus User",
        description: "Terjadi kesalahan saat menghapus user",
      });
    }
  };

  const handleDeleteConfirmation = (userId: string) => {
    Swal.fire({
      title: "Konfirmasi Hapus User",
      text: "Apakah Anda yakin ingin menghapus user ini?",
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
            console.log("Tombol Add User diklik!");
          }}
        >
          Add User
        </Button>
      </div>

      <TableUser
        data={users?.data ?? []}
        total={users?.total || 0}
        page={users?.current_page || page}
        pageSize={users?.per_page || pageSize}
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
