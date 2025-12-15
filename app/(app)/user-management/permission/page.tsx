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
import PermissionService from "@/services/PermissionService";
import TablePermission from "@/app/Tables/table-permission";
import { PermissionListResponse } from "@/services/PermissionService";

import type { Translations } from "@/app/languange-context";

export default function PermissionManagementPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const { permissions, loading: permissionLoading } = usePermission();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const t: Translations["userManagement"] | undefined =
    translations?.userManagement;

  const {
    data: permissionData,
    isLoading: permissionDataLoad,
    error: permissionError,
  } = useQuery<PermissionListResponse, Error>({
    queryKey: ["permissions", page, pageSize],
    queryFn: () => PermissionService.getAllPermission(),
    enabled: permissions.includes("view-permission-management"),
  });

  useEffect(() => {
    if (
      !permissionLoading &&
      !permissions.includes("view-permission-management")
    ) {
      router.replace("/forbidden");
    }
  }, [permissions, permissionLoading, router]);

  if (langLoading || permissionLoading || !t) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }

  if (permissionError) {
    notification.error({
      title: t.ErrorLoad,
      description: t.ErrorLoadDesc,
    });
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: t.PermissionInfo,
            href: "m/user-management/permission",
          },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">{t.ListPermission}</h2>

      <TablePermission
        data={permissionData?.data ?? []}
        isLoading={permissionDataLoad}
      />
    </div>
  );
}
