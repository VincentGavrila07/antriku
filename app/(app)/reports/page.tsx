"use client";

import React, { useState } from "react";
import { Button, DatePicker, notification, Spin, Typography, Card, Space } from "antd";
import moment, { Moment } from "moment";
import ReportService from "@/services/ReportService";

const { Title, Text } = Typography;

export default function ReportsPage() {
  const [reportDate, setReportDate] = useState<Moment | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!reportDate) {
      notification.warning({ title: "Tanggal harus dipilih" });
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

      notification.success({ title: "Report berhasil dibuat" });
      setFileUrl(response.file_url);
    } catch (error: unknown) {
      notification.error({ title: "Gagal generate report" });
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
      <Card className="shadow-xl rounded-2xl p-6 bg-white">
        <Title level={3} className="text-center mb-6">
            Generate Service Report
        </Title>

        <Space direction="vertical" size="large" className="w-full">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <DatePicker
              value={reportDate}
              onChange={(date) => setReportDate(date)}
              format="YYYY-MM-DD"
              className="flex-1"
              size="large"
            />
            <Button
              type="primary"
              onClick={handleGenerateReport}
              disabled={loading}
              size="large"
              className="flex-none"
            >
              {loading ? <Spin /> : "Generate Report"}
            </Button>
          </div>

          {fileUrl && (
            <div className="flex justify-center">
              <Button
                type="default"
                onClick={handleDownload}
                size="large"
                className="bg-gray-100 hover:bg-gray-200 shadow rounded-lg"
              >
                Download PDF
              </Button>
            </div>
          )}

          {reportDate && !fileUrl && !loading && (
            <Text type="secondary" className="text-center">
              Pilih tanggal dan klik Generate untuk membuat report
            </Text>
          )}
        </Space>
      </Card>
    </div>
  );
}
