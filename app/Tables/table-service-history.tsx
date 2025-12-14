"use client";

import { Table, Spin, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { TrService } from "@/types/Service";
import { TableServiceHistoryProps } from "../props/table-service-history-props";

export default function TableServiceHistory({
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  onChange,
}: TableServiceHistoryProps) {

  const columns: ColumnsType<TrService> = [
    {
      title: "No",
      key: "no",
      width: 70,
      align: "center",
      render: (_, __, index) =>
        (page - 1) * pageSize + index + 1,
    },
    {
    title: "Nama Customer",
    key: "user_name",
    render: (_, record) => (
        <span className="font-medium">
        {record.user?.name ?? "-"}
        </span>
        ),
    },

    {
      title: "Kode Antrian",
      dataIndex: "queue_code",
      key: "queue_code",
      render: (text) => (
        <Tag color="blue" className="font-semibold">
          {text}
        </Tag>
      ),
    },
    {
      title: "No Antrian",
      dataIndex: "queue_number",
      key: "queue_number",
      align: "center",
    },
    {
      title: "Tanggal",
      dataIndex: "queue_date",
      key: "queue_date",
      render: (date) =>
        new Date(date).toLocaleDateString("id-ID"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const colorMap: Record<string, string> = {
          waiting: "orange",
          processing: "blue",
          completed: "green",
          cancelled: "red",
        };

        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onChange?.(
      pagination.current || 1,
      pagination.pageSize || pageSize
    );
  };

  return (
    <Spin spinning={isLoading}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
          showTotal: (total) => `Total ${total} antrian`,
        }}
        onChange={handleTableChange}
        className="rounded-lg"
        locale={{ emptyText: "Tidak ada data riwayat" }}
      />
    </Spin>
  );
}
