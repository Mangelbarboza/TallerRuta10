import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ModuleTemplate } from "../../components/templates/ModuleTemplate";
import { GenericTable } from "../../components/organisms/GenericTable";
import { DetailModal } from "../../components/molecules/DetailModal";
import { ConfirmDeleteModal } from "../../components/molecules/ConfirmDeleteModal";
import { apiFetch } from '../../services/api/apiFetch';
import { FeedbackModal } from '../../components/molecules/FeedbackModal';

// =======================
// MODELO
// =======================
interface Client {
  idClient?: number;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  withAppointment: boolean;
  isActive: boolean;

  // UI
  withAppointmentDisplay?: string;
}

export const Clientes = () => {
  // =======================
  // ESTADOS
  // =======================
  const [searchTerm, setSearchTerm] = useState("");
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteBlocked, setDeleteBlocked] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  const initialState: Client = {
    name: "",
    lastName: "",
    phone: "",
    email: "",
    withAppointment: false,
    isActive: true,
  };

  const [formClient, setFormClient] = useState<Client>(initialState);

  // COLUMNAS
  const columns: { header: string; key: keyof Client }[] = [
    { header: "Nombre", key: "name" },
    { header: "Apellido", key: "lastName" },
    { header: "Teléfono", key: "phone" },
    { header: "Correo", key: "email" },
  ];

  // API
  const fetchClients = async () => {
    try {
      const res = await apiFetch('/api/Client');
      const data: Client[] = await res.json();
      const formatted = data.map((c) => ({
        ...c,
        withAppointmentDisplay: c.withAppointment ? 'Sí' : 'No',
      }));
      setClients(formatted);
    } catch (error) {
      console.error('Error al cargar clientes', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();

    return (
      client.name.toLowerCase().includes(term) ||
      client.lastName.toLowerCase().includes(term) ||
      client.phone.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term)
    );
  });

  const saveClient = async () => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/api/Client/${editingId}` : '/api/Client';

      const body = {
        name: formClient.name,
        lastName: formClient.lastName,
        phone: formClient.phone,
        email: formClient.email,
        isActive: true,
      };

      const res = await apiFetch(path, {
        method,
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      fetchClients();
      closeModal();

      setFeedbackTitle(editingId ? 'Cliente actualizado' : 'Cliente creado');
      setFeedbackMessage(
        editingId
          ? 'El cliente se actualizó correctamente.'
          : 'El cliente se guardó correctamente.'
      );
      setFeedbackType('success');
      setFeedbackOpen(true);

    } catch (error: any) {
      setFeedbackTitle('Error');

      if (error?.message?.includes("teléfono")) {
        setFeedbackMessage("El teléfono ya está registrado.");
      }
      else if (error?.message?.includes("correo")) {
        setFeedbackMessage("El correo ya está registrado.");
      }
      else {
        setFeedbackMessage(error.message || "No se pudo guardar el cliente.");
      }

      setFeedbackType('error');
      setFeedbackOpen(true);
    }
  };

  const deleteClient = (client: Client) => {
    if (client.withAppointment) {
      setClientToDelete(client);
      setDeleteBlocked(true);
      setIsDeleteOpen(true);
      return;
    }

    setClientToDelete(client);
    setDeleteBlocked(false);
    setIsDeleteOpen(true);
  };
  const confirmDeleteClient = async () => {
    if (!clientToDelete?.idClient) return;

    try {
      const res = await apiFetch(`/api/Client/${clientToDelete.idClient}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(await res.text());

      fetchClients();

      setFeedbackTitle('Cliente eliminado');
      setFeedbackMessage(
        `El cliente "${clientToDelete.name}" se eliminó correctamente.`
      );
      setFeedbackType('success');

    } catch (error) {
      setFeedbackTitle('Error');
      setFeedbackMessage('No se pudo eliminar el cliente. Intente nuevamente.');
      setFeedbackType('error');
    } finally {
      setIsDeleteOpen(false);
      setClientToDelete(null);
      setDeleteBlocked(false);
      setFeedbackOpen(true);
    }
  };

  // HANDLERS
  const handleCreate = () => {
    setEditingId(null);
    setFormClient(initialState);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.idClient || null);
    setFormClient(client);
    setIsModalOpen(true);
  };

  const handleView = (client: Client) => {
    setViewClient(client);
    setIsViewOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formClient.phone.length !== 8) {
      setFeedbackTitle('Teléfono inválido');
      setFeedbackMessage('El teléfono debe tener exactamente 8 dígitos.');
      setFeedbackType('error');
      setFeedbackOpen(true);
      return;
    }

    saveClient();
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // UI
  return (
    <>
      <ModuleTemplate
        title="Listado de Clientes"
        buttonText="Nuevo Cliente"
        onAddClick={handleCreate}
      >

        <div style={topBarStyle}>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Buscar cliente por nombre, teléfono o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={clearButtonStyle}
              >
                Borrar
              </button>
            )}
          </div>
        </div>
        <GenericTable
          columns={columns}
          data={filteredClients}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={deleteClient}
          onView={handleView}
        />
      </ModuleTemplate>

      {isModalOpen && (

        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ color: "#161A59" }}>
              {editingId ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <input
                type="text"
                placeholder="Nombre"
                required
                maxLength={20}
                value={formClient.name}
                onChange={(e) =>
                  setFormClient({ ...formClient, name: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Apellido"
                required
                maxLength={20}
                value={formClient.lastName}
                onChange={(e) =>
                  setFormClient({ ...formClient, lastName: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Teléfono"
                required
                maxLength={8}
                value={formClient.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                  setFormClient({ ...formClient, phone: value });
                }}
                style={inputStyle}
              />

              <input
                type="email"
                placeholder="Correo"
                required
                maxLength={30}
                value={formClient.email}
                onChange={(e) =>
                  setFormClient({ ...formClient, email: e.target.value })
                }
                style={inputStyle}
              />

              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
              >
                <button type="button" onClick={closeModal}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#161A59",
                    color: "white",
                    padding: "8px 20px",
                    borderRadius: "4px",
                    border: "none",
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DetailModal
        isOpen={isViewOpen}
        title="Detalle de Cliente"
        data={viewClient}
        fields={[
          { label: "Nombre", key: "name" },
          { label: "Apellido", key: "lastName" },
          { label: "Teléfono", key: "phone" },
          { label: "Correo", key: "email" },
          
        ]}
        onClose={() => {
          setIsViewOpen(false);
          setViewClient(null);
        }}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        title={deleteBlocked ? "Acción no permitida" : "Confirmar eliminación"}
        message={
          deleteBlocked
            ? "No se puede eliminar este cliente porque tiene una cita asignada."
            : `¿Seguro que deseas eliminar a ${clientToDelete?.name}?`
        }
        onlyClose={deleteBlocked}
        onConfirm={deleteBlocked ? undefined : confirmDeleteClient}
        onCancel={() => {
          setIsDeleteOpen(false);
          setClientToDelete(null);
          setDeleteBlocked(false);
        }}
      />

      <FeedbackModal
        isOpen={feedbackOpen}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        duration={2000}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
};

// ESTILOS
const overlayStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "400px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
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
  transition: "all 0.2s ease",
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