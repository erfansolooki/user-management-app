/**
 * Custom hook for user management operations
 * Uses React Query for API calls
 */
import { useState, useMemo } from "react";
import {
  useUsersQuery,
  useUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "./queries/useUsersQuery";
import { type PaginationParams, type User } from "../types";

export const useUsers = (params?: PaginationParams) => {
  const [currentParams, setCurrentParams] = useState<PaginationParams>(
    params || {}
  );

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof User | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  // Filter and sort logic
  const filteredAndSortedUsers = useMemo(() => {
    let users = usersQuery.data?.data.data || [];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      users = users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(term) ||
          user.last_name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          `${user.first_name} ${user.last_name}`.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (sortBy) {
      users = [...users].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortOrder === "asc" ? comparison : -comparison;
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          const comparison = aValue - bValue;
          return sortOrder === "asc" ? comparison : -comparison;
        }

        return 0;
      });
    }

    return users;
  }, [usersQuery.data?.data.data, searchTerm, sortBy, sortOrder]);

  const fetchUsers = (newParams?: PaginationParams) => {
    if (newParams) {
      setCurrentParams(newParams);
    } else {
      usersQuery.refetch();
    }
  };

  return {
    // State from users query
    users: filteredAndSortedUsers,
    originalUsers: usersQuery.data?.data.data || [],
    totalPages: usersQuery.data?.data.total_pages || 0,
    currentPage: usersQuery.data?.data.page || 1,
    totalUsers: usersQuery.data?.data.total || 0,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error?.message,

    // Filter and sort state
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

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
