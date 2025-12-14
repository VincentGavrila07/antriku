"use client";

import React, { useState, useEffect, memo } from "react";
import { User } from "@/types/User";
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
  Button,
  Progress,
  Table,
  Input,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  NumberOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  DatabaseOutlined,
  StarFilled,
  ThunderboltOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// --- KOMPONEN JAM ---
const RealtimeClock = memo(() => {
  const [time, setTime] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 mt-1">
      <ClockCircleOutlined className="text-gray-400 text-xs md:text-sm" />
      <Text className="text-gray-500 font-mono font-bold text-sm md:text-base">
        {time}
      </Text>
    </div>
  );
});
RealtimeClock.displayName = "RealtimeClock";

// --- MOCK DATA ---
const mockStats = {
  totalPatients: 1240,
  totalStaff: 18,
  todayQueues: 45,
  activeServices: 6,
};

const serviceStatusData = [
  {
    key: "1",
    name: "Poli Umum",
    status: "Buka",
    queues: 12,
    staff: "Dr. Danish",
  },
  {
    key: "2",
    name: "Poli Gigi",
    status: "Buka",
    queues: 8,
    staff: "Dr. Angel",
  },
  {
    key: "3",
    name: "Poli Anak",
    status: "Istirahat",
    queues: 5,
    staff: "Dr. Tono",
  },
  {
    key: "4",
    name: "Laboratorium",
    status: "Buka",
    queues: 15,
    staff: "Petugas Lab",
  },
  { key: "5", name: "Poli Mata", status: "Buka", queues: 4, staff: "Dr. Budi" },
  { key: "6", name: "Poli THT", status: "Tutup", queues: 0, staff: "-" },
  {
    key: "7",
    name: "Radiologi",
    status: "Buka",
    queues: 2,
    staff: "Suster Ani",
  },
  {
    key: "8",
    name: "Fisioterapi",
    status: "Buka",
    queues: 6,
    staff: "Therapist John",
  },
];

const staffPerformance = [
  {
    key: "1",
    name: "Dr. Danish",
    role: "Umum",
    patients: 24,
    rating: 4.9,
    status: "busy",
  },
  {
    key: "2",
    name: "Dr. Angel",
    role: "Gigi",
    patients: 18,
    rating: 4.8,
    status: "online",
  },
  {
    key: "3",
    name: "Dr. Tono",
    role: "Anak",
    patients: 32,
    rating: 5.0,
    status: "offline",
  },
  {
    key: "4",
    name: "Suster Rina",
    role: "Lab",
    patients: 45,
    rating: 4.7,
    status: "online",
  },
];

interface AdminDashboardProps {
  user: User;
}
export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["dashboard"] | undefined = translations?.dashboard;
  const [searchText, setSearchText] = useState("");

  if (langLoading || !t) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const filteredServiceStatus = serviceStatusData.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(search) ||
      item.staff.toLowerCase().includes(search)
    );
  });

  const CARD_STYLE =
    "shadow-sm rounded-2xl border-none overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col";
  const ICON_BOX_STYLE =
    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 font-sans pb-20">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Avatar
              size={64}
              icon={<SettingOutlined />}
              className="bg-blue-900 shrink-0"
            />
            <div>
              <Title level={3} className="text-gray-800 m-0 font-bold">
                {t.AdminDashboard}
              </Title>
              <div className="flex items-center gap-2">
                <Text type="secondary">{t.Welcome}</Text>
                <Text strong>{user.name}</Text>
                <Tag color="purple" className="ml-2 border-none font-bold">
                  {t.Administrator}
                </Tag>
              </div>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <Text
              type="secondary"
              className="text-xs uppercase font-bold tracking-wider"
            >
              {t.ServerTime}
            </Text>
            <RealtimeClock />
          </div>
        </div>

        {/* --- STATS ROW --- */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            {/* FIX: Mengganti bodyStyle dengan styles.body */}
            <Card className={CARD_STYLE} styles={{ body: { padding: "20px" } }}>
              <div className={`${ICON_BOX_STYLE} bg-blue-50 text-blue-600`}>
                <TeamOutlined />
              </div>
              <Statistic
                title={
                  <span className="text-gray-500 font-medium">
                    {t.TotalPatients}
                  </span>
                }
                value={mockStats.totalPatients}
                styles={{ content: { fontWeight: 800, color: "#1f2937" } }}
              />
              <div className="mt-2 text-xs text-green-500 flex items-center gap-1 font-bold">
                <ArrowUpOutlined /> {t.Growth}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={CARD_STYLE} styles={{ body: { padding: "20px" } }}>
              <div className={`${ICON_BOX_STYLE} bg-teal-50 text-teal-600`}>
                <MedicineBoxOutlined />
              </div>
              <Statistic
                title={
                  <span className="text-gray-500 font-medium">
                    {t.TotalStaff}
                  </span>
                }
                value={mockStats.totalStaff}
                valueStyle={{ fontWeight: 800, color: "#1f2937" }}
              />
              <div className="mt-2 text-xs text-gray-400">
                {t.ActiveDoctors}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {/* FIX: Mengganti bodyStyle dengan styles.body */}
            <Card className={CARD_STYLE} styles={{ body: { padding: "20px" } }}>
              <div className={`${ICON_BOX_STYLE} bg-orange-50 text-orange-600`}>
                <NumberOutlined />
              </div>
              <Statistic
                title={
                  <span className="text-gray-500 font-medium">
                    {t.TodayQueues}
                  </span>
                }
                value={mockStats.todayQueues}
                valueStyle={{ fontWeight: 800, color: "#1f2937" }}
              />
              <div className="mt-2 text-xs text-green-500 flex items-center gap-1 font-bold">
                <ArrowUpOutlined /> {t.BusySmooth}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {/* FIX: Mengganti bodyStyle dengan styles.body */}
            <Card className={CARD_STYLE} styles={{ body: { padding: "20px" } }}>
              <div className={`${ICON_BOX_STYLE} bg-purple-50 text-purple-600`}>
                <DatabaseOutlined />
              </div>
              <Statistic
                title={
                  <span className="text-gray-500 font-medium">
                    {t.ActiveServices}
                  </span>
                }
                value={mockStats.activeServices}
                valueStyle={{ fontWeight: 800, color: "#1f2937" }}
              />
              <div className="mt-2 w-full">
                <Progress
                  percent={100}
                  showInfo={false}
                  strokeColor="#7e22ce"
                  size="small"
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* --- MAIN CONTENT ROW --- */}
        <Row gutter={[24, 24]}>
          <Col xs={24} className="space-y-6">
            {/* 1. STATUS LAYANAN */}
            <Card
              title={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
                  <span className="font-bold text-lg text-gray-800">
                    {t.ServiceStatusAndQueue}
                  </span>
                  <Input
                    placeholder={t.SearchServiceOrStaff}
                    prefix={<SearchOutlined className="text-gray-400" />}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full md:w-64 rounded-lg"
                    allowClear
                  />
                </div>
              }
              className={CARD_STYLE}
            >
              <Table
                dataSource={filteredServiceStatus}
                pagination={{
                  pageSize: 5,
                  position: ["bottomRight"],
                  showSizeChanger: false,
                }}
                rowClassName="hover:bg-gray-50 transition-colors"
                scroll={{ x: 600 }}
                columns={[
                  {
                    title: t.ServiceName,
                    dataIndex: "name",
                    key: "name",
                    render: (text) => (
                      <Text strong className="text-gray-700">
                        {text}
                      </Text>
                    ),
                  },
                  {
                    title: t.Status,
                    dataIndex: "status",
                    key: "status",
                    render: (status) => {
                      let label = status;
                      if (status === "Buka") label = t.Open;
                      else if (status === "Istirahat") label = t.Break;
                      else if (status === "Tutup") label = t.Closed;
                      return (
                        <Tag
                          color={
                            status === "Buka"
                              ? "green"
                              : status === "Istirahat"
                              ? "orange"
                              : "red"
                          }
                          className="border-none font-bold rounded-md px-2"
                        >
                          {label.toUpperCase()}
                        </Tag>
                      );
                    },
                  },
                  {
                    title: t.Staff,
                    dataIndex: "staff",
                    key: "staff",
                    render: (text) => (
                      <div className="flex items-center gap-2">
                        <Avatar
                          size="small"
                          style={{ backgroundColor: "#0d9488" }}
                          icon={<UserOutlined />}
                        />{" "}
                        {text}
                      </div>
                    ),
                  },
                  {
                    title: t.Queue,
                    dataIndex: "queues",
                    key: "queues",
                    render: (count) => (
                      <Tag color="blue" className="rounded-full px-3">
                        {count} {t.People}
                      </Tag>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
