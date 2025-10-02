/**
 * React Query client configuration
 */
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // No caching for pagination to work properly
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2, // Reduced retries
      refetchOnWindowFocus: false,
      refetchOnMount: true, // Allow refetch on mount for pagination
    },
    mutations: {
      retry: 1,
    },
  },
});
