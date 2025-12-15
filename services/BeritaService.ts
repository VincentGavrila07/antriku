import axios from "axios";
import { Berita } from "@/types/Berita";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const BeritaService = {

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

    deleteBerita: async (id: string, token: string) => {
        const response = await axios.delete(
            `${BASE_URL}/admin/delete-berita/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    },

    createBerita: async (
        beritaData: {
            judul: string;
            deskripsi: string;
            foto?: string | null;
            published_at?: string | null;
        },
        token: string
    ) => {
        const response = await axios.post(
            `${BASE_URL}/admin/store-berita`,
            beritaData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    },

    updateBerita: async (
        id: string,
        beritaData: {
            judul: string;
            deskripsi: string;
            foto?: string | null;
            published_at?: string | null;
        },
        token: string
    ) => {
        const response = await axios.put(
            `${BASE_URL}/admin/update-berita/${id}`,
            beritaData,
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
