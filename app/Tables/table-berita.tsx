"use client";

import { Table, Spin, Button, Image } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Berita } from "@/types/Berita";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/languange-context";
import { TableBeritaProps } from "../props/table-berita-props";

export default function TableBerita({
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  onChange,
  onDelete,
}: TableBeritaProps) {
  const router = useRouter();
  const { translations } = useLanguage();
  const t = translations?.berita;

  const columns: ColumnsType<Berita> = [
    {
      title: "No",
      width: 70,
      align: "center",
      render: (_, __, index) =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t?.Title || "Title",
      dataIndex: "judul",
      key: "judul",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Foto",
      dataIndex: "foto",
      key: "foto",
      render: (foto: string | null) =>
        foto ? (
          <Image
            src={foto}
            width={80}
            height={80}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span>-</span>
        ),
      },
      {
        title: t?.Description || "Description",
        dataIndex: "deskripsi",
        key: "deskripsi",
        render: (text) => (
          <span className="font-medium text-gray-800">{text}</span>
        ),
      },
    {
      title: t?.PublishedAt || "Published At",
      dataIndex: "published_at",
      key: "published_at",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Action",
      key: "action",
      width: 130,
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            size="small"
            onClick={() => router.push(`/berita/edit/${record.id}`)}
          >
            <EditOutlined />
          </Button>

          <Button
            size="small"
            onClick={() => onDelete?.(record.id.toString())}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (onChange) {
      onChange(
        pagination.current || 1,
        pagination.pageSize || pageSize
      );
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "50"],
            showTotal: (total) => `Total ${total} berita`,
          }}
          onChange={handleTableChange}
          locale={{ emptyText: t?.NoData || "No Data" }}
          rowClassName={() =>
            "hover:bg-gray-50 transition-colors duration-200"
          }
        />
      </div>
    </Spin>
  );
}
