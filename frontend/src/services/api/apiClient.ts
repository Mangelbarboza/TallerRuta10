// src/services/api/apiClient.ts
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7265";

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("jwt");

  const headers = new Headers(options.headers);

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    // Si el token no sirve / expiró
    if (res.status === 401) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("jwt_expiration");
      localStorage.removeItem("adminAuth");
    }

    // Intentar leer mensaje del backend
    let msg = `Error ${res.status}`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {
      const t = await res.text().catch(() => "");
      if (t) msg = t;
    }
    throw new Error(msg);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}