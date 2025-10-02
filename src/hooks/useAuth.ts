/**
 * Custom hook for authentication operations
 * Uses React Query for API calls and Zustand for local state
 */
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useLoginMutation, useLogoutMutation } from "./queries/useAuthQuery";
import { type LoginRequest, type User } from "../types";

export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    token,
    error,
    setAuth,
    logout,
    clearError,
    setError,
  } = useAuthStore();

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      clearError();
      const result = await loginMutation.mutateAsync(credentials);

      // Create mock user for demo
      const mockUser: User = {
        id: 1,
        email: credentials.email,
        first_name: "Admin",
        last_name: "User",
        avatar: "https://reqres.in/img/faces/1-image.jpg",
      };

      setAuth(mockUser, result.token);
      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    logout();
    toast.success("Logged out successfully!");
  };

  return {
    // State
    isAuthenticated,
    user,
    token,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    error: error || loginMutation.error?.message,

    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError,
  };
};
