import { apiClient } from "./apiClient";
import type { FrontendLogEntry } from "../types/api";

/**
 * Logs a frontend error to both the browser console and the backend log pipeline.
 *
 * Flow:
 * 1. Writes to `console.error` immediately for developer visibility in DevTools.
 * 2. Sends a fire-and-forget `POST /api/logs` so the error appears in the backend's
 *    structured log output alongside server-side events.
 *
 * Design constraints:
 * - This function is intentionally synchronous from the caller's perspective — it does
 *   not return a Promise, so callers never need to `await` it.
 * - The `POST` request failure is silently swallowed. A broken logging pipeline must
 *   never crash or block the user-facing UI.
 *
 * @param message  Human-readable description of what went wrong.
 * @param source   The component or service emitting the log (e.g. `"ArticlePage"`).
 * @param details  Optional extra context, typically `String(err)` from a catch block.
 */
export function logError(message: string, source: string, details?: string): void {
  console.error(`[${source}] ${message}`, details ?? "");

  const entry: FrontendLogEntry = {
    level: "error",
    message,
    source,
    details,
    // `window` is not available during SSR — path is omitted in that case.
    path: typeof window !== "undefined" ? window.location.pathname : undefined,
    createdAt: new Date().toISOString(),
  };

  apiClient<void>("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  }).catch(() => {
    // silent — logging failures must never crash the UI
  });
}
