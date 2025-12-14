"use client";

import React, { memo, useEffect, useState } from "react";
import { useLanguage } from "@/app/languange-context";
import {
  Spin,
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  Avatar,
  Badge,
} from "antd";
import {
  ClockCircleOutlined,
  SmileOutlined,
  RightOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import UserService from "@/services/UserService";
import { User } from "@/types/User";
import ServiceService from "@/services/ServiceService";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

// --- CONFIG CARD HEIGHT RESPONSIVE ---
const CARD_HEIGHT_CLASS =
  "h-auto lg:h-[360px] shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border-none overflow-hidden flex flex-col";
const RealtimeClock = memo(() => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date()
          .toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, 
          })
          .replace(/\./g, ":") 
      );

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 mt-1">
      <Text className="text-gray-500 font-mono font-bold">{time}</Text>
    </div>
  );
});
RealtimeClock.displayName = "RealtimeClock";

export default function CustomerDashboard() {
  const { translations, loading: langLoading } = useLanguage();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  const { data: loggedInUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["profile-me"],
    queryFn: () => UserService.getMe(token),
    enabled: !!token,
  });

  // --- FETCH ACTIVE QUEUE ---
  const { data: activeQueue, isLoading: queueLoading } = useQuery({
    queryKey: ["active-queue", loggedInUser?.id],
    queryFn: async () => {
      if (!loggedInUser) return null;
      const res = await ServiceService.getActiveQueue(loggedInUser.id);
      return res.data;
    },
    enabled: !!loggedInUser,
  });

  // --- FETCH AVAILABLE SERVICES ---
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await ServiceService.getAllService({ page: 1, pageSize: 50 });
      return res.data;
    },
  });

  if (langLoading || userLoading || !translations) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10 font-sans pb-20">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 border-b">
          <div>
            <Title
              level={3}
              className="text-gray-800 m-0 font-bold text-xl md:text-2xl"
            >
              Dashboard Pasien
            </Title>
            <Text className="text-gray-500 text-sm md:text-base">
              Selamat datang kembali, {loggedInUser?.name || "Pasien"}
            </Text>
          </div>
          <div className="flex justify-between items-center px-6 py-4">
            <RealtimeClock />
          </div>
        </div>

        {/* Top Row */}
        <Row gutter={[16, 16]}>
          {/* Active Queue */}
          <Col xs={24} lg={16}>
            <div className="flex justify-between items-center mb-3">
              <Text
                strong
                className="text-gray-500 text-xs tracking-wider uppercase"
              >
                ANTRIAN AKTIF KAMU
              </Text>
            </div>
            <Card
              className={CARD_HEIGHT_CLASS}
              styles={{
                body: { padding: 0, flex: 1, display: "flex", flexDirection: "column" },
              }}
            >
              {queueLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Spin size="large" />
                </div>
              ) : activeQueue?.data? (
                <div className="flex flex-col md:flex-row h-full">
                  {/* Left: Nomor Antrian */}
                  <div className="bg-blue-600 p-6 md:p-8 text-white flex flex-col justify-between md:w-5/12 relative overflow-hidden group min-h-[200px]">
                    <div className="relative z-10">
                      <Text className="text-blue-100 text-xs md:text-sm font-medium opacity-90">
                        Nomor Antrian
                      </Text>
                      <h1 className="text-6xl md:text-7xl font-black m-0 text-white tracking-tighter mt-1">
                        {activeQueue.data.your_queue.queue_code}
                      </h1>
                    </div>
                    <div className="mt-auto relative z-10 pt-4">
                      <Tag className="bg-white/20 text-white border-none px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm uppercase">
                        {activeQueue.data.your_queue.status === "waiting"
                          ? "MENUNGGU PROSES"
                          : "SEDANG PROSES"}
                      </Tag>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center bg-white relative">
                    <div className="mb-6">
                      <Text
                        type="secondary"
                        className="uppercase text-[10px] font-bold tracking-widest text-gray-400"
                      >
                        Layanan
                      </Text>
                      <Title
                        level={2}
                        className="m-0 text-gray-800 font-bold text-xl md:text-3xl"
                      >
                        {activeQueue.data.service_name}
                      </Title>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-gray-100 pt-6">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                          Estimasi
                        </span>
                        <div className="flex items-center gap-2">
                          <ClockCircleOutlined className="text-blue-500 text-lg" />
                          <span className="text-lg md:text-xl font-bold text-gray-700">
                            {activeQueue.data.estimated_waiting_time}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                          Sedang Dilayani
                        </span>
                        <div className="flex items-center gap-2">
                          <NotificationOutlined className="text-green-500 text-lg" />
                          <span className="text-lg md:text-xl font-bold text-gray-700">
                            {activeQueue.data.current_serving}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[250px] lg:h-full bg-white text-center p-8 space-y-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <SmileOutlined className="text-3xl md:text-4xl text-gray-300" />
                  </div>
                  <div>
                    <Title
                      level={4}
                      className="text-gray-400 m-0 text-base md:text-lg"
                    >
                      Tidak ada antrian aktif
                    </Title>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* Pilih Layanan */}
          <Col xs={24} lg={8}>
            <div className="flex justify-between items-center mb-3">
              <Text
                strong
                className="text-gray-500 text-xs tracking-wider uppercase"
              >
                DAFTAR LAYANAN
              </Text>
            </div>
            <Card
              className={CARD_HEIGHT_CLASS}
              styles={{ body: { padding: 20, height: "100%", display: "flex", flexDirection: "column" } }}
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-[200px]">
                {services?.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer mb-3 last:mb-0"
                  >
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl shadow-sm bg-blue-50 text-blue-600 flex-shrink-0`}
                    >
                      <UserOutlined />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 m-0 truncate text-sm md:text-base group-hover:text-blue-700">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Bottom Row: Riwayat & Profil */}
        <Row gutter={[16, 16]}>
          {/* Informasi Banner */}
          <Col xs={24} lg={16}>
            <Text
              strong
              className="text-gray-500 text-xs tracking-wider uppercase mb-3 block"
            >
              INFORMASI
            </Text>
            <Card
              className={CARD_HEIGHT_CLASS}
              styles={{ body: { padding: 0, height: "100%" } }}
            >
              <div className="h-[250px] lg:h-full relative group cursor-pointer">
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
                  <h3 className="text-lg md:text-xl font-bold leading-tight mb-2 group-hover:text-blue-200 transition-colors">
                    Jaga Kesehatan di Musim Hujan
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300 line-clamp-2 leading-relaxed">
                    Tips menjaga imun tubuh agar tetap fit selama musim pancaroba.
                  </p>
                </div>
              </div>
            </Card>
          </Col>
          {/* Profil */}
          <Col xs={24} md={8}>
            <Text
              strong
              className="text-gray-500 text-xs tracking-wider uppercase mb-3 block"
            >
              PROFILE SAYA
            </Text>
            <Card
              className={CARD_HEIGHT_CLASS}
              styles={{ body: { padding: 24, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" } }}
            >
              <div>
                <div className="flex items-center gap-4 md:gap-5 mb-6">
                  <div className="relative flex-shrink-0">
                    <Avatar
                      size={64}
                      icon={<UserOutlined />}
                      className="bg-gray-100 text-gray-400"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="overflow-hidden">
                    <h3
                      className="text-lg font-bold text-gray-800 m-0 truncate w-full"
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
                      className="text-sm font-bold text-gray-800 truncate max-w-[120px] md:max-w-[150px]"
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
