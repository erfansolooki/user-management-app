/**
 * User management store using Zustand
 * Manages user data and operations globally
 */
import { create } from "zustand";
import { type User, type PaginationParams } from "../types";
import { apiService } from "../services/api";

interface UserState {
  // State
  users: User[];
  currentUser: User | null;
  totalPages: number;
  currentPage: number;
  totalUsers: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUsers: (params?: PaginationParams) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  createUser: (userData: { name: string; job: string }) => Promise<void>;
  updateUser: (
    id: number,
    userData: { name?: string; job?: string }
  ) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setCurrentUser: (user: User | null) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  users: [],
  currentUser: null,
  totalPages: 0,
  currentPage: 1,
  totalUsers: 0,
  isLoading: false,
  error: null,

  // Actions
  fetchUsers: async (params: PaginationParams = {}) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.getUsers(params);
      const { data, total_pages, page, total } = response.data;

      set({
        users: data,
        totalPages: total_pages,
        currentPage: page,
        totalUsers: total,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch users";
      set({
        users: [],
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  fetchUserById: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.getUserById(id);
      const user = response.data.data;

      set({
        currentUser: user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user";
      set({
        currentUser: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  createUser: async (userData: { name: string; job: string }) => {
    set({ isLoading: true, error: null });

    try {
      await apiService.createUser(userData);

      // Refresh users list after creation
      const { currentPage } = get();
      await get().fetchUsers({ page: currentPage });

      set({ isLoading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  updateUser: async (id: number, userData: { name?: string; job?: string }) => {
    set({ isLoading: true, error: null });

    try {
      await apiService.updateUser(id, userData);

      // Refresh users list after update
      const { currentPage } = get();
      await get().fetchUsers({ page: currentPage });

      set({ isLoading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  deleteUser: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      await apiService.deleteUser(id);

      // Remove user from local state
      const { users } = get();
      const updatedUsers = users.filter((user) => user.id !== id);

      set({
        users: updatedUsers,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete user";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setCurrentUser: (user: User | null) => {
    set({ currentUser: user });
  },

  clearCurrentUser: () => {
    set({ currentUser: null });
  },
}));
