"use client";

import { Translations, useLanguage } from "@/app/languange-context";
import { Spin, notification, Select, DatePicker } from "antd";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { usePermission } from "@/app/context/permission-context";
import ServiceService from "@/services/ServiceService";
import TableServiceHistory from "@/app/Tables/table-service-history";
import { TrService, TrServiceResponsePagination } from "@/types/Service";
import dayjs from "dayjs";

const { Option } = Select;

export default function ServiceHistoryPage() {
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["serviceHistory"] | undefined =
    translations?.serviceHistory;

  const { permissions, loading: permissionLoading } = usePermission();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<string>();
  const [queueDate, setQueueDate] = useState<string>();

  // ✅ AMBIL ROLE ID YANG BENAR
  const roleId = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.roleId;
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const {
    data: histories,
    isLoading,
    error,
  } = useQuery<TrServiceResponsePagination<TrService[]>, Error>({
    queryKey: ["service-history", roleId, page, pageSize, status, queueDate],
    queryFn: () =>
      ServiceService.getServiceHistory(roleId!, {
        page,
        pageSize,
        status,
        queue_date: queueDate,
        user_id: userId,
      }),
    // enabled:
    //   !!roleId && permissions.includes("view-service-history"),
  });

  //   useEffect(() => {
  //     if (
  //       !permissionLoading &&
  //       !permissions.includes("view-service-history")
  //     ) {
  //       router.replace("/forbidden");
  //     }
  //   }, [permissions, permissionLoading, router]);

  if (langLoading || permissionLoading || !translations) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );
  }

  if (error) {
    notification.error({
      title: t?.ErrorLoadServiceHistory || "Failed to load service history",
      description:
        t?.ErrorLoadServiceHistoryDesc ||
        "An error occurred while fetching service history data",
    });
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t?.Service || "Service", href: "/admin/service-history" },
        ]}
      />

      <h2 className="text-3xl font-semibold mb-4 mt-5">
        {t?.ServiceHistory || "Service History"}
      </h2>

      {/* FILTER */}
      <div className="flex gap-4 mb-6 justify-end">
        <Select
          allowClear
          placeholder={t?.Status || "Status"}
          className="w-48"
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <Option value="waiting">{t?.Waiting || "Waiting"}</Option>
          <Option value="completed">{t?.Completed || "Completed"}</Option>
          <Option value="cancelled">{t?.Cancelled || "Cancelled"}</Option>
        </Select>

        <DatePicker
          placeholder={t?.QueueDate || "Queue Date"}
          className="w-48"
          onChange={(date) => {
            setQueueDate(date ? dayjs(date).format("YYYY-MM-DD") : undefined);
            setPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <TableServiceHistory
        data={histories?.data ?? []}
        total={histories?.total || 0}
        page={histories?.current_page || page}
        pageSize={histories?.per_page || pageSize}
        isLoading={isLoading}
        onChange={(newPage, newPageSize) => {
          setPage(newPage);
          if (newPageSize) setPageSize(newPageSize);
        }}
      />
    </div>
  );
}
