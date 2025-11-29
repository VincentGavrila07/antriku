export interface PermissionResponse {
  role: string;
  permissions: string[];
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
};

export default PermissionService;
