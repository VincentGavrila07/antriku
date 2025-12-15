"use client";

import React, { useState, useEffect, memo } from "react";
import { User } from "@/types/User";
import { Service } from "@/types/Service";
import { useLanguage } from "@/app/languange-context";
import type { Translations } from "@/app/languange-context";
import {
  Spin,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Avatar,
  Tag,
  Progress,
  Table,
  Input,
  Tooltip,
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
    <div className="flex items-center gap-2 mt-1">
      <ClockCircleOutlined className="text-gray-400" />
      <Text className="text-gray-500 font-mono font-bold">{time}</Text>
    </div>
  );
});
RealtimeClock.displayName = "RealtimeClock";

interface AdminDashboardProps {
  user: User;
}
export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["dashboard"] | undefined = translations?.dashboard;
  const [searchText, setSearchText] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoadingStats(true);
        setTableLoading(true);

        /* ===== USER STATS ===== */
        const patientRes = await UserService.getTotalUserByRole(2);
        const staffRes = await UserService.getTotalUserByRole(3);

        /* ===== AMBIL STAFF SAJA (roleId = 3) ===== */
        const staffListRes = await UserService.getAllUsers({
          page: 1,
          pageSize: 100,
          filters: {
            roleId: 3, // 🔥 PENTING
          },
        });

        const staffNameMap: Record<number, string> = {};
        staffListRes.data.forEach((u: User) => {
          staffNameMap[u.id] = u.name;
        });
        setStaffMap(staffNameMap);

        /* ===== AMBIL SERVICE ===== */
        const serviceRes = await ServiceService.getAllService({
          page: 1,
          pageSize: 100,
        });

        /* ===== QUEUE HARI INI ===== */
        const today = new Date().toISOString().split("T")[0];
        let totalServeToday = 0;

        try {
          const serveRes = await ServiceService.getTotalServe({
            queue_date: today,
          });
          totalServeToday = serveRes.total_completed_services;
        } catch {}

        setTotalPatients(patientRes.total);
        setTotalStaff(staffRes.total);
        setActiveServices(serviceRes.total);
        setTodayQueues(totalServeToday);
        setServices(serviceRes.data);
      } catch (err) {
        console.error("Gagal memuat dashboard", err);
      } finally {
        setLoadingStats(false);
        setTableLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ================= STATS ================= */
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [todayQueues, setTodayQueues] = useState(0);
  const [activeServices, setActiveServices] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  /* ================= TABLE ================= */
  const [services, setServices] = useState<Service[]>([]);
  const [tableLoading, setTableLoading] = useState(false);

  /* ================= STAFF MAP (roleId = 3) ================= */
  const [staffMap, setStaffMap] = useState<Record<number, string>>({});

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoadingStats(true);
        setTableLoading(true);

        /* ===== USER STATS ===== */
        const patientRes = await UserService.getTotalUserByRole(2);
        const staffRes = await UserService.getTotalUserByRole(3);

        /* ===== AMBIL STAFF SAJA (roleId = 3) ===== */
        const staffListRes = await UserService.getAllUsers({
          page: 1,
          pageSize: 100,
          filters: {
            roleId: 3, // 🔥 PENTING
          },
        });

        const staffNameMap: Record<number, string> = {};
        staffListRes.data.forEach((u: User) => {
          staffNameMap[u.id] = u.name;
        });
        setStaffMap(staffNameMap);

        /* ===== AMBIL SERVICE ===== */
        const serviceRes = await ServiceService.getAllService({
          page: 1,
          pageSize: 100,
        });

        /* ===== QUEUE HARI INI ===== */
        const today = new Date().toISOString().split("T")[0];
        let totalServeToday = 0;

        try {
          const serveRes = await ServiceService.getTotalServe({
            queue_date: today,
          });
          totalServeToday = serveRes.total_completed_services;
        } catch {}

        setTotalPatients(patientRes.total);
        setTotalStaff(staffRes.total);
        setActiveServices(serviceRes.total);
        setTodayQueues(totalServeToday);
        setServices(serviceRes.data);
      } catch (err) {
        console.error("Gagal memuat dashboard", err);
      } finally {
        setLoadingStats(false);
        setTableLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (langLoading || !translations) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  /* ================= FILTER ================= */
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchText.toLowerCase())
  );

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar size={64} icon={<SettingOutlined />} className="bg-blue-900" />
            <div>
              <Title level={3} className="m-0">
                {translations.Sidebar?.adminDashboard || "Admin Dashboard"}
              </Title>
              <Text>
                Selamat Datang, <b>{user.name}</b>
              </Text>
            </div>
          </div>
          <RealtimeClock />
        </div>

        {/* STATS */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <TeamOutlined className="text-blue-600 text-2xl mb-2" />
              <Statistic title="Total Pasien" value={totalPatients} />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <MedicineBoxOutlined className="text-teal-600 text-2xl mb-2" />
              <Statistic title="Total Staff" value={totalStaff} />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <NumberOutlined className="text-orange-600 text-2xl mb-2" />
              <Statistic title="Antrian Hari Ini" value={todayQueues} />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <DatabaseOutlined className="text-purple-600 text-2xl mb-2" />
              <Statistic title="Layanan Aktif" value={activeServices} />
              <Progress percent={100} showInfo={false} size="small" />
            </Card>
          </Col>
        </Row>

        {/* TABLE */}
        <Card
          title="Daftar Layanan"
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
              {
                title: "Kode",
                dataIndex: "code",
                width: 120,
              },
              {
                title: "Layanan",
                dataIndex: "name",
              },
              {
                title: "Staff",
                dataIndex: "assigned_user_ids",
                render: (ids?: number[]) => {
                  if (!ids || ids.length === 0) {
                    return (
                      <Tag color="default">
                        Belum di-assign
                      </Tag>
                    );
                  }

                  return (
                    <div className="flex flex-wrap gap-1">
                      {ids.map((id) => (
                        <Tooltip key={id} title="Staff">
                          <Tag icon={<UserOutlined />} color="blue">
                            {staffMap[id] ?? "Unknown"}
                          </Tag>
                        </Tooltip>
                      ))}
                    </div>
                  );
                },
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
