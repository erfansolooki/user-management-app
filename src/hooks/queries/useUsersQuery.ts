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
    onSuccess: (data) => {
      console.log("Create user success:", data);
      // Invalidate users list only (less aggressive)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      console.log("Cache invalidated for create");
    },
    onError: (error) => {
      console.error("Create user error:", error);
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
    onMutate: async ({ id, userData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.users.lists() });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueriesData({
        queryKey: queryKeys.users.lists(),
      });

      // Optimistically update the cache
      queryClient.setQueriesData(
        { queryKey: queryKeys.users.lists() },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((user: any) =>
                user.id === id
                  ? {
                      ...user,
                      first_name:
                        userData.name?.split(" ")[0] || user.first_name,
                      last_name:
                        userData.name?.split(" ").slice(1).join(" ") ||
                        user.last_name,
                    }
                  : user
              ),
            },
          };
        }
      );

      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("Update user error:", err);
    },
    onSuccess: (data, variables) => {
      console.log("Update user success:", data);
      // Invalidate to ensure we have the latest data from server
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      console.log("Cache invalidated for update");
    },
  });
};

// Delete user mutation
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteUser(id),
    onSuccess: (data) => {
      console.log("Delete user success:", data);
      // Invalidate users list only (less aggressive)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      console.log("Cache invalidated for delete");
    },
    onError: (error) => {
      console.error("Delete user error:", error);
    },
  });
};
