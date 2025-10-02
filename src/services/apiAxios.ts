/**
 * API Service with Axios
 * Centralized API calls using Axios with comprehensive error handling
 */
import axiosInstance from "../lib/axios";
import { mockApiService } from "./mockApi";
import { NetworkError } from "../lib/errors";
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
  /**
   * Generic HTTP request method using Axios
   */
  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const response = await axiosInstance.request<T>({
      method,
      url: endpoint,
      data,
      params,
    });

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  /**
   * Authentication Services
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      return await this.request<LoginResponse>("POST", "/login", credentials);
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.login();
    }
  }

  /**
   * User Management Services
   */
  async getUsers(
    params: PaginationParams = {}
  ): Promise<ApiResponse<UsersListResponse>> {
    try {
      const response = await this.request<UsersListResponse>(
        "GET",
        "/users",
        undefined,
        params as Record<string, unknown>
      );

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
          email: `${item.name.toLowerCase().replace(/\s+/g, ".")}@reqres.in`,
          first_name: item.name.split(" ")[0] || "User",
          last_name: item.name.split(" ").slice(1).join(" ") || "Name",
          avatar: `https://reqres.in/img/faces/${item.id}-image.jpg`,
        }));

        return {
          ...response,
          data: {
            ...response.data,
            data: transformedUsers,
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
    try {
      return await this.request<UserResponse>("GET", `/users/${id}`);
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.getUserById(id);
    }
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      return await this.request<User>("POST", "/users", userData);
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.createUser(userData);
    }
  }

  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<User>> {
    try {
      return await this.request<User>("PUT", `/users/${id}`, userData);
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.updateUser(id, userData);
    }
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    try {
      return await this.request<void>("DELETE", `/users/${id}`);
    } catch (error) {
      console.warn("Real API failed, falling back to mock API:", error);
      return mockApiService.deleteUser(id);
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    try {
      return await this.request<{ status: string }>(
        "GET",
        "/users?page=1&per_page=1"
      );
    } catch {
      throw new NetworkError("API health check failed");
    }
  }

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }
}

export const apiService = new ApiService();
