import { useMutation } from "@tanstack/react-query";
import UserService from "@/services/UserService";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await UserService.login(data.email, data.password);
    },
  });
};
