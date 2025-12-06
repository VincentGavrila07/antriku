import axios from "axios";
import { Role, RoleResponsePagination } from "@/types/Role";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const RoleService = {

    getAllRole: async (): Promise<{ data: Role[] }> => 
    {
        const token = localStorage.getItem("token");

        const response = await axios.get<{ data: Role[] }>(`${BASE_URL}/admin/get-all-role`, {
            headers: { Authorization: `Bearer ${token}` },
        });


        return response.data;
    },
    getAllRolePagination: async (
        params?: {
        filters?: { name?: string };
        page?: number;
        pageSize?: number;
        }
    ): Promise<RoleResponsePagination<Role[]>> => {

        const token = localStorage.getItem("token");

        const response = await axios.get<RoleResponsePagination<Role[]>>(
        `${BASE_URL}/admin/get-all-role`,
        {
            params,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            withCredentials: token ? false : true,
        }
        );

        return response.data;
    },

    deleteRole: async (id: string, token: string) => {
        const response = await axios.delete(`${BASE_URL}/admin/delete-role/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        return response.data;
    },
};

export default RoleService;
