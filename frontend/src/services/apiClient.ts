const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
}

export async function apiClient<T>(path: string, init?: Omit<RequestInit, "cache">): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, cache: "no-store" });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw Object.assign(new Error(error?.error?.message ?? response.statusText), {
      status: response.status,
      code: error?.error?.code ?? "UNKNOWN_ERROR",
    });
  }

  const json = await response.json();
  return json.data as T;
}
