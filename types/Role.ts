export interface Role {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface LinksPagination {
    url: string | null;
    label: string;
    active: boolean;
}

export interface RoleResponsePagination<T> {
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

export interface AddRoleFormValues {
  name: string;
}