
export interface Berita {
  id: number;
  judul: string;
  deskripsi: string;
  foto: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BeritaResponsePagination<T> {
    current_page: number;
    data: T;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: LinksPagination[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface LinksPagination {
    url: string | null;
    label: string;
    active: boolean;
}