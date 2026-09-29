// src/services/api/branchService.ts
import type { Branch } from "../../types/models";
import { apiRequest } from "./apiClient";

export const branchService = {
  getAll: () => apiRequest<Branch[]>("/api/Branch"),

  getById: (id: number) => apiRequest<Branch>(`/api/Branch/${id}`),

  create: (branch: Branch) =>
    apiRequest<Branch>("/api/Branch", {
      method: "POST",
      body: JSON.stringify(branch),
    }),

  update: (id: number, branch: Branch) =>
    apiRequest<void>(`/api/Branch/${id}`, {
      method: "PUT",
      body: JSON.stringify(branch),
    }),

  delete: (id: number) =>
    apiRequest<void>(`/api/Branch/${id}`, {
      method: "DELETE",
    }),
};