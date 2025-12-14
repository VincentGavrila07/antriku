"use client";

import { Card, Tag, Typography, Spin, Empty, Pagination } from "antd";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ServiceService from "@/services/ServiceService";
import { HistoryByServiceResponse } from "@/types/Service";

const { Text } = Typography;

type Props = {
  serviceId: number;
  queueDate: string;
};

export default function HistoryQueueList({ serviceId, queueDate }: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // reset page kalau ganti service / tanggal
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [serviceId, queueDate]);

  const {
    data,
    isLoading,
    isFetching,
  } = useQuery<HistoryByServiceResponse>({
    queryKey: ["history-by-service", serviceId, queueDate, page],
    queryFn: () =>
      ServiceService.getHistoryByService({
        service_id: serviceId,
        queue_date: queueDate,
        status: "completed",
        page,
        pageSize,
      }),
    enabled: !!serviceId,
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spin />
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return <Empty description="Belum ada history pelayanan" />;
  }

  const currentPage = data.current_page;
  const total = data.total;

  return (
    <Card
      title="RIWAYAT PELAYANAN"
      size="small"
      className="shadow-sm"
      loading={isFetching}
    >
      <div className="space-y-3">
        {data.data.map((item) => (
          <div
            key={item.queue_id}
            className="flex justify-between items-start border-b pb-2 last:border-b-0"
          >
            <div>
              <Text strong>{item.user?.name ?? "Pasien"}</Text>

              <Text type="secondary" className="block">
                {data.service_name}
              </Text>

              <Text type="secondary" className="text-xs">
                Selesai{" "}
                {new Date(item.updated_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </div>

            <Tag color="green">{item.queue_code}</Tag>
          </div>
        ))}
      </div>

      {/* ✅ PAGINATION + JUMP TO */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          showSizeChanger={false}
          showQuickJumper
          onChange={(p) => setPage(p)}
        />
      </div>
    </Card>
  );
}
