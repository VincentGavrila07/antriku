import { Service } from "@/types/Service";

export interface TableServiceOrderProps {
  data: Service[];                 
  total: number;                
  page: number;                 
  pageSize: number;              
  isLoading?: boolean;           
  onChange?: (page: number, pageSize?: number) => void; 
  onOrder: (service: Service) => void;
}
