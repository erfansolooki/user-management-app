/**
 * React Query hooks for authentication
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import { type LoginRequest, type LoginResponse } from "../../types";
import { queryKeys } from "../../lib/queryKeys";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await apiService.login(credentials);
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      // Store token in localStorage
      localStorage.setItem("auth_token", data.token);
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      apiService.clearAuth();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
    },
  });
};
