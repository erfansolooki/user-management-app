/**
 * Custom hook for user management operations
 * Uses React Query for API calls
 */
import { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import {
  useUsersQuery,
  useUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "./queries/useUsersQuery";
import { type PaginationParams, type User } from "../types";

export const useUsers = () => {
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof User | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // View state
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Show 4 items per page

  // Fetch users with pagination from API
  const usersQuery = useUsersQuery({
    page: currentPage,
    per_page: itemsPerPage,
  });

  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const handleCreateUser = async (userData: { name: string; job: string }) => {
    try {
      await createUserMutation.mutateAsync(userData);
      toast.success("User created successfully!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleUpdateUser = async (
    id: number,
    userData: { name?: string; job?: string }
  ) => {
    try {
      await updateUserMutation.mutateAsync({ id, userData });
      toast.success("User updated successfully!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user";
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      toast.success("User deleted successfully!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete user";
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Note: For server-side pagination, we don't need to reset to page 1 when filters change
  // The server will handle filtering and return the appropriate page

  // Apply client-side filtering and sorting to the current page data
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

  const fetchUsers = useCallback(
    (newParams?: PaginationParams) => {
      if (newParams?.page) {
        setCurrentPage(newParams.page);
      } else {
        usersQuery.refetch();
      }
    },
    [usersQuery]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // State from users query
    users: filteredAndSortedUsers, // Show filtered/sorted users from current page
    allUsers: usersQuery.data?.data.data || [], // Original API data for total count
    originalUsers: usersQuery.data?.data.data || [],
    totalPages: usersQuery.data?.data.total_pages || 0,
    currentPage: currentPage, // Use local state instead of API response
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

    // View state
    viewMode,
    setViewMode,

    // Actions
    fetchUsers,
    handlePageChange,
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
