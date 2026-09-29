export const API_BASE = "https://localhost:7265";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("jwt");

  const headers = new Headers(options.headers);

  // No forces Content-Type si mandas FormData
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

  // Si el back dice 401, limpiamos sesión (así el RequireAuth te saca del admin)
  if (res.status === 401) {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwt_expiration");
    localStorage.removeItem("adminAuth");
  }

  return res;
}