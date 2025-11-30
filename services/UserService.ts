import { LoginResponse, User, RegisterPayload } from "@/types/User";
import { UserResponsePagination } from "@/types/User";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const UserService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login gagal");
    }

    return res.json();
  },

  getMe: async (token: string) => {
    const res = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Token tidak valid");

    return res.json();
  },

  register: async (data: RegisterPayload) => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Register gagal");
    }

    return res.json();
  },

  logout: async (token: string) => {
    const res = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Logout gagal");
    }

    return res.json();
  },

  getAllUsers: async (
    params: {
      filters?: { name?: string };
      page?: number;
      pageSize?: number;
    }
  ): Promise<UserResponsePagination<User[]>> => {
    // ambil token dari localStorage
    const token = localStorage.getItem("token");

    const response = await axios.get<UserResponsePagination<User[]>>(
      `${BASE_URL}/admin/get-all-user`,
      {
        params,
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
        withCredentials: !!token ? false : true,
      }
    );

    return response.data;
  },

  getUserById: async (id: string, token: string) => {
    const response = await axios.get<User>(`${BASE_URL}/admin/user-detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  deleteUser: async (id: string, token: string) => {
    const response = await axios.delete(`${BASE_URL}/admin/delete-user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  editUser: async (id: string, data: Partial<User>, token: string) => {
    const response = await axios.put<User>(`${BASE_URL}/admin/edit-user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  createUser: async (userData: {
    name: string;
    email: string;
    roleId: number;
  }, token: string) => {
    const response = await axios.post(`${BASE_URL}/admin/store-user`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

export default UserService;
