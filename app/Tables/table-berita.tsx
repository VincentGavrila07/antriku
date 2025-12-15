"use client";

import { Table, Spin, Button, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";
import { Berita } from "@/types/Berita";
import { TableBeritaProps } from "../props/table-berita-props";

export default function TableBerita({
  data,
  isLoading = false,
  onDelete,
}: TableBeritaProps) {
  const columns: ColumnsType<Berita> = [
    {
      title: "No",
      key: "no",
      width: 70,
      align: "center",
      render: (_, __, index) => (
        <span className="font-medium text-gray-700">{index + 1}</span>
      ),
    },
    {
      title: "Judul",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => (
        <span className="text-gray-600">{text}</span>
      ),
    },
    {
      title: "Foto",
      dataIndex: "image",
      key: "image",
      width: 120,
      align: "center",
      render: (image) =>
        image ? (
          <Image
            src={image}
            alt="berita"
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Published At",
      dataIndex: "published_at",
      key: "published_at",
      align: "center",
      render: (date) => (
        <span className="text-gray-700">
          {date ? new Date(date).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          danger
          onClick={() => onDelete?.(record.id.toString())}
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          bordered={false}
          rowClassName={() =>
            "hover:bg-gray-50 transition-colors duration-200"
          }
          locale={{ emptyText: "Belum ada berita" }}
        />
      </div>
    </Spin>
  );
}
