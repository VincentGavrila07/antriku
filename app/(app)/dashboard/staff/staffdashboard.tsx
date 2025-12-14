/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, memo } from "react";
import {
  Spin,
  Card,
  Typography,
  Tag,
  Button,
  List,
  Avatar,
  message,
  Empty,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  CalendarOutlined, 
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UserService from "@/services/UserService";
import ServiceService from "@/services/ServiceService";
import { MyService, User } from "@/types/User";
import { CurrentSession, QueueByServiceResponse } from "@/types/Service";
import HistoryQueueList from "@/app/components/historyQueueList";
const { Title, Text } = Typography;

type ExtendedCurrentSession = CurrentSession & {
  checkInTime?: string;
  initialComplaint?: string;
};


type TotalServeResponse = {
  message: string;
  date: string;
  service: string;
  total_completed_services: number;
};

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

interface StaffDashboardProps {
  user: User;
}

export default function StaffDashboard({ user }: StaffDashboardProps) {
  const queryClient = useQueryClient();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  const { data: staffUser, isLoading: staffLoading } = useQuery<User>({
    queryKey: ["profile-me"],
    queryFn: () => UserService.getMe(token),
    enabled: !!token,
  });

  const [activeService, setActiveService] = useState<MyService | null>(null);
  const todayDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const stored = localStorage.getItem("myServices");
    if (!stored) return;

    const services: MyService[] = JSON.parse(stored);
    if (services.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveService(services[0]);
    }
  }, []);

  const { data: totalServeResponse, isLoading: totalServeLoading } =
    useQuery<TotalServeResponse>({
      queryKey: ["total-serve-today", activeService?.id],
      queryFn: () =>
        ServiceService.getTotalServe({
          service_id: activeService?.id,
          queue_date: todayDate,
        }),
      enabled: !!activeService,
      refetchInterval: 15000,
    });

  const { data: queueResponse, isLoading: queueLoading } =
    useQuery<QueueByServiceResponse>({
      queryKey: ["queues-by-service", activeService?.id],
      queryFn: () =>
        ServiceService.getAllQueueByService({
          service_id: activeService!.id,
          queue_date: todayDate,
        }),
      enabled: !!activeService,
      refetchInterval: 5000,
    });

  const [currentSession, setCurrentSession] =
    useState<ExtendedCurrentSession | null>(null);
  const [queueList, setQueueList] = useState<CurrentSession[]>([]);

  useEffect(() => {
    if (!queueResponse) return;

    // Menemukan antrian yang sedang diproses
    const processing = queueResponse.data.find(
      (q) => q.status === "processing"
    );

    if (processing) {
      setCurrentSession({
        queueId: processing.id,
        queueNumber: `${queueResponse.service.code}-${processing.queue_number}`,
        patientName: processing.user?.name ?? "Pasien",
        serviceType: queueResponse.service.name,
        checkInTime: processing.created_at,
        initialComplaint: processing.initial_complaint as string | undefined,
      });
    } else {
      setCurrentSession(null);
    }

    // List antrian menunggu
    const waiting = queueResponse.data
      .filter((q) => q.status === "waiting")
      .map((q) => ({
        queueId: q.id,
        queueNumber: `${queueResponse.service.code}-${q.queue_number}`,
        patientName: q.user?.name ?? "Pasien",
        serviceType: queueResponse.service.name,
        estimatedTime: "ESTIMASI",
      }));

    setQueueList(waiting);
  }, [queueResponse]);

  if (staffLoading || queueLoading || totalServeLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Logika Finish Queue (Completed)
  const handleFinishQueue = async () => {
    if (!currentSession) return;

    try {
      await ServiceService.updateQueueStatus({
        queue_id: currentSession.queueId,
        status: "completed",
      });

      message.success("Antrian berhasil diselesaikan");

      // Invalidate kedua queries
      queryClient.invalidateQueries({
        queryKey: ["queues-by-service", activeService?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["total-serve-today", activeService?.id], // Invalidate total serve
      });
    } catch {
      message.error("Gagal menyelesaikan antrian");
    }
  };

  // Logika Start Queue (Processing)
  const handleStartQueue = async () => {
    if (currentSession || queueList.length === 0) return;

    try {
      await ServiceService.updateQueueStatus({
        queue_id: queueList[0].queueId,
        status: "processing",
      });

      message.success("Antrian dimulai");

      queryClient.invalidateQueries({
        queryKey: ["queues-by-service", activeService?.id],
      });
    } catch {
      message.error("Gagal memulai antrian");
    }
  };

  const currentQueue = currentSession;
  const nextQueue = queueList.length > 0 ? queueList[0] : null;
  const remainingQueues = queueList.slice(1);

  return (
    <div className="min-h-screen bg-white p-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <Title level={3} className="m-0 font-bold">
            {staffUser?.name ?? "Staff"}
          </Title>
          <RealtimeClock />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Main Content (Left/Center Column) */}
          <div className="md:col-span-2 p-6 space-y-6">
            <Text strong className="text-sm uppercase text-gray-500">
              SESI SAAT INI
            </Text>

            {/* Current Queue Card */}
            {currentQueue ? (
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 text-white w-16 h-16 flex items-center justify-center rounded-lg font-bold text-2xl">
                    {currentQueue.queueNumber.split("-").pop()}
                  </div>
                  <div className="grow">
                    <Title level={4} className="m-0">
                      {currentQueue.patientName}
                    </Title>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Text strong className="text-gray-600">
                        {currentQueue.serviceType}
                      </Text>
                      {currentQueue.checkInTime && (
                        <Text className="text-xs">
                          Check-in:{" "}
                          {new Date(
                            currentQueue.checkInTime
                          ).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed">
                  <Text strong className="block mb-1">
                    KELUHAN / CATATAN AWAL:
                  </Text>
                  <Text className="italic text-gray-600">
                    {currentQueue.initialComplaint ?? "Tidak ada catatan awal"}
                  </Text>
                </div>

                <Button
                  type="primary"
                  size="large"
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
                  icon={<CheckCircleOutlined />}
                  onClick={handleFinishQueue}
                  disabled={!currentSession}
                >
                  Selesai Pengerjaan
                </Button>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm text-center">
                <Empty description="Tidak ada pasien sedang dilayani" />
                <Button
                  type="primary"
                  size="large"
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
                  icon={<PlayCircleOutlined />}
                  onClick={handleStartQueue}
                  disabled={queueList.length === 0}
                >
                  {queueList.length > 0
                    ? `Mulai Pengerjaan: ${queueList[0].patientName}`
                    : "Tidak Ada Antrian"}
                </Button>
              </div>
            )}

            {/* Next Queue and Remaining Queue List */}
            <div className="pt-4 space-y-4">
              <Text strong className="text-sm uppercase text-gray-500 block">
                ANTRIAN SAYA ({queueList.length})
              </Text>

              {/* Next Queue - Separate Styling */}
              {nextQueue && (
                <Card
                  title="SELANJUTNYA"
                  size="small"
                  className="shadow-sm border-2 border-orange-200"
                >
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <Text strong>{nextQueue.patientName}</Text>
                      <div className="text-sm text-gray-500">
                        {nextQueue.serviceType}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="bg-gray-100 p-6 md:h-screen md:sticky md:top-0">
            {/* Total Serving Card (menggantikan Total Pasien Card) */}
            <div className="bg-teal-500 text-white rounded-lg p-8 mb-6 text-center shadow-md">
              <CalendarOutlined className="text-6xl opacity-75" />
              <div className="mt-4">
                <Text strong className="text-sm block text-white opacity-90">
                  TOTAL SERVING (HARI INI)
                </Text>
                <Text className="text-xs block text-white opacity-90 mb-2">
                  {totalServeResponse?.service || "Semua Layanan"}
                </Text>
                <Title level={1} className="m-0 text-white">
                  {totalServeResponse?.total_completed_services ?? 0}
                  {/* Angka / 6 dihapus karena total kapasitas harian tidak disediakan */}
                </Title>
              </div>
            </div>

            {/* Notes Section */}
            <Card
              title={
                <div className="flex justify-between items-center">
                  <Text strong>NOTES</Text>
                  <Text className="text-sm text-gray-500">2/5</Text>
                </div>
              }
              size="small"
              className="shadow-sm"
              extra={<PlusOutlined className="cursor-pointer" />}
            >
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border border-gray-200 flex items-center gap-2">
                  <ClockCircleOutlined className="text-blue-500" />
                  <Text className="text-sm">
                    Waktu Istirahat: 12:00 - 13:00
                  </Text>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200 flex items-center gap-2">
                  <ClockCircleOutlined className="text-blue-500" />
                  <Text className="text-sm">Rapat Bulanan: Jumat, 16:00</Text>
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Note baru..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>
            {activeService && (
              <HistoryQueueList
                serviceId={activeService.id}
                queueDate={todayDate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}