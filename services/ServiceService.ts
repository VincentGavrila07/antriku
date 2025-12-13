import { Service, ServiceResponsePagination } from "@/types/Service";
import { BookServicePayload, TrService } from "@/types/Service";
import axios from "axios";
import { UpdateServiceFormValues } from "@/types/Service";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ServiceService = {

  getAllService: async (
    params?: {
      filters?: { name?: string };
      page?: number;
      pageSize?: number;
    }
  ): Promise<ServiceResponsePagination<Service[]>> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<ServiceResponsePagination<Service[]>>(
      `${BASE_URL}/admin/get-all-services`,
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

  getAllServiceNonAdmin: async (
    params?: {
      filters?: { name?: string };
      page?: number;
      pageSize?: number;
    }
  ): Promise<ServiceResponsePagination<Service[]>> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<ServiceResponsePagination<Service[]>>(
      `${BASE_URL}get-all-services`,
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


  addService: async (serviceData: {
    name: string;
    description?: string;
    assigned_user_ids?: number[];
    is_active?: boolean;
    estimated_time?: string; 
  }): Promise<Service> => {
    const token = localStorage.getItem("token");

    const response = await axios.post<Service>(
      `${BASE_URL}/admin/store-service`,
      serviceData,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return response.data;
  },

  deleteService: async (id: string, token: string) => {
      const response = await axios.delete(`${BASE_URL}/admin/delete-services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    },

    updateService: async (id: string, payload: UpdateServiceFormValues) => {
        const token = localStorage.getItem("token") || "";
        const response = await axios.put(`${BASE_URL}/admin/update-services/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getServiceById: async (id: string) => {
        const token = localStorage.getItem("token") || "";
        const response = await axios.get(`${BASE_URL}/admin/services-detail/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

   bookService: async (
    payload: BookServicePayload
  ): Promise<{ message: string; data: TrService }> => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}/book-service`,
      payload,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return response.data;
  },

};

export default ServiceService;
