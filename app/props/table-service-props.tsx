import { Service } from "@/types/Service";

export interface TableServiceProps {
  data: Service[];                 
  total: number;                
  page: number;                 
  pageSize: number;              
  isLoading?: boolean;           
  onChange?: (page: number, pageSize?: number) => void; 
  onDelete?: (userId: string) => void; 
}
