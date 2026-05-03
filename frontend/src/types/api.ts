export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
}

export interface FrontendLogEntry {
  level: string;
  message: string;
  source: string;
  details?: string;
  path?: string;
  createdAt: string;
}
