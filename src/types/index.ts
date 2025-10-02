/**
 * Type definitions for the application
 */

// User related types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

// API response types for reqres.in color data
export interface ColorData {
  id: number;
  name: string;
  year: number;
  color: string;
  pantone_value: string;
}

export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface UpdateUserRequest {
  name?: string;
  job?: string;
}

export interface UserResponse {
  data: User;
  support: {
    url: string;
    text: string;
  };
}

export interface UsersListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: {
    url: string;
    text: string;
  };
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string | null;
}
