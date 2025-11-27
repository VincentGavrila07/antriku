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
