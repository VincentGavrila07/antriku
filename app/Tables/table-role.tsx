"use client";
import { Table, Spin, Button } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Role } from "@/types/Role";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation"
import { TableRoleProps } from "../props/table-role-props";

export default function TableRole({
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  onChange,
  onDelete
}: TableRoleProps) {

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
