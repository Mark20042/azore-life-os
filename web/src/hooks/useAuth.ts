import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { type User } from "@/types/index";
import { useQuery } from "@tanstack/react-query";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post("/auth/login", credentials);

      return response.data.user as User;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["authUser"], userData);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
    }) => {
      const response = await api.post("/auth/register", userData);
      return response.data.user as User;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["authUser"], userData);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useAuthSession = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.user as User;
    },

    staleTime: 1000 * 60 * 5,

    retry: false,
  });
};
