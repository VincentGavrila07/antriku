import { LoginResponse } from "@/types/User";
import { RegisterPayload } from "@/types/User";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const UserService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Token tidak valid");
    }

    return res.json();
  },

  register: async (data: RegisterPayload) => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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


  
};

export default UserService;
