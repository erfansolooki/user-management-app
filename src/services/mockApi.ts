/**
 * Mock API service for development and testing
 * Provides the same interface as the real API but uses local data
 */
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

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    email: "george.bluth@reqres.in",
    first_name: "George",
    last_name: "Bluth",
    avatar: "https://reqres.in/img/faces/1-image.jpg",
  },
  {
    id: 2,
    email: "janet.weaver@reqres.in",
    first_name: "Janet",
    last_name: "Weaver",
    avatar: "https://reqres.in/img/faces/2-image.jpg",
  },
  {
    id: 3,
    email: "emma.wong@reqres.in",
    first_name: "Emma",
    last_name: "Wong",
    avatar: "https://reqres.in/img/faces/3-image.jpg",
  },
  {
    id: 4,
    email: "eve.holt@reqres.in",
    first_name: "Eve",
    last_name: "Holt",
    avatar: "https://reqres.in/img/faces/4-image.jpg",
  },
  {
    id: 5,
    email: "charles.morris@reqres.in",
    first_name: "Charles",
    last_name: "Morris",
    avatar: "https://reqres.in/img/faces/5-image.jpg",
  },
  {
    id: 6,
    email: "tracey.ramos@reqres.in",
    first_name: "Tracey",
    last_name: "Ramos",
    avatar: "https://reqres.in/img/faces/6-image.jpg",
  },
  {
    id: 7,
    email: "michael.lawson@reqres.in",
    first_name: "Michael",
    last_name: "Lawson",
    avatar: "https://reqres.in/img/faces/7-image.jpg",
  },
  {
    id: 8,
    email: "lindsay.ferguson@reqres.in",
    first_name: "Lindsay",
    last_name: "Ferguson",
    avatar: "https://reqres.in/img/faces/8-image.jpg",
  },
  {
    id: 9,
    email: "tobias.funke@reqres.in",
    first_name: "Tobias",
    last_name: "Funke",
    avatar: "https://reqres.in/img/faces/9-image.jpg",
  },
  {
    id: 10,
    email: "byron.fields@reqres.in",
    first_name: "Byron",
    last_name: "Fields",
    avatar: "https://reqres.in/img/faces/10-image.jpg",
  },
  {
    id: 11,
    email: "george.edwards@reqres.in",
    first_name: "George",
    last_name: "Edwards",
    avatar: "https://reqres.in/img/faces/11-image.jpg",
  },
  {
    id: 12,
    email: "rachel.howell@reqres.in",
    first_name: "Rachel",
    last_name: "Howell",
    avatar: "https://reqres.in/img/faces/12-image.jpg",
  },
];

let nextId = 13;

class MockApiService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async login(): Promise<ApiResponse<LoginResponse>> {
    await this.delay(300);

    // Mock login - always succeeds
    const token = `mock_token_${Date.now()}`;

    return {
      data: { token },
      status: 200,
      statusText: "OK",
    };
  }

  async getUsers(
    params: PaginationParams = {}
  ): Promise<ApiResponse<UsersListResponse>> {
    await this.delay(300);

    const page = params.page || 1;
    const perPage = params.per_page || 6;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    const paginatedUsers = mockUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(mockUsers.length / perPage);

    return {
      data: {
        page,
        per_page: perPage,
        total: mockUsers.length,
        total_pages: totalPages,
        data: paginatedUsers,
        support: {
          url: "https://reqres.in/#support-heading",
          text: "To keep ReqRes free, contributions towards server costs are appreciated!",
        },
      },
      status: 200,
      statusText: "OK",
    };
  }

  async getUserById(id: number): Promise<ApiResponse<UserResponse>> {
    await this.delay(300);

    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      data: {
        data: user,
        support: {
          url: "https://reqres.in/#support-heading",
          text: "To keep ReqRes free, contributions towards server costs are appreciated!",
        },
      },
      status: 200,
      statusText: "OK",
    };
  }

  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<User & { job: string; createdAt: string }>> {
    await this.delay(500);

    const newUser: User = {
      id: nextId++,
      email: `${userData.name.toLowerCase().replace(/\s+/g, ".")}@reqres.in`,
      first_name: userData.name.split(" ")[0] || "User",
      last_name: userData.name.split(" ").slice(1).join(" ") || "Name",
      avatar: `https://reqres.in/img/faces/${nextId - 1}-image.jpg`,
    };

    mockUsers.push(newUser);

    return {
      data: {
        ...newUser,
        job: userData.job,
        createdAt: new Date().toISOString(),
      },
      status: 201,
      statusText: "Created",
    };
  }

  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<User & { job: string; updatedAt: string }>> {
    await this.delay(500);

    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const user = mockUsers[userIndex];

    if (userData.name) {
      const nameParts = userData.name.split(" ");
      user.first_name = nameParts[0] || user.first_name;
      user.last_name = nameParts.slice(1).join(" ") || user.last_name;
    }

    mockUsers[userIndex] = user;

    return {
      data: {
        ...user,
        job: userData.job || "Software Engineer",
        updatedAt: new Date().toISOString(),
      },
      status: 200,
      statusText: "OK",
    };
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    await this.delay(500);

    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    mockUsers.splice(userIndex, 1);

    return {
      data: undefined,
      status: 204,
      statusText: "No Content",
    };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  clearAuth(): void {
    localStorage.removeItem("auth_token");
  }
}

// Export singleton instance
export const mockApiService = new MockApiService();
export default mockApiService;
