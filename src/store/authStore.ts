/**
 * Authentication store using Zustand for local state only
 * React Query handles API calls
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "../types";

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  error: string | null;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,

      // Actions
      setAuth: (user: User, token: string) => {
        localStorage.setItem("auth_token", token);
        set({
          isAuthenticated: true,
          user,
          token,
          error: null,
        });
      },

      logout: () => {
        localStorage.removeItem("auth_token");
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

      setError: (error: string) => {
        set({ error });
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
