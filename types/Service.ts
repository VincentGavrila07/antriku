import { Moment } from "moment";

export interface Service {
  id: number;
  name: string;
  description?: string | null;   
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
  description: string;
  assigned_user_ids?: number[];
  is_active : boolean;
  estimated_time?: string | null; // string format "HH:mm:ss"
}

export interface UpdateServiceFormValues {
  name: string;
  description: string;
  assigned_user_ids?: number[];
  is_active : boolean;
  estimated_time?: string | null; 
}
