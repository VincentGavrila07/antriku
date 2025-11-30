import { User } from "@/types/User";

export interface TableUserProps {
  data: User[];                 
  total: number;                
  page: number;                 
  pageSize: number;              
  isLoading?: boolean;           
  onChange?: (page: number, pageSize?: number) => void; 
  onDelete?: (userId: string) => void; 
}
