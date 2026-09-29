import { useEffect, useMemo, useState } from "react";
import type { Branch, Service, Appointment } from "../../../types/models";
import styles from "./AppointmentModal.module.css";
import { validators } from "../../../utils/validators";
import type { AppointmentWithDisplay } from "../../../hooks/useAppointments";

interface Client {
  idClient: number;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  withAppointment?: boolean;
}

interface NewClientData {
  name: string;
  lastName: string;
  phone: string;
  email: string;
}

interface AppointmentFormData {
  idClient?: number;
  newClient?: NewClientData;
  vehiclePlate: string;
  vehicleBrand: string;
  date: string;
  time: string;
  status: string;
  idBranch: number;
  serviceIds: number[];
  observations: string;
}

interface AppointmentModalProps {
  appointment?: Appointment | null;
  branches: Branch[];
  services: Service[];
  appointments?: AppointmentWithDisplay[];
  isPublic?: boolean;
  onSave: (data: AppointmentFormData) => void;
  onClose: () => void;
  onShowError?: (message: string) => void;
}

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "https://localhost:7265";

export const AppointmentModal = ({
  appointment,
  branches,
  services,
  appointments = [],
  isPublic = false,
  onSave,
  onClose,
  onShowError,
}: AppointmentModalProps) => {
  const isEditing = !!appointment;

  const stepTitles = isEditing
    ? ["Vehículo", "Fecha y Hora", "Servicios", "Confirmar"]
    : ["Cliente", "Vehículo", "Fecha y Hora", "Servicios", "Confirmar"];

  const stepVehicle = isEditing ? 1 : 2;
  const stepDate = isEditing ? 2 : 3;
  const stepServices = isEditing ? 3 : 4;
  const stepConfirm = isEditing ? 4 : 5;
  const maxSteps = stepConfirm;

  const [step, setStep] = useState(1);

  const blankClient: NewClientData = useMemo(
    () => ({ name: "", lastName: "", phone: "", email: "" }),
    []
  );

  const initialFormData: AppointmentFormData = useMemo(
    () => ({
      idClient: undefined,
      newClient: undefined,
      vehiclePlate: "",
      vehicleBrand: "",
      date: "",
      time: "",
      status: "Pendiente",
      idBranch: 0,
      serviceIds: [],
      observations: "",
    }),
    []
  );

  const [formData, setFormData] =
    useState<AppointmentFormData>(initialFormData);

  const [clientMode, setClientMode] = useState<"existing" | "new">(
    isPublic ? "new" : "existing"
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsError, setClientsError] = useState<string | null>(null);

  const selectedClient = useMemo(() => {
    if (!formData.idClient) return null;
    return clients.find((c) => c.idClient === formData.idClient) ?? null;
  }, [clients, formData.idClient]);

  useEffect(() => {
    if (!isEditing) return;

    setFormData({
      idClient: undefined,
      newClient: undefined,
      vehiclePlate: appointment?.vehiclePlate ?? "",
      vehicleBrand: appointment?.vehicleBrand ?? "",
      date: appointment?.date ? appointment.date.split("T")[0] : "",
      time: appointment?.time ? appointment.time.substring(0, 5) : "",
      status: appointment?.status ?? "Pendiente",
      idBranch: appointment?.idBranch ?? 0,
      serviceIds: appointment?.services?.map((s) => s.idService!) || [],
      observations: appointment?.observations || "",
    });

    setStep(1);
  }, [appointment, isEditing]);

  useEffect(() => {
    if (isEditing || isPublic) return;

    const ac = new AbortController();
    setClientsLoading(true);
    setClientsError(null);

    fetch(`${API_BASE}/api/Client`, {
      method: "GET",
      headers: { accept: "*/*" },
      signal: ac.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Error cargando clientes (${res.status})`);
        }
        return res.json();
      })
      .then((data: Client[]) => {
        setClients(Array.isArray(data) ? data : []);
      })
      .catch((e: any) => {
        if (e?.name === "AbortError") return;
        setClientsError(e?.message ?? "Error cargando clientes");
      })
      .finally(() => setClientsLoading(false));

    return () => ac.abort();
  }, [isEditing, isPublic]);

  useEffect(() => {
    if (isEditing) return;

    if (clientMode === "existing") {
      setFormData((prev) => ({
        ...prev,
        idClient: prev.idClient ?? undefined,
        newClient: selectedClient
          ? {
            name: selectedClient.name ?? "",
            lastName: selectedClient.lastName ?? "",
            phone: selectedClient.phone ?? "",
            email: selectedClient.email ?? "",
          }
          : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        idClient: undefined,
        newClient: prev.newClient ?? { ...blankClient },
      }));
    }
  }, [clientMode, isEditing, blankClient, selectedClient]);

  const handleNext = () => {
    if (!isEditing && step === 1) {
      if (clientMode === "existing") {
        if (!formData.idClient || formData.idClient <= 0) {
          onShowError?.("Selecciona un cliente existente");
          return;
        }
      } else {
        const nc = formData.newClient;
        if (!nc) {
          onShowError?.("Completa los datos del cliente");
          return;
        }
        if (
          !nc.name.trim() ||
          !nc.lastName.trim() ||
          !nc.phone.trim() ||
          !nc.email.trim()
        ) {
          onShowError?.("Completa todos los campos del cliente");
          return;
        }
        if (nc.phone.trim().length !== 8) {
          onShowError?.("El teléfono debe tener 8 dígitos");
          return;
        }
        if (!nc.email.includes("@")) {
          onShowError?.("Email inválido");
          return;
        }
      }
    }

    if (step === stepVehicle) {
      if (!formData.vehiclePlate || !formData.vehicleBrand) {
        onShowError?.("Completa los datos del vehículo");
        return;
      }

      if (!validators.licensePlate(formData.vehiclePlate)) {
        onShowError?.("Formato de placa inválido. Usa ABC123 o ABC-123");
        return;
      }
    }

    if (step === stepDate) {
      if (!formData.date || !formData.time || formData.idBranch === 0) {
        onShowError?.("Completa fecha, hora y sucursal");
        return;
      }

      if (!isEditing && !validators.futureDate(formData.date)) {
        onShowError?.("La fecha debe ser hoy o posterior");
        return;
      }
    }

    setStep((s) => Math.min(s + 1, maxSteps));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (formData.serviceIds.length === 0) {
      onShowError?.("Selecciona al menos un servicio");
      return;
    }

    const dataToSend: AppointmentFormData = {
      ...formData,
      time: formData.time.length === 5 ? `${formData.time}:00` : formData.time,
    };

    if (!isEditing) {
      if (clientMode === "existing") {
        if (!dataToSend.idClient || dataToSend.idClient <= 0) {
          onShowError?.("Selecciona un cliente existente");
          return;
        }
        delete (dataToSend as any).newClient;
      } else {
        const nc = dataToSend.newClient;
        if (
          !nc ||
          !nc.name.trim() ||
          !nc.lastName.trim() ||
          !nc.phone.trim() ||
          !nc.email.trim()
        ) {
          onShowError?.("Completa los datos del cliente");
          return;
        }
        delete (dataToSend as any).idClient;
      }
    } else {
      delete (dataToSend as any).idClient;
      delete (dataToSend as any).newClient;
    }

    onSave(dataToSend);
  };

  const toggleService = (idService: number) => {
    setFormData((prev) => {
      const exists = prev.serviceIds.includes(idService);
      return {
        ...prev,
        serviceIds: exists
          ? prev.serviceIds.filter((id) => id !== idService)
          : [...prev.serviceIds, idService],
      };
    });
  };

  const titleText = stepTitles[step - 1];

  const displayClientForSummary = useMemo(() => {
    if (isEditing) return null;
    if (clientMode === "existing") return selectedClient;
    return formData.newClient ?? null;
  }, [clientMode, formData.newClient, isEditing, selectedClient]);

  const clientFieldsDisabled = !isEditing && clientMode === "existing";

  const parseSchedule = (
    schedule: string
  ): { start: string; end: string } | null => {
    try {
      const match = schedule.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
      if (!match) return { start: "08:00", end: "17:00" };
      return { start: match[1].padStart(5, "0"), end: match[2].padStart(5, "0") };
    } catch {
      return { start: "08:00", end: "17:00" };
    }
  };

  const generateSlots = (start: string, end: string): string[] => {
    if (!start || !end) return [];

    const slots: string[] = [];
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    if (
      isNaN(startH) ||
      isNaN(startM) ||
      isNaN(endH) ||
      isNaN(endM)
    )
      return [];

    let currentH = startH;
    let currentM = startM;

    const maxIterations = 48;
    let iterations = 0;

    while (
      currentH < endH ||
      (currentH === endH && currentM <= endM)
    ) {
      if (iterations++ > maxIterations) break;
      slots.push(
        `${String(currentH).padStart(2, "0")}:${String(currentM).padStart(
          2,
          "0"
        )}`
      );
      currentM += 30;
      if (currentM >= 60) {
        currentM -= 60;
        currentH += 1;
      }
    }

    return slots;
  };

  const getOccupiedTimes = (date: string, idBranch: number): string[] => {
    return appointments
      .filter(
        (apt) =>
          apt.date.split("T")[0] === date &&
          apt.idBranch === idBranch &&
          apt.idAppointment !== appointment?.idAppointment
      )
      .map((apt) => apt.time.substring(0, 5));
  };

  const getAvailableSlots = (): string[] => {
    if (!formData.idBranch || !formData.date) return [];

    const branch = branches.find((b) => b.idBranch === formData.idBranch);
    if (!branch?.schedule) return [];

    const times = parseSchedule(branch.schedule);
    if (!times) return [];

    const allSlots = generateSlots(times.start, times.end);

    return allSlots.filter(
      (slot) =>
        !getOccupiedTimes(formData.date, formData.idBranch).includes(slot)
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {isEditing ? "Editar Cita" : isPublic ? "Agendar Cita" : "Nueva Cita"} - {titleText}
        </h2>

        <div className={styles.stepper}>
          {Array.from({ length: maxSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`${styles.stepDot} ${s === step ? styles.active : ""} ${s < step ? styles.completed : ""
                }`}
            >
              {s}
            </div>
          ))}
        </div>

        <div className={styles.stepContent}>
          {!isEditing && step === 1 && (
            <div className={styles.form}>
              <h3 style={{ fontSize: "16px", marginBottom: "15px" }}>
                Datos de Contacto
              </h3>

              {!isPublic && (
                <>
                  <label className={styles.label}>Tipo de cliente:</label>
                  <select
                    value={clientMode}
                    onChange={(e) =>
                      setClientMode(e.target.value as "existing" | "new")
                    }
                    className={styles.input}
                  >
                    <option value="existing">Cliente existente</option>
                    <option value="new">Cliente nuevo</option>
                  </select>
                </>
              )}

              {clientMode === "existing" && (
                <>
                  <label className={styles.label}>Cliente existente:</label>
                  <select
                    value={formData.idClient ?? 0}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const c =
                        clients.find((x) => x.idClient === id) ?? null;

                      setFormData((prev) => ({
                        ...prev,
                        idClient: id > 0 ? id : undefined,
                        newClient: c
                          ? {
                            name: c.name ?? "",
                            lastName: c.lastName ?? "",
                            phone: c.phone ?? "",
                            email: c.email ?? "",
                          }
                          : undefined,
                      }));
                    }}
                    className={styles.input}
                    disabled={clientsLoading}
                  >
                    <option value={0}>
                      {clientsLoading
                        ? "Cargando clientes..."
                        : "-- Selecciona un cliente --"}
                    </option>
                    {clients.map((c) => (
                      <option key={c.idClient} value={c.idClient}>
                        {c.name} {c.lastName} - {c.phone}
                      </option>
                    ))}
                  </select>

                  {clientsError && (
                    <div className={styles.errorBox}>{clientsError}</div>
                  )}

                  <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.newClient?.name || ""}
                    className={styles.input}
                    disabled={clientFieldsDisabled}
                    readOnly={clientFieldsDisabled}
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={formData.newClient?.lastName || ""}
                    className={styles.input}
                    disabled={clientFieldsDisabled}
                    readOnly={clientFieldsDisabled}
                  />
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={formData.newClient?.phone || ""}
                    className={styles.input}
                    disabled={clientFieldsDisabled}
                    readOnly={clientFieldsDisabled}
                  />
                  <input
                    type="email"
                    placeholder="Correo"
                    value={formData.newClient?.email || ""}
                    className={styles.input}
                    disabled={clientFieldsDisabled}
                    readOnly={clientFieldsDisabled}
                  />
                </>
              )}

              {clientMode === "new" && (
                <>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.newClient?.name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newClient: {
                          ...(prev.newClient ?? { ...blankClient }),
                          name: e.target.value,
                        },
                      }))
                    }
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={formData.newClient?.lastName || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newClient: {
                          ...(prev.newClient ?? { ...blankClient }),
                          lastName: e.target.value,
                        },
                      }))
                    }
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Teléfono (8 dígitos)"
                    maxLength={8}
                    value={formData.newClient?.phone || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newClient: {
                          ...(prev.newClient ?? { ...blankClient }),
                          phone: e.target.value.replace(/\D/g, ""),
                        },
                      }))
                    }
                    className={styles.input}
                  />
                  <input
                    type="email"
                    placeholder="Correo"
                    value={formData.newClient?.email || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newClient: {
                          ...(prev.newClient ?? { ...blankClient }),
                          email: e.target.value,
                        },
                      }))
                    }
                    className={styles.input}
                  />
                </>
              )}
            </div>
          )}

          {step === stepVehicle && (
            <div className={styles.form}>
              <h3 style={{ fontSize: "16px", marginBottom: "15px" }}>
                Datos del Vehículo
              </h3>
              <input
                type="text"
                placeholder="Placa del vehículo"
                value={formData.vehiclePlate}
                maxLength={9}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehiclePlate: e.target.value.toUpperCase(),
                  })
                }
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Marca del vehículo"
                value={formData.vehicleBrand}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicleBrand: e.target.value,
                  })
                }
                className={styles.input}
              />
            </div>
          )}

          {step === stepDate && (
            <div className={styles.form}>
              <label className={styles.label}>Sucursal:</label>
              <select
                value={formData.idBranch}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idBranch: Number(e.target.value),
                    time: "",
                  })
                }
                className={styles.input}
              >
                <option value={0}>-- Selecciona una sucursal --</option>
                {branches.map((b) => (
                  <option key={b.idBranch} value={b.idBranch}>
                    {b.name}
                  </option>
                ))}
              </select>

              <label className={styles.label}>Fecha:</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value,
                    time: "",
                  })
                }
                className={styles.input}
              />

              <label className={styles.label}>Hora:</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={styles.input}
                disabled={!formData.idBranch || !formData.date}
              >
                <option value="">
                  {!formData.idBranch || !formData.date
                    ? "-- Selecciona sucursal y fecha primero --"
                    : "-- Selecciona una hora --"}
                </option>
                {getAvailableSlots().map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {isEditing && (
                <>
                  <label className={styles.label}>Estado:</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
                      })
                    }
                    className={styles.input}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </>
              )}
            </div>
          )}

          {step === stepServices && (
            <div className={styles.form}>
              <label className={styles.label}>
                Selecciona los servicios:
              </label>
              <div className={styles.serviceList}>
                {services.map((s) => (
                  <label key={s.idService} className={styles.serviceItem}>
                    <input
                      type="checkbox"
                      checked={formData.serviceIds.includes(s.idService!)}
                      onChange={() => toggleService(s.idService!)}
                    />
                    <span>
                      {s.name} - ₡{s.basePrice.toLocaleString("es-CR")}
                    </span>
                  </label>
                ))}
              </div>

              <label className={styles.label}>Observaciones:</label>
              <textarea
                placeholder="Observaciones adicionales..."
                value={formData.observations}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    observations: e.target.value,
                  })
                }
                className={styles.textarea}
                rows={4}
              />
            </div>
          )}

          {step === stepConfirm && (
            <div className={styles.summary}>
              <h3>Resumen de la cita</h3>

              {!isEditing && displayClientForSummary && (
                <>
                  {"idClient" in (displayClientForSummary as any) ? (
                    <>
                      <p>
                        <strong>Cliente:</strong>{" "}
                        {(displayClientForSummary as Client).name}{" "}
                        {(displayClientForSummary as Client).lastName}
                      </p>
                      <p>
                        <strong>Teléfono:</strong>{" "}
                        {(displayClientForSummary as Client).phone}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {(displayClientForSummary as Client).email}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Cliente:</strong>{" "}
                        {(displayClientForSummary as NewClientData).name}{" "}
                        {(displayClientForSummary as NewClientData).lastName}
                      </p>
                      <p>
                        <strong>Teléfono:</strong>{" "}
                        {(displayClientForSummary as NewClientData).phone}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {(displayClientForSummary as NewClientData).email}
                      </p>
                    </>
                  )}
                </>
              )}

              {isEditing && appointment && (
                <>
                  <p>
                    <strong>Cliente:</strong> {appointment.client?.name}{" "}
                    {appointment.client?.lastName}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {appointment.client?.phone}
                  </p>
                </>
              )}

              <p>
                <strong>Vehículo:</strong> {formData.vehicleBrand} -{" "}
                {formData.vehiclePlate}
              </p>
              <p>
                <strong>Fecha:</strong> {formData.date} a las {formData.time}
              </p>
              {isEditing && (
                <p>
                  <strong>Estado:</strong> {formData.status}
                </p>
              )}
              <p>
                <strong>Sucursal:</strong>{" "}
                {branches.find((b) => b.idBranch === formData.idBranch)?.name}
              </p>

              <p>
                <strong>Servicios:</strong>
              </p>
              <ul>
                {formData.serviceIds.map((id) => {
                  const service = services.find((s) => s.idService === id);
                  return (
                    <li key={id}>
                      {service?.name} - ₡
                      {service?.basePrice.toLocaleString("es-CR")}
                    </li>
                  );
                })}
              </ul>

              {formData.observations && (
                <p>
                  <strong>Observaciones:</strong> {formData.observations}
                </p>
              )}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.btnCancel}
          >
            Cancelar
          </button>

          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className={styles.btnBack}
            >
              ← Atrás
            </button>
          )}

          {step < maxSteps && (
            <button
              type="button"
              onClick={handleNext}
              className={styles.btnNext}
            >
              Siguiente →
            </button>
          )}

          {step === maxSteps && (
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.btnSubmit}
            >
              {isEditing ? "Actualizar Cita" : "Confirmar Cita"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};