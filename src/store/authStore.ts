/**
 * Authentication store using Zustand
 * Manages authentication state globally
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiService } from "../services/api";
import { type LoginRequest, type User } from "../types";

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.login(credentials);
          const { token } = response.data;

          // Store token in localStorage
          localStorage.setItem("auth_token", token);

          // For demo purposes, we'll create a mock user since reqres.in doesn't return user data on login
          const mockUser: User = {
            id: 1,
            email: credentials.email,
            first_name: "Admin",
            last_name: "User",
            avatar: "https://reqres.in/img/faces/1-image.jpg",
          };

          set({
            isAuthenticated: true,
            user: mockUser,
            token,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        apiService.clearAuth();
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
