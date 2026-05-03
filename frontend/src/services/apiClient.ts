/**
 * Base URL for all API requests, injected at build time via the `NEXT_PUBLIC_API_BASE_URL`
 * environment variable (defined in `.env.local`).
 * Throwing here at module load time gives a clear error on startup rather than a cryptic
 * fetch failure at runtime.
 */
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
}

/**
 * Centralised fetch wrapper used by all service functions.
 *
 * - Always sets `cache: "no-store"` so Next.js never serves stale data from its
 *   built-in fetch cache between page navigations.
 * - On non-2xx responses, parses the backend's `ErrorResponse` shape and throws an
 *   enriched `Error` with `status` (HTTP status code) and `code` (machine-readable error code)
 *   attached, so callers can branch on them (e.g. `if (err.status === 404) notFound()`).
 * - On success, unwraps the `ApiResponse<T>` envelope and returns `data` directly,
 *   so callers never have to access `.data` themselves.
 *
 * @param path  API path relative to the base URL (e.g. `"/api/articles/42"`).
 * @param init  Optional fetch options (method, headers, body). `cache` is intentionally
 *              excluded — it is always overridden to `"no-store"`.
 */
export async function apiClient<T>(path: string, init?: Omit<RequestInit, "cache">): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, cache: "no-store" });

  if (!response.ok) {
    // Attempt to parse the backend ErrorResponse; fall back gracefully if the body
    // is not valid JSON (e.g. a raw 500 from a reverse proxy).
    const error = await response.json().catch(() => null);
    throw Object.assign(new Error(error?.error?.message ?? response.statusText), {
      status: response.status,
      code: error?.error?.code ?? "UNKNOWN_ERROR",
    });
  }

  // Unwrap the ApiResponse<T> envelope — callers receive the payload directly.
  const json = await response.json();
  return json.data as T;
}
