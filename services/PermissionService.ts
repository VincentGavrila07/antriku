import { Permission } from "@/types/Permission";
import axios from "axios";

export interface PermissionResponse {
  role: string;
  permissions: string[];
}

export interface PermissionListResponse {
  data: Permission[];
  total: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const PermissionService = {
  getPermissions: async (token: string): Promise<PermissionResponse> => {
    const res = await fetch(`${BASE_URL}/me/permissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Gagal mengambil permission");
    }

    return res.json();
  },

  getAllPermission: async (): Promise<PermissionListResponse> => {
    const token = localStorage.getItem("token");
    const response = await axios.get<PermissionListResponse>(
      `${BASE_URL}/admin/get-all-permissions`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );

    return response.data;
  },

    getPermissionById: async (id: string) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/admin/permissions/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data.data; // ambil .data dari backend
  },

  getRolesByPermission: async (id: string) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/admin/permissions/${id}/roles`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data; // backend kirim array Role[]
  },

  updatePermissionRoles: async (id: string, roles: number[]) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${BASE_URL}/admin/permissions/${id}/roles`,
      { roles },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return response.data;
  },
};

export default PermissionService;
