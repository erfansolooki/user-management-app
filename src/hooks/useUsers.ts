/**
 * Custom hook for user management operations
 * Provides user data and CRUD operations
 */
import { useUserStore } from "../store/userStore";
import { type PaginationParams } from "../types";

export const useUsers = () => {
  const {
    users,
    currentUser,
    totalPages,
    currentPage,
    totalUsers,
    isLoading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    clearError,
    setLoading,
    setCurrentUser,
    clearCurrentUser,
  } = useUserStore();

  const handleFetchUsers = async (params?: PaginationParams) => {
    try {
      await fetchUsers(params);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch users",
      };
    }
  };

  const handleFetchUserById = async (id: number) => {
    try {
      await fetchUserById(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user",
      };
    }
  };

  const handleCreateUser = async (userData: { name: string; job: string }) => {
    try {
      await createUser(userData);
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
      await updateUser(id, userData);
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
      await deleteUser(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user",
      };
    }
  };

  return {
    // State
    users,
    currentUser,
    totalPages,
    currentPage,
    totalUsers,
    isLoading,
    error,

    // Actions
    fetchUsers: handleFetchUsers,
    fetchUserById: handleFetchUserById,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    clearError,
    setLoading,
    setCurrentUser,
    clearCurrentUser,
  };
};
