import { useState, useEffect } from "react";
import { appointmentService } from "../services/api/appointmentService";
import type { Appointment, Branch, Service } from "../types/models";

export type AppointmentWithDisplay = Appointment & {
    clientName?: string;
    branchName?: string;
    formattedDate?: string;
};

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<AppointmentWithDisplay[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await appointmentService.getAll();
            const formatted: AppointmentWithDisplay[] = data.map(apt => ({
                ...apt,
                clientName: apt.client
                    ? `${apt.client.name} ${apt.client.lastName}`
                    : 'N/A',
                branchName: apt.branch?.name,
                formattedDate: new Date(apt.date).toLocaleDateString('es-CR'),
            }));

            setAppointments(formatted);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await fetch('https://localhost:7265/api/Branch');
            if (response.ok) {
                const data = await response.json();
                const filtered = data.filter((b: Branch) => b.isActive);
                setBranches(filtered);
            }
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await fetch('https://localhost:7265/api/Service');
            if (response.ok) {
                const data = await response.json();
                setServices(data.filter((s: Service) => s.isActive));
            }
        } catch (error) {
            console.error('Error al cargar servicios:', error);
        }
    };

    const createAppointment = async (formData: any) => {
  const dto: any = {
    date: formData.date,
    time: formData.time?.length === 5 ? `${formData.time}:00` : formData.time,
    status: "Pendiente",
    observations: formData.observations,
    idBranch: formData.idBranch,
    vehiclePlate: formData.vehiclePlate,
    vehicleBrand: formData.vehicleBrand,
    serviceIds: formData.serviceIds,
  };


  if (formData.idClient && Number(formData.idClient) > 0) {
    dto.idClient = Number(formData.idClient);
  } else {
 
    const nc = formData.newClient;
    if (nc) {
      dto.newClient = {
        name: (nc.name ?? "").trim(),
        lastName: (nc.lastName ?? "").trim(),
        phone: (nc.phone ?? "").trim(),
        email: (nc.email ?? "").trim().toLowerCase(),
      };
    }
  }

  await appointmentService.create(dto);
  await fetchAppointments();
};

    const updateAppointment = async (id: number, formData: any) => {
        const dto = {
            date: formData.date,
            time: formData.time.length === 5 ? `${formData.time}:00` : formData.time,
            status: formData.status,
            observations: formData.observations,
            idBranch: formData.idBranch,
            vehiclePlate: formData.vehiclePlate,
            vehicleBrand: formData.vehicleBrand,
            serviceIds: formData.serviceIds,
        };

        await appointmentService.update(id, dto);
        await fetchAppointments();
    };

    const deleteAppointment = async (id: number) => {
        await appointmentService.delete(id);
        await fetchAppointments();
    };

    useEffect(() => {
        fetchAppointments();
        fetchBranches();
        fetchServices();
    }, []);

    return {
        appointments,
        loading,
        error,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        branches,
        services
    };
}