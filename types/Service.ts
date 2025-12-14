import { Moment } from "moment";
import { User } from "./User";

export interface Service {
  id: number;
  name: string;
  description?: string | null;  
  code:string; 
  assigned_user_ids?: number[] | null; 
  is_active: boolean;
  estimated_time?: string | null;   
  created_at?: string;
  updated_at?: string;
}

export interface LinksPagination {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ServiceResponsePagination<T> {
  current_page: number;
  data: T;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: LinksPagination[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}



export interface AddServiceFormValues {
  name: string;
  code:string;
  description: string;
  assigned_user_ids?: number[];
  is_active : boolean;
  estimated_time?: string | null; // string format "HH:mm:ss"
}

export interface UpdateServiceFormValues {
  name: string;
  code:string;
  description: string;
  assigned_user_ids?: number[];
  is_active : boolean;
  estimated_time?: string | null; 
}

export interface BookServicePayload {
  service_id: number;
  user_id: number;
  queue_date: string;      // format: YYYY-MM-DD
  estimated_time?: string; // format: HH:mm:ss
}

export interface TrService {
  user: User;
  id: number;
  service_id: number;
  user_id: number;
  queue_number: number;
  queue_code:string;
  status: string;
  queue_date: string;
  estimated_time?: string;
  created_at: string;
  updated_at: string;
}

export type QueueStatus =
  | "waiting"
  | "processing"
  | "completed"
  | "cancelled";

export interface UpdateQueueStatusPayload {
  queue_id: number;
  status: QueueStatus;
}


export interface MyService {
  id: number;
  name: string;
  code: string;
}

 export interface QueueUser {
  id: number;
  name: string;
}

export interface QueueItem {
  initial_complaint: unknown;
  created_at: string;
  id: number;
  queue_number: number;
  status: "waiting" | "processing" | "completed";
  user: QueueUser | null;
}

export interface QueueByServiceResponse {
  service: {
    id: number;
    name: string;
    code: string;
  };
  total_queue:number;
  data: QueueItem[];
}

export interface CurrentSession {
  queueId: number;
  queueNumber: string;
  patientName: string;
  serviceType: string;
}

export interface HistoryByServiceItem {
  queue_id: number;
  queue_code: string; 
  queue_number: number;
  status: 'waiting' | 'processing' | 'completed' | 'cancelled';
  queue_date: string;
  initial_complaint: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  } | null;
}

export interface HistoryByServiceResponse {
  message: string;
  service_name: string;
  current_page: number;
  last_page: number;
  total: number;
  data: {
    queue_id: number;
    queue_code: string;
    queue_number: string;
    status: "completed";
    queue_date: string;
    user: {
      id: number;
      name: string;
    };
    created_at: string;
    updated_at: string;
  }[];
}

export interface TrServiceResponsePagination<T> {
    current_page: number;
    data: T;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: LinksPagination[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}