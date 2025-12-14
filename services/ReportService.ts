import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ServiceReport {
  id: number;
  report_date: string;
  created_by: number;
  file_path: string;
  created_at: string;
  updated_at: string;
}

const ReportService = {

  /**
   * Generate report PDF untuk tanggal tertentu
   * @param reportDate Format 'YYYY-MM-DD'
   * @param userId ID user yang membuat report
   */
  generateServiceReport: async (reportDate: string, userId: number): Promise<{ report: ServiceReport, file_url: string }> => {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${BASE_URL}/admin/service/generate-report`, {
      report_date: reportDate,
      user_id: userId,
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return response.data;
  },

  /**
   * Ambil daftar report yang sudah dibuat
   */
  getAllReports: async (): Promise<ServiceReport[]> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<{ data: ServiceReport[] }>(
      `${BASE_URL}/service/reports`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );

    return response.data.data;
  },

  /**
   * Ambil detail report berdasarkan ID
   */
  getReportById: async (id: number): Promise<ServiceReport> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<ServiceReport>(`${BASE_URL}/service/report/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return response.data;
  },
};

export default ReportService;
