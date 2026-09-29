import type { AppointmentN, BranchN, EmployeeN, OfferN } from "./types";

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function withinDaysFromNow(iso: string, days: number) {
  const target = new Date(iso).getTime();
  const now = new Date().getTime();
  const diffDays = (target - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

export function combineDateTime(rawDate: any, rawTime: any) {
  try {
    if (!rawDate) return null;
    const datePart = String(rawDate).split("T")[0];
    if (!rawTime) return `${datePart}T00:00:00`;
    const timePart = String(rawTime).slice(0, 8);
    return `${datePart}T${timePart}`;
  } catch {
    return null;
  }
}

export function normalizeAppointment(raw: any): AppointmentN {
  const id = Number(raw?.idAppointment ?? raw?.id ?? raw?.appointmentId) || 0;
  const combined = combineDateTime(raw?.date, raw?.time);
  const dateTime =
    combined ??
    raw?.dateTime ??
    raw?.appointmentDate ??
    raw?.startDate ??
    raw?.date ??
    new Date().toISOString();

  const status = (raw?.status ?? raw?.state ?? raw?.appointmentStatus ?? "Pendiente") as string;
  const branchId = raw?.idBranch ?? raw?.branchId ?? raw?.IdBranch ?? raw?.BranchId;
  const branchName = raw?.branch?.name ?? raw?.Branch?.Name ?? raw?.branchName;

  const clientName =
    raw?.clientName ??
    (raw?.client?.name || raw?.client?.lastName
      ? `${raw?.client?.name ?? ""} ${raw?.client?.lastName ?? ""}`.trim()
      : undefined);

  const serviceName =
    raw?.serviceName ??
    raw?.service?.name ??
    raw?.Service?.Name ??
    raw?.serviceTitle ??
    "Servicio";

  return {
    id,
    dateTime: String(dateTime),
    status,
    branchId: branchId !== undefined ? Number(branchId) : undefined,
    branchName: branchName ? String(branchName) : undefined,
    clientName: clientName ? String(clientName) : undefined,
    serviceName: serviceName ? String(serviceName) : undefined,
    observations: raw?.observations ? String(raw.observations) : undefined,
    vehiclePlate: raw?.vehiclePlate ? String(raw.vehiclePlate) : undefined,
    vehicleBrand: raw?.vehicleBrand ? String(raw.vehicleBrand) : undefined,
  };
}

export function normalizeBranch(raw: any): BranchN {
  const id = Number(raw?.idBranch ?? raw?.id ?? raw?.branchId) || 0;
  const name = String(raw?.name ?? raw?.branchName ?? raw?.Name ?? "Sucursal");
  return { id, name };
}

export function normalizeEmployee(raw: any): EmployeeN {
  const id = Number(raw?.idEmployee ?? raw?.id ?? raw?.employeeId) || 0;
  const name = String(raw?.name ?? raw?.fullName ?? "Empleado");
  const phone = raw?.phoneNumber ?? raw?.phone ?? raw?.PhoneNumber;
  const email = raw?.email ?? raw?.Email;
  const idBranch = raw?.idBranch ?? raw?.branchId ?? raw?.IdBranch;
  const isActive = raw?.isActive !== false;
  const branchName = raw?.branch?.name ?? raw?.branch?.Name ?? raw?.branchName;

  return {
    id,
    name,
    phone: phone ? String(phone) : undefined,
    email: email ? String(email) : undefined,
    idBranch: idBranch !== undefined ? Number(idBranch) : undefined,
    branchName: branchName ? String(branchName) : undefined,
    isActive,
  };
}

export function normalizeOffer(raw: any): OfferN {
  const id = Number(raw?.idOffer ?? raw?.id ?? raw?.offerId) || 0;
  const startDate = String(raw?.startDate ?? raw?.StartDate ?? new Date().toISOString());
  const endDate = String(raw?.endDate ?? raw?.EndDate ?? new Date().toISOString());
  const discount = raw?.discount !== undefined ? Number(raw.discount) : undefined;
  const isActive = raw?.isActive !== false;
  return { id, startDate, endDate, discount, isActive };
}