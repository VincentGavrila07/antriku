"use client";

import React from "react";
import { useLanguage } from "@/app/languange-context";
import {
  Spin,
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  List,
  Avatar,
  Badge,
} from "antd";
import {
  ClockCircleOutlined,
  MedicineBoxOutlined,
  SmileOutlined,
  RightOutlined,
  HistoryOutlined,
  NotificationOutlined,
  UserOutlined,
  ExperimentOutlined,
  HeartOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import UserService from "@/services/UserService";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

// --- MOCK DATA ---
const mockActiveQueue = {
  hasQueue: true,
  serviceName: "Poli Gigi",
  queueNumber: "B-005",
  status: "waiting",
  estimatedTime: "15 Menit",
  currentServing: "B-003",
  location: "Lantai 2, Ruang 204",
};

const mockServices = [
  {
    id: 1,
    name: "Poli Umum",
    icon: <UserOutlined />,
    open: "08:00 - 20:00",
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: 2,
    name: "Poli Gigi",
    icon: <SmileOutlined />,
    open: "09:00 - 17:00",
    color: "text-teal-600 bg-teal-50",
  },
  {
    id: 3,
    name: "Poli Anak",
    icon: <HeartOutlined />,
    open: "08:00 - 14:00",
    color: "text-pink-600 bg-pink-50",
  },
  {
    id: 4,
    name: "Laboratorium",
    icon: <ExperimentOutlined />,
    open: "24 Jam",
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: 5,
    name: "Farmasi",
    icon: <MedicineBoxOutlined />,
    open: "08:00 - 22:00",
    color: "text-indigo-600 bg-indigo-50",
  },
];

const mockHistory = [
  {
    id: 1,
    title: "Poli Gigi",
    desc: "Selesai - drg. Sarah",
    date: "09 Des",
    type: "success",
  },
  {
    id: 2,
    title: "Poli Umum",
    desc: "Selesai - dr. Budi",
    date: "01 Des",
    type: "success",
  },
  {
    id: 3,
    title: "Lab Darah",
    desc: "Menunggu Hasil",
    date: "25 Nov",
    type: "warning",
  },
  {
    id: 4,
    title: "Poli Anak",
    desc: "Dibatalkan",
    date: "10 Nov",
    type: "danger",
  },
  {
    id: 5,
    title: "Farmasi",
    desc: "Obat Diambil",
    date: "05 Nov",
    type: "success",
  },
  {
    id: 6,
    title: "Poli Mata",
    desc: "Selesai",
    date: "01 Nov",
    type: "success",
  },
];

export default function CustomerDashboard() {
  const { translations, loading: langLoading } = useLanguage();
  const router = useRouter();

  // 1. DATA ASLI (Hanya untuk Profile)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const { data: loggedInUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["profile-me"],
    queryFn: () => UserService.getMe(token),
    enabled: !!token,
  });

  if (langLoading || userLoading || !translations) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // --- CONFIG TINGGI CARD (Agar semua simetris & pasif) ---
  const CARD_HEIGHT_CLASS = "h-[360px]";

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex justify-between items-end">
          <div>
            <Title level={3} className="text-gray-800 m-0 font-bold">
              Dashboard Pasien
            </Title>
            <Text className="text-gray-500 text-base">
              Selamat datang kembali, {loggedInUser?.name || "Pasien"}
            </Text>
          </div>
          <div className="text-right hidden md:block">
            <Text type="secondary" className="text-xs">
              Terakhir diupdate: Baru saja
            </Text>
          </div>
        </div>

        {/* --- TOP ROW --- */}
        <Row gutter={[32, 32]}>
          {/* 1. ACTIVE QUEUE */}
          <Col xs={24} lg={16}>
            <div className="flex justify-between items-center mb-3">
              <Text
                strong
                className="text-gray-500 text-xs tracking-wider uppercase"
              >
                ANTRIAN SAAT INI
              </Text>
            </div>
            <Card
              className={`shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border-none overflow-hidden ${CARD_HEIGHT_CLASS}`}
              bodyStyle={{ padding: 0, height: "100%" }}
            >
              {mockActiveQueue.hasQueue ? (
                <div className="flex flex-col md:flex-row h-full">
                  {/* Left Side: Number */}
                  <div className="bg-blue-600 p-8 text-white flex flex-col justify-between md:w-5/12 relative overflow-hidden group">
                    <div className="absolute -top-6 -right-6 opacity-10 text-[100px] group-hover:rotate-12 transition-transform duration-700">
                      <HistoryOutlined />
                    </div>
                    <div className="relative z-10">
                      <Text className="text-blue-100 text-sm font-medium opacity-90">
                        Nomor Antrian
                      </Text>
                      <h1 className="text-7xl font-black m-0 text-white tracking-tighter mt-1">
                        {mockActiveQueue.queueNumber}
                      </h1>
                    </div>
                    <div className="mt-auto relative z-10">
                      <Tag className="bg-white/20 text-white border-none px-4 py-1.5 text-xs font-bold rounded-full backdrop-blur-sm uppercase">
                        {mockActiveQueue.status === "waiting"
                          ? "MENUNGGU DIPANGGIL"
                          : "SEDANG DIPANGGIL"}
                      </Tag>
                    </div>
                  </div>

                  {/* Right Side: Details */}
                  <div className="p-8 md:w-7/12 flex flex-col justify-center bg-white relative">
                    <div className="mb-6">
                      <Text
                        type="secondary"
                        className="uppercase text-[10px] font-bold tracking-widest text-gray-400"
                      >
                        Layanan
                      </Text>
                      <Title level={2} className="m-0 text-gray-800 font-bold">
                        {mockActiveQueue.serviceName}
                      </Title>
                    </div>
                    <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                          Estimasi
                        </span>
                        <div className="flex items-center gap-2">
                          <ClockCircleOutlined className="text-blue-500 text-lg" />
                          <span className="text-xl font-bold text-gray-700">
                            {mockActiveQueue.estimatedTime}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                          Sedang Dilayani
                        </span>
                        <div className="flex items-center gap-2">
                          <NotificationOutlined className="text-green-500 text-lg" />
                          <span className="text-xl font-bold text-gray-700">
                            {mockActiveQueue.currentServing}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-white text-center p-8 space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <SmileOutlined className="text-4xl text-gray-300" />
                  </div>
                  <div>
                    <Title level={4} className="text-gray-400 m-0">
                      Tidak ada antrian aktif
                    </Title>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* 2. PILIH LAYANAN */}
          <Col xs={24} lg={8}>
            <div className="flex justify-between items-center mb-3">
              <Text
                strong
                className="text-gray-500 text-xs tracking-wider uppercase"
              >
                PILIH LAYANAN
              </Text>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>{" "}
                Buka
              </div>
            </div>
            <Card
              className={`shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border-none overflow-hidden ${CARD_HEIGHT_CLASS}`}
              bodyStyle={{
                padding: "20px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Gunakan overflow-y-auto di sini agar list bisa di-scroll tapi card tetap diam */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <List
                  itemLayout="horizontal"
                  dataSource={mockServices}
                  split={false}
                  renderItem={(item) => (
                    <div className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer mb-3 last:mb-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${item.color} flex-shrink-0`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 m-0 truncate group-hover:text-blue-700">
                          {item.name}
                        </h4>
                        <Text type="secondary" className="text-xs block mt-0.5">
                          {item.open}
                        </Text>
                      </div>
                      <RightOutlined className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                />
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 bg-white z-10">
                <Button
                  block
                  type="primary"
                  size="large"
                  href="#"
                  className="bg-blue-600 hover:bg-blue-700 border-none h-11 font-semibold shadow-lg shadow-blue-200 rounded-xl flex items-center justify-center gap-2"
                >
                  Lihat Semua Layanan <RightOutlined className="text-xs" />
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* --- BOTTOM ROW --- */}
        <Row gutter={[32, 32]}>
          {/* 3. INFORMATION BANNER */}
          <Col xs={24} md={8}>
            <Text
              strong
              className="text-gray-500 text-xs tracking-wider uppercase mb-3 block"
            >
              INFORMASI
            </Text>
            <Card
              className={`shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border-none overflow-hidden ${CARD_HEIGHT_CLASS}`}
              bodyStyle={{ padding: 0, height: "100%" }}
            >
              <div className="h-full relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10 opacity-90"></div>
                <img
                  src="https://img.freepik.com/free-photo/doctor-nurses-special-equipment_23-2148980721.jpg"
                  alt="Info Banner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 p-6 z-20 text-white w-full">
                  <Tag className="bg-blue-600 border-none text-white px-2 py-0.5 mb-3 text-[10px] font-bold rounded">
                    TERBARU
                  </Tag>
                  <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-blue-200 transition-colors">
                    Jaga Kesehatan di Musim Hujan
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                    Tips menjaga imun tubuh agar tetap fit selama musim
                    pancaroba.
                  </p>
                </div>
              </div>
            </Card>
          </Col>

          {/* 4. RIWAYAT TERAKHIR */}
          <Col xs={24} md={8}>
            <div className="flex justify-between items-center mb-3">
              <Text
                strong
                className="text-gray-500 text-xs tracking-wider uppercase"
              >
                RIWAYAT TERAKHIR
              </Text>
              <Badge
                count={mockHistory.length}
                style={{
                  backgroundColor: "#ef4444",
                  fontSize: "10px",
                  boxShadow: "none",
                }}
              />
            </div>
            <Card
              className={`shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border-none overflow-hidden ${CARD_HEIGHT_CLASS}`}
              bodyStyle={{
                padding: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Area Scrollable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <List
                  dataSource={mockHistory}
                  renderItem={(item) => (
                    <div className="px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex items-start gap-4 cursor-pointer group">
                      <div
                        className={`w-2 h-2 rounded-full mt-2.5 flex-shrink-0 ${
                          item.type === "success"
                            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                            : item.type === "warning"
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <Text
                          strong
                          className="text-gray-700 block text-sm group-hover:text-blue-600 transition-colors"
                        >
                          {item.title}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {item.desc}
                        </Text>
                      </div>
                      <div className="text-right">
                        <Text className="text-[10px] font-bold text-gray-400 block mb-1 bg-gray-100 px-2 py-0.5 rounded">
                          {item.date}
                        </Text>
                      </div>
                    </div>
                  )}
                />
              </div>
              {/* Footer Tetap */}
              <div className="p-3 text-center border-t border-gray-100 bg-white z-10 mt-auto">
                <Button
                  type="link"
                  size="small"
                  className="text-xs font-bold text-gray-500 hover:text-blue-600"
                >
                  Lihat Semua
                </Button>
              </div>
            </Card>
          </Col>

          {/* 5. PROFILE SAYA (DATA REAL) */}
          <Col xs={24} md={8}>
            <Text
              strong
              className="text-gray-500 text-xs tracking-wider uppercase mb-3 block"
            >
              PROFILE SAYA
            </Text>
            <Card
              className={`shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border-none overflow-hidden ${CARD_HEIGHT_CLASS}`}
              bodyStyle={{
                padding: "24px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <Avatar
                      size={64}
                      icon={<UserOutlined />}
                      className="bg-gray-100 text-gray-400"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold text-gray-800 m-0 truncate w-40"
                      title={loggedInUser?.name}
                    >
                      {loggedInUser?.name || "Pasien"}
                    </h3>
                    <Text
                      type="secondary"
                      className="text-xs font-medium block mb-1"
                    >
                      Pasien Regular
                    </Text>
                    <Tag
                      color="green"
                      className="border-none bg-green-50 text-green-600 font-bold text-[10px] rounded px-2"
                    >
                      TERVERIFIKASI
                    </Tag>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                    <span className="text-xs text-gray-500 font-bold group-hover:text-blue-600">
                      Email
                    </span>
                    <span
                      className="text-sm font-bold text-gray-800 truncate max-w-[150px]"
                      title={loggedInUser?.email}
                    >
                      {loggedInUser?.email || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                    <span className="text-xs text-gray-500 font-bold group-hover:text-blue-600">
                      No. Telepon
                    </span>
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                      +62 812...
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <Button
                  type="link"
                  className="text-xs font-bold text-gray-500 hover:text-blue-600 p-0"
                  onClick={() => {
                    if (loggedInUser?.id) {
                      router.push(`/profile`);
                    }
                  }}
                >
                  Lihat Detail Profile
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
