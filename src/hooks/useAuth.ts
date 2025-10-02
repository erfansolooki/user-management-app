/**
 * Custom hook for authentication operations
 * Provides authentication state and actions
 */
import { useAuthStore } from "../store/authStore";
import { type LoginRequest } from "../types";

export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    clearError,
    setLoading,
    setUser,
  } = useAuthStore();

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const handleLogout = () => {
    logout();
  };

  return {
    // State
    isAuthenticated,
    user,
    token,
    isLoading,
    error,

    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError,
    setLoading,
    setUser,
  };
};
