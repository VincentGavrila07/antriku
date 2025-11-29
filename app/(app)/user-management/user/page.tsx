"use client";

import { useLanguage } from "@/app/languange-context";
import { Spin, Input, notification } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TableUser from "@/app/Tables/table-user";
import UserService from "@/services/UserService";
import { User, UserResponsePagination } from "@/types/User";
import { useDebounce } from "@/app/utils/useDebounce";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { usePermission } from "@/app/context/permission-context";

export default function UserManagementPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const { permissions, loading: permissionLoading } = usePermission();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 1500);


  // Debug: cek permission
  useEffect(() => {
    if (!permissionLoading) {
      console.log("Permissions user loaded:", permissions);
    }
  }, [permissionLoading, permissions]);


  useEffect(() => {
    if (!permissionLoading && !permissions.includes("view-user-management")) {
      
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);

  // Fetch user hanya kalau permission ada
  const { data: users, isLoading, error } = useQuery<
    UserResponsePagination<User[]>,
    Error
  >({
    queryKey: ["users", page, pageSize, debouncedSearch],
    queryFn: () =>
      UserService.getAllUsers({
        page,
        pageSize,
        filters: { name: debouncedSearch },
      }),
    enabled: permissions.includes("view-user-management"),
  });

  if (langLoading || permissionLoading || !translations) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }

  if(error){
    notification.error({ title: "Gagal Memuat Data User", description: "Terjadi kesalahan dalam memuat data user" });
  }

  const t = translations.Sidebar;

  return (
    <div className="p-6">
      <Breadcrumbs
        items={[{ label: "User", href: "/admin/user-management/user" }]}
      />

      <h1 className="text-2xl font-bold mb-4">{t.userManagement}</h1>

      <Input
        placeholder="Search by name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4"
      />

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
      />
    </div>
  );
}
