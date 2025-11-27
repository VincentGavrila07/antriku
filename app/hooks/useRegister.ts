"use client";

import { useMutation } from "@tanstack/react-query";
import UserService from "@/services/UserService";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      roleId: number;
    }) => UserService.register(data),
  });
};
