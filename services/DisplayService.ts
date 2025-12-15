import axios from "axios";
import { DisplayServiceType } from "@/types/Display";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const DisplayService = {
  getAllServices: async (): Promise<{ data: DisplayServiceType[] }> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<{ data: DisplayServiceType[] }>(
      `${BASE_URL}/admin/display-all-services`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
        withCredentials: token ? false : true,
      }
    );

    return response.data;
  },
};

export default DisplayService;
