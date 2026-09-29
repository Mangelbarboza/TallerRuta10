import { useState } from "react";
import { ModuleTemplate } from "../../components/templates/ModuleTemplate";
import { GenericTable } from "../../components/organisms/GenericTable";
import { ConfirmDeleteModal } from "../../components/molecules/ConfirmDeleteModal";
import { FeedbackModal } from "../../components/molecules/FeedbackModal";
import { AppointmentModal } from "../../components/molecules/AppointmentModal/AppointmentModal";
import { useAppointments } from "../../hooks/useAppointments";
import type { AppointmentWithDisplay } from "../../hooks/useAppointments";
import { DetailModal } from "../../components/molecules/DetailModal";

export const Citas = () => {
  const [viewAppointment, setViewAppointment] = useState<AppointmentWithDisplay | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const {
    appointments,
    branches,
    services,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppointments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithDisplay | null>(null);

  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentWithDisplay | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const columns: { header: string; key: keyof AppointmentWithDisplay }[] = [
    { header: "Fecha", key: "formattedDate" },
    { header: "Hora", key: "time" },
    { header: "Cliente", key: "clientName" },
    { header: "Vehículo", key: "vehiclePlate" },
    { header: "Sucursal", key: "branchName" },
    { header: "Estado", key: "status" },
  ];

  const handleCreate = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (appointment: AppointmentWithDisplay) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleView = (appointment: AppointmentWithDisplay) => {
    setViewAppointment(appointment);
    setIsViewOpen(true);
  };

  const requestDeleteAppointment = (appointment: AppointmentWithDisplay) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete?.idAppointment) return;

    try {
      await deleteAppointment(appointmentToDelete.idAppointment);

      setFeedbackTitle("Cita eliminada");
      setFeedbackMessage(`La cita de ${appointmentToDelete.clientName} se eliminó correctamente.`);
      setFeedbackType("success");
    } catch (error) {
      setFeedbackTitle("Error");
      setFeedbackMessage("No se pudo eliminar la cita.");
      setFeedbackType("error");
    } finally {
      setIsDeleteModalOpen(false);
      setAppointmentToDelete(null);
      setFeedbackOpen(true);
    }
  };

  const handleShowError = (message: string) => {
    setFeedbackTitle("Atención");
    setFeedbackMessage(message);
    setFeedbackType("error");
    setFeedbackOpen(true);
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingAppointment?.idAppointment) {
        await updateAppointment(editingAppointment.idAppointment, formData);
        setFeedbackTitle("Cita actualizada");
        setFeedbackMessage("La cita se actualizó correctamente.");
        setFeedbackType("success");
      } else {
        await createAppointment(formData);
        setFeedbackTitle("Cita creada");
        setFeedbackMessage("La cita se creó correctamente.");
        setFeedbackType("success");
      }
      setIsModalOpen(false);
      setFeedbackOpen(true);
    } catch (error) {
      setFeedbackTitle("Error");
      setFeedbackMessage("No se pudo guardar la cita.");
      setFeedbackType("error");
      setFeedbackOpen(true);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (appointment.clientName ?? "").toLowerCase().includes(term) ||
      appointment.vehiclePlate.toLowerCase().includes(term) ||
      (appointment.branchName ?? "").toLowerCase().includes(term) ||
      appointment.status.toLowerCase().includes(term);

    const matchesBranch =
      selectedBranch === null || appointment.idBranch === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  return (
    <>
      <ModuleTemplate title="Gestión de Citas" buttonText="Nueva Cita" onAddClick={handleCreate}>
        <div style={topBarStyle}>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Buscar por cliente, placa, sucursal o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={clearButtonStyle}>
                Borrar
              </button>
            )}
          </div>

          <select
            value={selectedBranch ?? ""}
            onChange={(e) => setSelectedBranch(e.target.value ? Number(e.target.value) : null)}
            style={selectStyle}
          >
            <option value="">Todas las sucursales</option>
            {branches.map((branch) => (
              <option key={branch.idBranch} value={branch.idBranch}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <GenericTable
          columns={columns}
          data={filteredAppointments}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={requestDeleteAppointment}
          onView={handleView}
        />
      </ModuleTemplate>

      {isModalOpen && (
        <AppointmentModal
          appointment={editingAppointment}
          branches={branches}
          services={services}
          appointments={appointments}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
          onShowError={handleShowError}
        />
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        message={`¿Deseas eliminar la cita de ${appointmentToDelete?.clientName}?`}
        onConfirm={confirmDeleteAppointment}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setAppointmentToDelete(null);
        }}
      />

      <FeedbackModal
        isOpen={feedbackOpen}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        duration={2500}
        onClose={() => setFeedbackOpen(false)}
      />

      <DetailModal
        isOpen={isViewOpen}
        title="Detalle de Cita"
        data={viewAppointment}
        fields={[
          { label: "Fecha", key: "formattedDate" },
          { label: "Hora", key: "time" },
          { label: "Cliente", key: "clientName" },
          { label: "Vehículo", key: "vehiclePlate" },
          { label: "Sucursal", key: "branchName" },
          { label: "Estado", key: "status" },
        ]}
        onClose={() => {
          setIsViewOpen(false);
          setViewAppointment(null);
        }}
      />
    </>
  );
};

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  gap: "12px",
};

const searchWrapperStyle = {
  position: "relative" as const,
  width: "420px",
};

const searchInputStyle = {
  width: "100%",
  padding: "12px 40px 12px 15px",
  borderRadius: "8px",
  border: "1px solid #dcdcdc",
  fontSize: "14px",
  outline: "none",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const clearButtonStyle = {
  position: "absolute" as const,
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  color: "#999",
};

const selectStyle = {
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #dcdcdc",
  fontSize: "14px",
  outline: "none",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  cursor: "pointer",
  minWidth: "200px",
};