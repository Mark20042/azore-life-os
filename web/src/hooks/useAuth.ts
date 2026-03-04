import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { type User } from "@/types/index";

// 1. Hook for Logging In
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // Hits your Express backend at /dawg/auth/login
      const response = await api.post("/auth/login", credentials);
      // Assuming your backend returns { success: true, user: { ... } }
      return response.data.user as User;
    },
    onSuccess: (userData) => {
      // Optional: You can pre-fill the cache with the user's data
      // so if you have a "getMe" query later, it loads instantly!
      queryClient.setQueryData(["authUser"], userData);
    },
  });
};

// 2. Hook for Registering
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
    }) => {
      // Hits your Express backend at /dawg/auth/register
      const response = await api.post("/auth/register", userData);
      return response.data.user as User;
    },
    onSuccess: (userData) => {
      // Same logic here, cache the user after a successful registration
      queryClient.setQueryData(["authUser"], userData);
    },
  });
};

// 3. Hook for Logging Out
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      // When they log out, wipe the TanStack cache completely
      // so no protected Life OS data is left in the browser memory
      queryClient.clear();
    },
  });
};
