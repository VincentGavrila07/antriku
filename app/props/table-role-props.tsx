import { Role } from "@/types/Role";

export interface TableRoleProps {
  data: Role[];                 
  total: number;                
  page: number;                 
  pageSize: number;              
  isLoading?: boolean;           
  onChange?: (page: number, pageSize?: number) => void; 
  onDelete?: (userId: string) => void; 
}
