import { apiClient } from "./apiClient";
import type { FrontendLogEntry } from "../types/api";

export function logError(message: string, source: string, details?: string): void {
  console.error(`[${source}] ${message}`, details ?? "");

  const entry: FrontendLogEntry = {
    level: "error",
    message,
    source,
    details,
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
