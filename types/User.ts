export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number; // admin / staff / user
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  roleId: number;
};

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface LinksPagination {
    url: string | null;
    label: string;
    active: boolean;
}

export interface UserResponsePagination<T> {
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

export interface AddUserFormValues {
  name: string;
  email: string;
  roleId: number;
}

export interface UpdateUserFormValues {
  name: string;
  newPassword?: string;
  currentPassword?: string;
}

export type MyService = {
  id: number;
  name: string;
  code: string;
  description?: string;
  estimated_time?: string;
};
