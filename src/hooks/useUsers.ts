/**
 * Custom hook for user management operations
 * Uses React Query for API calls
 */
import { useState } from "react";
import {
  useUsersQuery,
  useUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "./queries/useUsersQuery";
import { type PaginationParams } from "../types";

export const useUsers = (params?: PaginationParams) => {
  const [currentParams, setCurrentParams] = useState<PaginationParams>(
    params || {}
  );
  const usersQuery = useUsersQuery(currentParams);
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const handleCreateUser = async (userData: { name: string; job: string }) => {
    try {
      await createUserMutation.mutateAsync(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create user",
      };
    }
  };

  const handleUpdateUser = async (
    id: number,
    userData: { name?: string; job?: string }
  ) => {
    try {
      await updateUserMutation.mutateAsync({ id, userData });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user",
      };
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user",
      };
    }
  };

  const fetchUsers = (newParams?: PaginationParams) => {
    if (newParams) {
      setCurrentParams(newParams);
    } else {
      usersQuery.refetch();
    }
  };

  return {
    // State from users query
    users: usersQuery.data?.data.data || [],
    totalPages: usersQuery.data?.data.total_pages || 0,
    currentPage: usersQuery.data?.data.page || 1,
    totalUsers: usersQuery.data?.data.total || 0,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error?.message,

    // Actions
    fetchUsers,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    clearError: () => {}, // React Query handles errors automatically
  };
};

export const useUser = (id: number) => {
  const userQuery = useUserQuery(id);

  return {
    currentUser: userQuery.data?.data.data || null,
    isLoading: userQuery.isLoading,
    error: userQuery.error?.message,
    fetchUserById: () => userQuery.refetch(),
  };
};
