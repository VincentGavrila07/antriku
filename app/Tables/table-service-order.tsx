"use client";
import { Table, Spin, Button } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { ShopOutlined } from "@ant-design/icons";
import { TableServiceOrderProps } from "../props/table-service-order-prps";
import { Service } from "@/types/Service";

export default function TableServiceOrder({
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  onChange,
  onOrder
}: TableServiceOrderProps) {


  const columns: ColumnsType<Service> = [
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => onOrder(record)}
          >
            <ShopOutlined />
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
