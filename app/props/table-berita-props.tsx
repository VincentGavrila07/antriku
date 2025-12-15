import { Berita } from "@/types/Berita";

export interface TableBeritaProps {
  data: Berita[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}
