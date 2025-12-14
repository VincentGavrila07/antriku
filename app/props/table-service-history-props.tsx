import { TrService } from "@/types/Service";

export interface TableServiceHistoryProps {
  data: TrService[];                 
  total: number;                
  page: number;                 
  pageSize: number;              
  isLoading?: boolean;           
  onChange?: (page: number, pageSize?: number) => void; 
}
