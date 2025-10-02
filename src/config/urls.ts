/**
 * URL configuration object for API endpoints
 * Centralized management of all API URLs
 */
export const API_URLS = {
  BASE_URL: "https://reqres.in/api",

  // Authentication endpoints
  AUTH: {
    LOGIN: "/login",
  },

  // User management endpoints
  USERS: {
    LIST: "/users",
    DETAIL: (id: number) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
  },
} as const;

/**
 * Helper function to build complete API URLs
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_URLS.BASE_URL}${endpoint}`;
};

/**
 * Helper function to build user-specific URLs
 */
export const buildUserUrl = (
  id: number,
  action: "detail" | "update" | "delete"
): string => {
  const endpoint =
    API_URLS.USERS[action.toUpperCase() as keyof typeof API_URLS.USERS];
  if (typeof endpoint === "function") {
    return buildApiUrl(endpoint(id));
  }
  throw new Error(`Invalid user action: ${action}`);
};
