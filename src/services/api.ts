/**
 * Centralized API service layer
 * Handles all HTTP requests to the backend
 * Falls back to mock API when real API fails
 */
import { API_URLS, buildApiUrl } from "../config/urls";
import { mockApiService } from "./mockApi";
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
  type ColorData,
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
    try {
      return await this.request<LoginResponse>(API_URLS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.login(credentials);
    }
  }

  /**
   * User Management Services
   */
  async getUsers(
    params: PaginationParams = {}
  ): Promise<ApiResponse<UsersListResponse>> {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.per_page)
        searchParams.append("per_page", params.per_page.toString());

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `${API_URLS.USERS.LIST}?${queryString}`
        : API_URLS.USERS.LIST;

      const response = await this.request<UsersListResponse>(endpoint);

      // Transform the color/design data to user data format
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        const transformedUsers = (
          response.data.data as unknown as ColorData[]
        ).map((item: ColorData) => ({
          id: item.id,
          email: `user${item.id}@reqres.in`,
          first_name: item.name.split(" ")[0] || "User",
          last_name: item.name.split(" ").slice(1).join(" ") || "Name",
          avatar: `https://reqres.in/img/faces/${item.id}-image.jpg`,
        }));

        return {
          ...response,
          data: {
            page: response.data.page,
            per_page: response.data.per_page,
            total: response.data.total,
            total_pages: response.data.total_pages,
            data: transformedUsers,
            support: response.data.support,
          },
        };
      }

      return response;
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.getUsers(params);
    }
  }

  async getUserById(id: number): Promise<ApiResponse<UserResponse>> {
    const response = await this.request<UserResponse>(
      API_URLS.USERS.DETAIL(id)
    );

    // Transform the color/design data to user data format
    if (
      response.data &&
      response.data.data &&
      typeof response.data.data === "object"
    ) {
      const item = response.data.data as unknown as ColorData;
      const transformedUser = {
        id: item.id,
        email: `user${item.id}@reqres.in`,
        first_name: item.name.split(" ")[0] || "User",
        last_name: item.name.split(" ").slice(1).join(" ") || "Name",
        avatar: `https://reqres.in/img/faces/${item.id}-image.jpg`,
      };

      return {
        ...response,
        data: {
          data: transformedUser,
          support: response.data.support,
        },
      };
    }

    return response;
  }

  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<User & { job: string; createdAt: string }>> {
    try {
      const response = await this.request<
        User & { job: string; createdAt: string }
      >(API_URLS.USERS.CREATE, {
        method: "POST",
        body: JSON.stringify(userData),
      });

      return response;
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.createUser(userData);
    }
  }

  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<User & { job: string; updatedAt: string }>> {
    try {
      return await this.request<User & { job: string; updatedAt: string }>(
        API_URLS.USERS.UPDATE(id),
        {
          method: "PUT",
          body: JSON.stringify(userData),
        }
      );
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.updateUser(id, userData);
    }
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    try {
      return await this.request<void>(API_URLS.USERS.DELETE(id), {
        method: "DELETE",
      });
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.deleteUser(id);
    }
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
