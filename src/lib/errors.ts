/**
 * Custom error classes for API error handling
 * Provides structured error information for better error management
 */
export class ApiError extends Error {
  public status: number;
  public code: string;
  public response?: any;
  public isNetworkError: boolean;

  constructor(
    message: string,
    status: number = 500,
    code: string = "API_ERROR",
    response?: any,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.response = response;
    this.isNetworkError = isNetworkError;
  }

  // Check if error is a client error (4xx)
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  // Check if error is a server error (5xx)
  get isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  // Check if error is authentication related
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  // Check if error is not found
  get isNotFound(): boolean {
    return this.status === 404;
  }

  // Check if error is validation related
  get isValidationError(): boolean {
    return this.status === 422;
  }

  // Check if error is rate limiting
  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = "Network connection failed") {
    super(message, 0, "NETWORK_ERROR", undefined, true);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string = "Request timeout") {
    super(message, 408, "TIMEOUT_ERROR");
    this.name = "TimeoutError";
  }
}

export class ValidationError extends ApiError {
  public validationErrors: Record<string, string[]>;

  constructor(
    message: string = "Validation failed",
    validationErrors: Record<string, string[]> = {}
  ) {
    super(message, 422, "VALIDATION_ERROR");
    this.name = "ValidationError";
    this.validationErrors = validationErrors;
  }
}

// Error type guards
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

export const isNetworkError = (error: any): error is NetworkError => {
  return error instanceof NetworkError;
};

export const isTimeoutError = (error: any): error is TimeoutError => {
  return error instanceof TimeoutError;
};

export const isValidationError = (error: any): error is ValidationError => {
  return error instanceof ValidationError;
};
