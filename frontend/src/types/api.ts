/**
 * Envelope for every successful API response.
 * All backend endpoints return `{ success: true, data: T }` on a 2xx status code.
 * `apiClient` unwraps this automatically and returns `data` directly to callers.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/** Structured error detail carried inside an {@link ErrorResponse}. */
export interface ApiError {
  /**
   * Machine-readable error identifier (e.g. `"ARTICLE_NOT_FOUND"`, `"INVALID_ID"`).
   * Use this field for programmatic error handling rather than parsing `message`.
   */
  code: string;
  /** Human-readable description of the error, suitable for logging or display. */
  message: string;
  /**
   * Optional extra context (e.g. a list of validation error strings).
   * The shape varies by error type, so it is typed as `unknown`.
   */
  details?: unknown;
}

/**
 * Envelope for every failed API response.
 * All backend endpoints return `{ success: false, error: ApiError }` on a non-2xx status code.
 * `success` is narrowed to the literal `false` so TypeScript can discriminate between
 * `ApiResponse<T>` and `ErrorResponse` in a union type.
 */
export interface ErrorResponse {
  success: false;
  error: ApiError;
}

/**
 * Payload sent to `POST /api/logs` when a frontend error occurs.
 * The request is fire-and-forget — failures are silently swallowed so a broken
 * logging pipeline never degrades the user-facing UI.
 */
export interface FrontendLogEntry {
  /** Severity level (e.g. `"error"`, `"warn"`). */
  level: string;
  /** Human-readable description of what went wrong. */
  message: string;
  /** The component or service that emitted the entry (e.g. `"ArticlePage"`). */
  source: string;
  /** Optional stringified error detail (typically `String(err)` from a catch block). */
  details?: string;
  /** Browser URL path where the error occurred. `undefined` when running on the server (SSR). */
  path?: string;
  /** ISO 8601 timestamp of when the error was captured on the client. */
  createdAt: string;
}
