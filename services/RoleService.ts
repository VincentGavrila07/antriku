import axios from "axios";
import { Role } from "@/types/Role";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const RoleService = {

    getAllRole: async (): Promise<{ data: Role[] }> => 
    {
        const token = localStorage.getItem("token");

        const response = await axios.get<{ data: Role[] }>(`${BASE_URL}/admin/get-all-role`, {
            headers: { Authorization: `Bearer ${token}` },
        });


        return response.data;
    }

};

export default RoleService;
