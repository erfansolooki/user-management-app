/**
 * Centralized API service layer
 * Handles all HTTP requests to the backend
 */
import { API_URLS, buildApiUrl } from "../config/urls";
import {
  type User,
  type UsersListResponse,
  type UserResponse,
  type LoginRequest,
  type LoginResponse,
  type CreateUserRequest,
  type UpdateUserRequest,
  type ApiResponse,
  type PaginationParams,
} from "../types";

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URLS.BASE_URL;
  }

  /**
   * Generic HTTP request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": "reqres-free-v1", // ReqRes API key
    };

    // Add authorization header if token exists
    const token = localStorage.getItem("auth_token");
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.error || `HTTP Error: ${response.status}`
        ) as Error & { status?: number; statusText?: string };
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Network error occurred"
      );
    }
  }

  /**
   * Authentication Services
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>(API_URLS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  /**
   * User Management Services
   */
  async getUsers(
    params: PaginationParams = {}
  ): Promise<ApiResponse<UsersListResponse>> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.per_page)
      searchParams.append("per_page", params.per_page.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${API_URLS.USERS.LIST}?${queryString}`
      : API_URLS.USERS.LIST;

    return this.request<UsersListResponse>(endpoint);
  }

  async getUserById(id: number): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>(API_URLS.USERS.DETAIL(id));
  }

  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<User & { job: string; createdAt: string }>> {
    return this.request<User & { job: string; createdAt: string }>(
      API_URLS.USERS.CREATE,
      {
        method: "POST",
        body: JSON.stringify(userData),
      }
    );
  }

  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<User & { job: string; updatedAt: string }>> {
    return this.request<User & { job: string; updatedAt: string }>(
      API_URLS.USERS.UPDATE(id),
      {
        method: "PUT",
        body: JSON.stringify(userData),
      }
    );
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(API_URLS.USERS.DELETE(id), {
      method: "DELETE",
    });
  }

  /**
   * Utility method to check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  /**
   * Utility method to get stored token
   */
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  /**
   * Utility method to clear authentication
   */
  clearAuth(): void {
    localStorage.removeItem("auth_token");
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
