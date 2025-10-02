/**
 * React Query hooks for user management
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import {
  type PaginationParams,
  type CreateUserRequest,
  type UpdateUserRequest,
} from "../../types";
import { queryKeys } from "../../lib/queryKeys";

// Get users list
export const useUsersQuery = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: () => apiService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single user
export const useUserQuery = (id: number) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => apiService.getUserById(id),
    enabled: !!id,
  });
};

// Create user mutation
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) =>
      apiService.createUser(userData),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
};

// Update user mutation
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: number;
      userData: UpdateUserRequest;
    }) => apiService.updateUser(id, userData),
    onSuccess: (_, variables) => {
      // Invalidate users list and specific user detail
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
    },
  });
};

// Delete user mutation
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteUser(id),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
};
