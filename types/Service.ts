import { Moment } from "moment";

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
