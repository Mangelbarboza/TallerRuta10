export type AppointmentStatus =
  | "Pendiente"
  | "Confirmada"
  | "En Proceso"
  | "Completada"
  | "Cancelada";

export interface AppointmentN {
  id: number;
  dateTime: string;
  status: AppointmentStatus | string;
  branchId?: number;
  branchName?: string;
  clientName?: string;
  serviceName?: string;
  observations?: string;
  vehiclePlate?: string;
  vehicleBrand?: string;
}

export interface BranchN {
  id: number;
  name: string;
}

export interface EmployeeN {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  idBranch?: number;
  branchName?: string;
  isActive: boolean;
}

export interface OfferN {
  id: number;
  startDate: string;
  endDate: string;
  discount?: number;
  isActive: boolean;
}