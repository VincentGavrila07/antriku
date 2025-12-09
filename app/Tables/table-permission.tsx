"use client";
import { Table, Spin, Button } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Role } from "@/types/Role";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation"
import { TablePermissionProps } from "../props/table-permission-props";

export default function TablePermission({
  data,
  isLoading = false,
}: TablePermissionProps) {

  const router = useRouter();

  const columns: ColumnsType<Role> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 80,
      align: "center",
      render: (_, __, index) => <span className="font-medium text-gray-700">{index + 1}</span>,
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => {
              router.push(`/user-management/permission/edit/${record.id}`);
            }}
          >
            <EditOutlined />
          </Button>
        </div>
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
          bordered={false}
          rowClassName={() => "hover:bg-gray-50 transition-colors duration-200"}
          className="rounded-lg"
          locale={{ emptyText: 'No Data' }}  
        />
      </div>
    </Spin>
  );
}
