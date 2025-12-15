import { Berita } from "@/types/Berita";

export interface TableBeritaProps {
  data: Berita[];
  total: number;
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onChange?: (page: number, pageSize?: number) => void;
  onDelete?: (id: string) => void;
}