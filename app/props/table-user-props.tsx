import { User } from "@/types/User";

export interface TableUserProps {
  data: User[];                  // Data array dari API
  total: number;                 // Total data untuk pagination
  page: number;                  // Halaman sekarang
  pageSize: number;              // Jumlah row per halaman
  isLoading?: boolean;           // Loading state
  onChange?: (page: number, pageSize?: number) => void; // Handler ganti page
}
