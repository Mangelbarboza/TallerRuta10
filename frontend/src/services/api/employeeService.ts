// src/services/api/employeeService.ts
import type { Employee } from "../../types/models";
import { apiRequest } from "./apiClient";

export const employeeService = {
  getAll: () => apiRequest<Employee[]>("/api/Employee"),

  getById: (id: number) => apiRequest<Employee>(`/api/Employee/${id}`),

  create: (employee: Employee) =>
    apiRequest<Employee>("/api/Employee", {
      method: "POST",
      body: JSON.stringify(employee),
    }),

  update: (id: number, employee: Employee) =>
    apiRequest<void>(`/api/Employee/${id}`, {
      method: "PUT",
      body: JSON.stringify(employee),
    }),

  delete: (id: number) =>
    apiRequest<void>(`/api/Employee/${id}`, {
      method: "DELETE",
    }),
};