import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered "fresh" for 1 minute.
      staleTime: 1000 * 60 * 1,
      // Auto-updates if you click away and come back
      refetchOnWindowFocus: true,
      // If a request fails, try exactly 1 more time before showing an error
      retry: 1,
    },
  },
});
