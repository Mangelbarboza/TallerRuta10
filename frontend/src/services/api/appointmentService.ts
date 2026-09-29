import { apiRequest } from "./apiClient";
import type { Appointment } from "../../types/models";

interface CreateAppointmentDTO {
  date: string;
  time: string;
  status: string;
  observations: string;
  idBranch: number;
  idClient?: number;
  newClient?: {
    name: string;
    lastName: string;
    phone: string;
    email: string;
  };
  vehiclePlate: string;
  vehicleBrand: string;
  serviceIds?: number[];
}

interface UpdateAppointmentDTO {
  date: string;
  time: string;
  status: string;
  observations: string;
  idBranch: number;
  vehiclePlate: string;
  vehicleBrand: string;
  serviceIds?: number[];
}

export const appointmentService = {
  getAll: () => apiRequest<Appointment[]>("/api/Appointment"),

  create: (dto: CreateAppointmentDTO) =>
    apiRequest<Appointment>("/api/Appointment", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  update: (id: number, dto: UpdateAppointmentDTO) =>
    apiRequest<void>(`/api/Appointment/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),

  delete: (id: number) =>
    apiRequest<void>(`/api/Appointment/${id}`, {
      method: "DELETE",
    }),
};