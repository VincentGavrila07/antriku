"use client";
import { Table, Spin, Button } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { TableUserProps } from "../props/table-user-props";
import { User } from "@/types/User";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation"

export default function TableUser({
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  onChange,
  onDelete
}: TableUserProps) {

  const router = useRouter();

  const columns: ColumnsType<User> = [
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleId",
      render: (text) => (
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
          {text}
        </span>
      ),
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
              router.push(`/user-management/user/${record.id}`);
            }}
          >
            <EyeOutlined />
          </Button>
          <Button
            onClick={() => {
              router.push(`/user-management/user/edit/${record.id}`);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={() => {
              if (onDelete) {
                onDelete(record.id.toString()); 
              }
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (onChange) {
      onChange(pagination.current || 1, pagination.pageSize || 10);  
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
            pageSizeOptions: ['10', '20', '30', '50'],  
            showTotal: (total) => `Total ${total} pengguna`,
            className: "mt-2",
          }}
          onChange={handleTableChange}
          bordered={false}
          rowClassName={() => "hover:bg-gray-50 transition-colors duration-200"}
          className="rounded-lg"
          locale={{ emptyText: 'No Data' }}  
        />
      </div>
    </Spin>
  );
}
