"use client";

import React, { useState, useEffect, memo } from "react";
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
  Switch,
  Input,
  message,
  Popconfirm,
  Empty,
  Modal,
  InputNumber,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  EditOutlined,
  RightOutlined,
  PlusOutlined,
  DeleteOutlined,
  PushpinOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import UserService from "@/services/UserService";
import { User } from "@/types/User";

const { Title, Text } = Typography;
const { TextArea } = Input;

const RealtimeClock = memo(() => {
  const [time, setTime] = useState("");
  useEffect(() => {
    // Set time immediately to avoid hydration mismatch or delay
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
const initialCurrentSession = {
  hasPatient: true,
  queueNumber: "G-009",
  patientName: "Budi Santoso",
  serviceType: "Pembersihan Karang Gigi",
  notes: "Pasien mengeluh ngilu di gigi geraham bawah.",
  startTime: "13:00",
  status: "in_progress",
  estimatedDuration: 15,
};

const initialQueueList = [
  {
    id: 1,
    number: "G-010",
    name: "Siti Aminah",
    service: "Cabut Gigi",
    time: "13:30",
    notes: "Alergi antibiotik",
  },
  {
    id: 2,
    number: "G-011",
    name: "Rudi Hartono",
    service: "Kontrol Behel",
    time: "14:00",
    notes: "Kontrol rutin",
  },
  {
    id: 3,
    number: "G-012",
    name: "Dewi Persik",
    service: "Konsultasi",
    time: "14:30",
    notes: "Sakit gigi geraham",
  },
  {
    id: 4,
    number: "G-013",
    name: "Joko Anwar",
    service: "Tambal Gigi",
    time: "15:00",
    notes: "Gigi berlubang",
  },
  {
    id: 5,
    number: "G-014",
    name: "Reza Rahadian",
    service: "Pembersihan",
    time: "15:30",
    notes: "Pembersihan rutin",
  },
];

interface Note {
  id: number;
  text: string;
  isSystem?: boolean;
}

export default function StaffDashboard() {
  const { translations, loading: langLoading } = useLanguage();

  const [currentSession, setCurrentSession] = useState<any>(
    initialCurrentSession
  );
  const [queueList, setQueueList] = useState(initialQueueList);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Modal & Input
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const [startEstimation, setStartEstimation] = useState<number | null>(15);

  // Notes
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, text: "Waktu Istirahat: 12:00 - 13:00", isSystem: true },
    { id: 2, text: "Rapat Bulanan: Jumat, 16:00", isSystem: true },
  ]);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [patientNote, setPatientNote] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const { data: staffUser, isLoading: staffLoading } = useQuery<User>({
    queryKey: ["profile-me"],
    queryFn: () => UserService.getMe(token),
    enabled: !!token,
  });

  // --- LOGIC HELPER ---
  const addMinutesToCurrentTime = (minutesToAdd: number): Date => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutesToAdd);
    return date;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const updateQueueTimes = (duration: number) => {
    let nextStartTime = addMinutesToCurrentTime(duration);
    const updatedQueue = queueList.map((patient) => {
      const timeString = formatTime(nextStartTime);
      const standardDuration = 15;
      const nextPatientTime = new Date(nextStartTime);
      nextPatientTime.setMinutes(
        nextPatientTime.getMinutes() + standardDuration
      );
      nextStartTime = nextPatientTime;
      return { ...patient, time: timeString };
    });
    setQueueList(updatedQueue);
  };

  const handleStartClick = () => {
    setStartEstimation(15);
    setIsStartModalVisible(true);
  };

  const handleConfirmStart = () => {
    if (!startEstimation) return;
    const nowString = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setCurrentSession((prev: any) => ({
      ...prev,
      status: "in_progress",
      estimatedDuration: startEstimation,
      startTime: nowString,
    }));

    updateQueueTimes(startEstimation);
    setIsSessionActive(true);
    setIsStartModalVisible(false);
    message.success(`Sesi dimulai.`);
  };

  const handleFinishSession = () => {
    if (queueList.length > 0) {
      const nextPatient = queueList[0];
      const remainingQueue = queueList.slice(1);
      setCurrentSession({
        hasPatient: true,
        queueNumber: nextPatient.number,
        patientName: nextPatient.name,
        serviceType: nextPatient.service,
        notes: nextPatient.notes || "Tidak ada catatan awal.",
        startTime: "-",
        status: "waiting",
        estimatedDuration: 0,
      });
      setQueueList(remainingQueue);
      setIsSessionActive(false);
      message.success(`Sesi selesai.`);
    } else {
      setCurrentSession({ hasPatient: false });
      setIsSessionActive(false);
      message.success("Semua antrian selesai!");
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    if (notes.length >= 5) {
      message.warning("Maksimal 5 notes!");
      return;
    }
    setNotes([...notes, { id: Date.now(), text: newNote, isSystem: false }]);
    setNewNote("");
  };
  const handleDeleteNote = (id: number) =>
    setNotes(notes.filter((n) => n.id !== id));
  const handleSavePatientNote = () => {
    message.success("Catatan disimpan");
    setIsNoteModalVisible(false);
    setPatientNote("");
  };

  if (langLoading || !translations)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );

  const MAIN_CARD_CLASS =
    "h-auto lg:h-[420px] shadow-sm rounded-2xl border-none overflow-hidden flex flex-col";
  const LIST_CARD_CLASS =
    "h-auto lg:h-[320px] shadow-sm rounded-2xl border-none overflow-hidden flex flex-col";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10 font-sans pb-20">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar
              size={{ xs: 48, sm: 64 }}
              icon={<UserOutlined />}
              className="bg-teal-600 flex-shrink-0"
            />
            <div>
              <Title
                level={3}
                className="text-gray-800 m-0 font-bold text-lg md:text-2xl"
              >
                {staffUser?.name || "Staff"}
              </Title>
              {/* KOMPONEN JAM TERPISAH */}
              <RealtimeClock />
            </div>
          </div>
          <div className="w-full md:w-auto bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <div className="text-left md:text-right">
              <Text
                type="secondary"
                className="block text-[10px] uppercase font-bold"
              >
                Status Saya
              </Text>
              <Text strong className="text-green-600 text-sm">
                SIAP MELAYANI
              </Text>
            </div>
            <Switch defaultChecked className="bg-green-500" />
          </div>
        </div>

        {/* --- ROW 1 --- */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                  Sesi Saat Ini
                </span>
              }
              className={MAIN_CARD_CLASS}
              headStyle={{
                borderBottom: "1px solid #f0f0f0",
                minHeight: "46px",
              }}
              bodyStyle={{
                padding: "16px md:24px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {currentSession.hasPatient ? (
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-4 sm:block">
                      <div className="bg-teal-50 text-teal-700 w-16 h-16 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center border border-teal-100 flex-shrink-0">
                        <span className="text-[9px] sm:text-xs font-bold uppercase">
                          Antrian
                        </span>
                        <span className="text-xl sm:text-3xl font-black">
                          {currentSession.queueNumber}
                        </span>
                      </div>
                      <div className="block sm:hidden">
                        {isSessionActive ? (
                          <Tag
                            color="processing"
                            className="border-none font-bold"
                          >
                            BERJALAN
                          </Tag>
                        ) : (
                          <Tag color="orange" className="border-none font-bold">
                            MENUNGGU
                          </Tag>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 m-0 truncate leading-tight">
                          {currentSession.patientName}
                        </h2>
                        {isSessionActive && (
                          <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                            <FieldTimeOutlined className="text-gray-400" />
                            <Text strong className="text-sm">
                              {currentSession.estimatedDuration} Menit
                            </Text>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Tag color="blue" className="border-none m-0 text-xs">
                          {currentSession.serviceType}
                        </Tag>
                        <Text
                          type="secondary"
                          className="flex items-center gap-1 text-xs"
                        >
                          <ClockCircleOutlined /> Check-in:{" "}
                          {currentSession.startTime}
                        </Text>
                      </div>

                      {/* --- PERBAIKAN DI SINI --- */}
                      <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <Text
                          strong
                          className="text-gray-500 text-[10px] uppercase block mb-1"
                        >
                          Keluhan / Catatan Awal:
                        </Text>
                        <Text className="text-gray-700 italic text-sm sm:line-clamp-2">
                          "{currentSession.notes}"
                        </Text>
                      </div>
                      {/* ------------------------- */}
                    </div>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 mt-auto pt-2">
                    {!isSessionActive ? (
                      <Button
                        type="primary"
                        size="large"
                        icon={<PlayCircleOutlined />}
                        // Animasi pulse DIHAPUS agar performa ringan
                        className="h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 border-none rounded-xl font-bold text-base w-full col-span-2 shadow-md shadow-blue-100"
                        onClick={handleStartClick}
                      >
                        Mulai Pengerjaan
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="large"
                          className="h-12 sm:h-14 border-gray-300 text-gray-600 rounded-xl font-bold text-sm w-full"
                          icon={<EditOutlined />}
                          onClick={() => setIsNoteModalVisible(true)}
                        >
                          Berikan Catatan
                        </Button>
                        <Popconfirm
                          title="Selesaikan sesi ini?"
                          description="Pasien berikutnya akan dipanggil otomatis."
                          onConfirm={handleFinishSession}
                          okText="Ya, Selesai"
                          cancelText="Batal"
                          okButtonProps={{ className: "bg-green-600" }}
                        >
                          <Button
                            type="primary"
                            size="large"
                            icon={<CheckCircleOutlined />}
                            className="h-12 sm:h-14 bg-green-600 hover:bg-green-700 border-none rounded-xl font-bold text-sm w-full shadow-md shadow-green-100"
                          >
                            Selesai
                          </Button>
                        </Popconfirm>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[250px] lg:h-full text-gray-400">
                  <MedicineBoxOutlined className="text-4xl sm:text-5xl mb-3 opacity-30" />
                  <Title level={5} type="secondary" className="text-center m-0">
                    Kosong
                  </Title>
                  <Text type="secondary" className="text-xs mb-3">
                    Tidak ada pasien aktif
                  </Text>
                  <Button
                    type="dashed"
                    size="small"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Data
                  </Button>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              className={MAIN_CARD_CLASS}
              bodyStyle={{
                padding: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="flex-1 p-6 bg-gradient-to-b from-teal-500 to-teal-600 text-white flex flex-col justify-center items-center text-center min-h-[180px]">
                <div className="mb-3 bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <UserOutlined className="text-3xl text-white" />
                </div>
                <Text className="text-teal-100 text-xs font-bold uppercase tracking-wider">
                  Total Pasien Anda
                </Text>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black">
                    {initialQueueList.length -
                      queueList.length +
                      (currentSession.hasPatient ? 1 : 0)}
                  </span>
                  <span className="text-lg opacity-80">
                    / {initialQueueList.length + 1}
                  </span>
                </div>
              </div>
              <div className="bg-white p-5 border-t border-gray-100 flex-shrink-0">
                <Text
                  strong
                  className="text-gray-400 text-xs uppercase block mb-2"
                >
                  Selanjutnya
                </Text>
                {queueList.length > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <h4 className="text-sm font-bold text-gray-800 truncate">
                        {queueList[0].name}
                      </h4>
                      <Text type="secondary" className="text-xs truncate block">
                        {queueList[0].service}
                      </Text>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Tag className="m-0 bg-gray-100 border-none font-bold text-gray-600">
                        {queueList[0].number}
                      </Tag>
                      <Text className="block text-[10px] text-gray-400 mt-1">
                        {queueList[0].time}
                      </Text>
                    </div>
                  </div>
                ) : (
                  <Text type="secondary" className="text-xs italic">
                    Tidak ada antrian lagi.
                  </Text>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* --- ROW 2 --- */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                    Antrian Saya ({queueList.length})
                  </span>
                  <Button type="link" size="small">
                    Jadwal
                  </Button>
                </div>
              }
              className={LIST_CARD_CLASS}
              headStyle={{
                borderBottom: "1px solid #f0f0f0",
                minHeight: "46px",
              }}
              bodyStyle={{
                padding: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                <List
                  dataSource={queueList}
                  renderItem={(item) => (
                    <div className="px-4 md:px-6 py-3 hover:bg-teal-50 transition-colors border-b border-gray-50 flex items-center justify-between group cursor-pointer last:border-none">
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-base font-bold text-gray-400 group-hover:text-teal-600 w-12">
                          {item.number}
                        </div>
                        <div className="min-w-0">
                          <Text
                            strong
                            className="text-gray-700 block text-sm truncate"
                          >
                            {item.name}
                          </Text>
                          <Text
                            type="secondary"
                            className="text-xs truncate block"
                          >
                            {item.service}
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right hidden sm:block">
                          <Text className="text-[10px] font-bold text-gray-400 block uppercase">
                            Estimasi
                          </Text>
                          <Text className="text-gray-600 font-medium text-xs">
                            {item.time}
                          </Text>
                        </div>
                        <Button
                          icon={<RightOutlined />}
                          size="small"
                          className="text-gray-300 border-none shadow-none bg-transparent group-hover:text-teal-600"
                        />
                      </div>
                    </div>
                  )}
                />
                <div className="h-2"></div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                    Notes
                  </span>
                  <span className="text-xs text-gray-400">
                    {notes.length}/5
                  </span>
                </div>
              }
              className={LIST_CARD_CLASS}
              headStyle={{
                borderBottom: "1px solid #f0f0f0",
                minHeight: "46px",
              }}
              bodyStyle={{
                padding: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-yellow-50/30 p-3 min-h-[200px]">
                {notes.length > 0 ? (
                  <List
                    dataSource={notes}
                    split={false}
                    renderItem={(item) => (
                      <div
                        className={`p-2.5 mb-2 rounded-lg border flex justify-between items-start group transition-all ${
                          item.isSystem
                            ? "bg-blue-50 border-blue-100"
                            : "bg-yellow-50 border-yellow-100"
                        }`}
                      >
                        <div className="flex items-start gap-2 max-w-[85%]">
                          {item.isSystem && (
                            <PushpinOutlined className="text-blue-400 mt-1 text-xs flex-shrink-0" />
                          )}
                          <Text
                            className={`text-xs sm:text-sm break-words ${
                              item.isSystem
                                ? "text-blue-700 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {item.text}
                          </Text>
                        </div>
                        {!item.isSystem && (
                          <Popconfirm
                            title="Hapus?"
                            onConfirm={() => handleDeleteNote(item.id)}
                            okText="Ya"
                            cancelText="Batal"
                          >
                            <Button
                              size="small"
                              type="text"
                              icon={<DeleteOutlined />}
                              className="text-gray-400 hover:text-red-500 -mt-1 -mr-2"
                            />
                          </Popconfirm>
                        )}
                      </div>
                    )}
                  />
                ) : (
                  <Empty
                    description={
                      <span className="text-xs text-gray-400">Kosong</span>
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </div>
              <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    size="middle"
                    placeholder="Note baru..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onPressEnter={handleAddNote}
                    maxLength={50}
                    disabled={notes.length >= 5}
                  />
                  <Button
                    size="middle"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || notes.length >= 5}
                  />
                </div>
                {notes.length >= 5 && (
                  <Text type="danger" className="text-[10px] mt-1 block">
                    Limit tercapai.
                  </Text>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* --- MODAL 2: MULAI & ESTIMASI (OPTIMIZED) --- */}
      <Modal
        title="Mulai Pengerjaan"
        open={isStartModalVisible}
        onOk={handleConfirmStart}
        onCancel={() => setIsStartModalVisible(false)}
        okText="Mulai"
        cancelText="Batal"
        centered
        width={360}
        destroyOnClose={true} // OPTIMASI MEMORI
        maskClosable={false}
      >
        <div className="pt-2 pb-0">
          <Text type="secondary" className="text-xs mb-3 block text-center">
            Estimasi durasi untuk <b>{currentSession.patientName}</b>?
          </Text>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {[10, 15, 30, 45].map((time) => (
              <Button
                key={time}
                type={startEstimation === time ? "primary" : "default"}
                onClick={() => setStartEstimation(time)}
                className="text-xs font-semibold"
              >
                {time}m
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <Text className="text-xs text-gray-500">Custom:</Text>
            <InputNumber
              min={1}
              max={240}
              value={startEstimation}
              onChange={(val) => setStartEstimation(val)}
              className="w-20 text-center font-bold"
              size="middle"
              controls={false} // OPTIMASI RENDER
            />
            <Text className="text-xs text-gray-500">Menit</Text>
          </div>

          <div className="mt-3 text-center">
            <Text type="secondary" className="text-[10px] italic">
              *Jadwal antrian berikutnya otomatis disesuaikan.
            </Text>
          </div>
        </div>
      </Modal>

      {/* --- MODAL 1: CATATAN PASIEN --- */}
      <Modal
        title="Catatan Pasien"
        open={isNoteModalVisible}
        onOk={handleSavePatientNote}
        onCancel={() => setIsNoteModalVisible(false)}
        okText="Simpan"
        cancelText="Batal"
        centered
        width={500}
        style={{ maxWidth: "95vw", margin: "0 auto" }}
      >
        <p className="mb-2 text-gray-500 text-sm">
          Resep, saran, atau catatan teknis.
        </p>
        <TextArea
          rows={5}
          placeholder="Tulis catatan di sini..."
          value={patientNote}
          onChange={(e) => setPatientNote(e.target.value)}
        />
      </Modal>
    </div>
  );
}
