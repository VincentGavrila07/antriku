import axios from "axios";
import { Berita } from "@/types/Berita";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const BeritaService = {

  // 🔹 tanpa pagination (buat carousel / public)
  getAllBerita: async (): Promise<{ data: Berita[] }> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<{ data: Berita[] }>(
      `${BASE_URL}/admin/get-all-berita`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  },

  // 🔹 pagination (buat admin table)
  getAllBeritaPagination: async (params: {
    page: number;
    pageSize: number;
  }) => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}/admin/get-all-berita`,
      {
        params: {
          page: params.page,
          per_page: params.pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  deleteBerita: async (id: string, token: string) => {
    const response = await axios.delete(
      `${BASE_URL}/admin/delete-berita/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

    createBerita: async (
    beritaData: {
        judul: string;
        deskripsi: string;
        foto?: File | null;
        published_at?: string | null;
    },
    token: string
    ) => {
    const formData = new FormData();
    formData.append("judul", beritaData.judul);
    formData.append("deskripsi", beritaData.deskripsi);

    if (beritaData.foto) {
        formData.append("foto", beritaData.foto);
    }

    if (beritaData.published_at) {
        formData.append("published_at", beritaData.published_at);
    }

    const response = await axios.post(
        `${BASE_URL}/admin/store-berita`,
        formData,
        {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        }
    );

    return response.data;
    },

    updateBerita: async (id: string, data: FormData, token: string) => {
    data.append("_method", "PUT"); 

    const response = await axios.post(
        `${BASE_URL}/admin/update-berita/${id}`,
        data,
        {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        }
    );

    return response.data;
    },

    getDetailBerita: async (id: string) => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${BASE_URL}/admin/berita/${id}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    return response.data;
    },

};

export default BeritaService;
