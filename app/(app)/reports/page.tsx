"use client";

import React, { useState } from "react";
import { Button, DatePicker, notification, Spin, Typography, Card } from "antd";
import { Moment } from "moment";
import ReportService from "@/services/ReportService";
import { useLanguage } from "@/app/languange-context";

const { Title, Text } = Typography;

export default function ReportsPage() {
  const [reportDate, setReportDate] = useState<Moment | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { translations } = useLanguage();
  const t = translations?.report;
  const handleGenerateReport = async () => {
    if (!reportDate) {
      notification.warning({
        title: "Peringatan",
        description: "Tanggal harus dipilih terlebih dahulu!",
      });
      return;
    }

    setLoading(true);
    setFileUrl(null);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await ReportService.generateServiceReport(
        reportDate.format("YYYY-MM-DD"),
        user?.id
      );

      notification.success({
        title: "Berhasil",
        description: "Report berhasil dibuat. Sedang membuka file...",
      });

      const url = response.file_url;
      setFileUrl(url);

      if (url) {
        window.open(url, "_blank");
      }
    } catch (error: unknown) {
      console.error(error);
      notification.error({
        title: "Gagal",
        description: "Gagal generate report. Pastikan server berjalan.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="shadow-xl rounded-2xl p-6 bg-white border-none">
        <Title level={3} className="text-center mb-6 text-gray-800">
          {t?.GenerateServiceReport}
        </Title>

        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <DatePicker
              value={reportDate}
              onChange={(date) => setReportDate(date)}
              format="YYYY-MM-DD"
              className="flex-1 w-full"
              size="large"
              placeholder="Pilih Tanggal Laporan"
            />
            <Button
              type="primary"
              onClick={handleGenerateReport}
              disabled={loading}
              size="large"
              className="flex-none w-full md:w-auto bg-blue-600 hover:bg-blue-500"
            >
              {loading ? <Spin size="small" /> : t?.GenerateReport}
            </Button>
          </div>

          {fileUrl && (
            <div className="flex justify-center animate-fade-in">
              <Button
                type="dashed"
                onClick={handleDownload}
                size="large"
                className="w-full md:w-1/2 border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-400"
              >
                {t?.OpenManually}
              </Button>
            </div>
          )}

          {!fileUrl && !loading && (
            <Text type="secondary" className="text-center text-sm">
              {t?.Keterangan}
            </Text>
          )}
        </div>
      </Card>
    </div>
  );
}
