  import { HistoryByServiceResponse, Service, ServiceResponsePagination, TrServiceResponsePagination } from "@/types/Service";
  import { BookServicePayload, TrService } from "@/types/Service";
  import axios from "axios";
  import { UpdateServiceFormValues } from "@/types/Service";
  import { QueueByServiceResponse } from "@/types/Service";
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

    getActiveQueue(userId: number) {
      return axios.get(`${BASE_URL}/queues/active/${userId}`);
    },

  getAllQueueByService: async (
    params: {
      service_id: number;
      queue_date?: string;
    }
  ): Promise<QueueByServiceResponse> => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}/queues/by-service`,
      {
        params,
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return {
      ...response.data,
      data: response.data.data.map((item: TrService) => ({
        ...item,
        status: item.status as "waiting" | "processing" | "completed",
      })),
    };
  },


  getMyService: async (
    userId: number
  ): Promise<{
    message: string;
    total: number;
    data: Service[];
  }> => {

    const response = await axios.get(
      `${BASE_URL}/my-services`,
      {
        params: { user_id: userId },
      }
    );

    return response.data;
  },
  updateQueueStatus: async (
    payload: {
      queue_id: number;
      status: "waiting" | "processing" | "completed" | "cancelled";
    }
  ): Promise<{
    message: string;
    data: {
      id: number;
      service_id: number;
      queue_number: number;
      status: string;
      queue_date: string;
    };
  }> => {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}/queues/update-status`,
      payload,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return response.data;
  },

  getTotalServe: async (params?: {
        service_id?: number;
        queue_date?: string; 
    }): Promise<{
        message: string;
        date: string;
        service: string;
        total_completed_services: number;
    }> => {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `${BASE_URL}/total-serve`,
            {
                params,
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined,
            }
        );

        return response.data;
    },

    getHistoryByService: async (
      params: {
        service_id: number;
        queue_date?: string;
        status?: "waiting" | "processing" | "completed" | "cancelled";
        page?: number;
        pageSize?: number;
      }
    ): Promise<HistoryByServiceResponse> => {
      const token = localStorage.getItem("token");

      const response = await axios.get<HistoryByServiceResponse>(
        `${BASE_URL}/queues/history/by-service`,
        {
          params,
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }
      );

      return response.data;
    },

    getServiceHistory: async (
      roleId: number,
      params?: {
        page?: number;
        pageSize?: number;
        status?: string;
        queue_date?: string;
        user_id?: number;
      }
    ): Promise<TrServiceResponsePagination<TrService[]>> => {
      const token = localStorage.getItem("token");

      const response = await axios.get<TrServiceResponsePagination<TrService[]>>(
        `${BASE_URL}/service-history/${roleId}`,
        {
          params: {
            page: params?.page ?? 1,
            pageSize: params?.pageSize ?? 10,
            status: params?.status,
            queue_date: params?.queue_date,
            user_id : params?.user_id
          },
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }
      );

      return response.data;
    },

  };

  export default ServiceService;
