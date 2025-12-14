"use client";

import React, { useState, useEffect, memo } from "react";
import { User } from "@/types/User";
import { Service } from "@/types/Service";
import { useLanguage } from "@/app/languange-context";
import {
  Spin,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Avatar,
  Tag,
  Table,
  Input,
} from "antd";
import {
  TeamOutlined,
  MedicineBoxOutlined,
  NumberOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  DatabaseOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import UserService from "@/services/UserService";
import ServiceService from "@/services/ServiceService";

const { Title, Text } = Typography;

/* ================= JAM REALTIME ================= */
const RealtimeClock = memo(() => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () =>
      setTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <ClockCircleOutlined className="text-gray-400" />
      <Text className="font-mono font-bold text-gray-600">{time}</Text>
    </div>
  );
});
RealtimeClock.displayName = "RealtimeClock";

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { translations, loading: langLoading } = useLanguage();
  const [searchText, setSearchText] = useState("");

  const [totalPatients, setTotalPatients] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [todayQueues, setTodayQueues] = useState(0);
  const [activeServices, setActiveServices] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const [services, setServices] = useState<Service[]>([]);
  const [tableLoading, setTableLoading] = useState(false);

  const [staffMap, setStaffMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoadingStats(true);
        setTableLoading(true);

        const patientRes = await UserService.getTotalUserByRole(2);
        const staffRes = await UserService.getTotalUserByRole(3);

        const staffList = await UserService.getAllUsers({
          page: 1,
          pageSize: 1000,
          filters: { roleId: 3 },
        });

        const map: Record<number, string> = {};
        staffList.data.forEach((u: User) => (map[u.id] = u.name));
        setStaffMap(map);

        const serviceRes = await ServiceService.getAllService({
          page: 1,
          pageSize: 100,
        });

        const today = new Date().toISOString().split("T")[0];
        let todayServe = 0;
        try {
          const serveRes = await ServiceService.getTotalServe({ queue_date: today });
          todayServe = serveRes.total_completed_services;
        } catch {}

        setTotalPatients(patientRes.total);
        setTotalStaff(staffRes.total);
        setActiveServices(serviceRes.total);
        setTodayQueues(todayServe);
        setServices(serviceRes.data);
      } finally {
        setLoadingStats(false);
        setTableLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (langLoading || loadingStats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-4">
            <Avatar size={64} icon={<SettingOutlined />} className="bg-blue-900" />
            <div>
              <Title level={3} className="m-0">
                {translations?.Sidebar?.adminDashboard || "Admin Dashboard"}
              </Title>
              <Text type="secondary">
                Selamat datang, <b>{user.name}</b>
              </Text>
            </div>
          </div>
          <RealtimeClock />
        </div>

        {/* 🔥 STATISTIC CARDS */}
        <Row gutter={[20, 20]}>
          <Col xs={24} md={12} lg={6}>
            <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <Text className="text-white/80">Total Pasien</Text>
                  <div className="text-3xl font-bold">{totalPatients}</div>
                </div>
                <TeamOutlined className="text-5xl opacity-30" />
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <Text className="text-white/80">Total Staff</Text>
                  <div className="text-3xl font-bold">{totalStaff}</div>
                </div>
                <MedicineBoxOutlined className="text-5xl opacity-30" />
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Card className="rounded-2xl shadow-lg !bg-gradient-to-r from-orange-400 to-orange-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <Text className="text-white/80">Antrian Hari Ini</Text>
                  <div className="text-3xl font-bold">{todayQueues}</div>
                </div>
                <NumberOutlined className="text-5xl opacity-30" />
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Card className="rounded-2xl shadow-lg !bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <Text className="text-white/80">Layanan Aktif</Text>
                  <div className="text-3xl font-bold">{activeServices}</div>
                </div>
                <DatabaseOutlined className="text-5xl opacity-30" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* TABLE */}
        <Card
          title="Daftar Layanan"
          className="rounded-2xl shadow"
          extra={
            <Input
              placeholder="Cari layanan"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
          }
        >
          <Table<Service>
            rowKey="id"
            loading={tableLoading}
            dataSource={filteredServices}
            pagination={{ pageSize: 5 }}
            columns={[
              { title: "Kode", dataIndex: "code", width: 120 },
              { title: "Layanan", dataIndex: "name" },
              {
                title: "Staff",
                dataIndex: "assigned_user_ids",
                render: (ids?: number[]) =>
                  !ids?.length ? (
                    <Tag>Belum di-assign</Tag>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {ids.map((id) => (
                        <Tag key={id} icon={<UserOutlined />} color="blue">
                          {staffMap[id]}
                        </Tag>
                      ))}
                    </div>
                  ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
