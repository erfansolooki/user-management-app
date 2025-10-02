/**
 * React Query client configuration with global error handling
 */
import { QueryClient } from "@tanstack/react-query";
import { ValidationError, isApiError } from "./errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // No caching for pagination to work properly
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on client errors (4xx)
        if (isApiError(error) && error.isClientError) {
          return false;
        }
        // Don't retry on validation errors
        if (error instanceof ValidationError) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true, // Allow refetch on mount for pagination
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry on client errors (4xx)
        if (isApiError(error) && error.isClientError) {
          return false;
        }
        // Don't retry on validation errors
        if (error instanceof ValidationError) {
          return false;
        }
        // Retry once for other errors
        return failureCount < 1;
      },
    },
  },
});
