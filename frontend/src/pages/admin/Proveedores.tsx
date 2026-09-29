import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ModuleTemplate } from "../../components/templates/ModuleTemplate";
import { GenericTable } from "../../components/organisms/GenericTable";
import { ConfirmDeleteModal } from "../../components/molecules/ConfirmDeleteModal";
import { FeedbackModal } from "../../components/molecules/FeedbackModal";
import { DetailModal } from "../../components/molecules/DetailModal";
import { apiFetch } from '../../services/api/apiFetch';

interface Supplier {
  idSupplier?: number;
  name: string;
  location: string;    
  phoneNumber: string;
  email: string;
  isActive: boolean;
}
type ApiSupplier = {
  idSupplier?: number;
  name?: string;

  manager?: string;
  location?: string;
  address?: string;

  phoneNumer?: string;
  phoneNumber?: string;
  phone?: string;

  email?: string;
  isActive?: boolean | number;
};

const normalizeSupplier = (item: ApiSupplier): Supplier => ({
  idSupplier: item.idSupplier,
  name: item.name ?? "",
  location: item.manager ?? item.location ?? item.address ?? "",
  phoneNumber: item.phoneNumer ?? item.phoneNumber ?? item.phone ?? "",
  email: item.email ?? "",
  isActive: item.isActive === undefined ? true : Boolean(item.isActive),
});

export const Proveedores = () => {

  // ESTADOS
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const initialSupplierState: Supplier = {
    name: "",
    location: "",
    phoneNumber: "",
    email: "",
    isActive: true,
  };

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formSupplier, setFormSupplier] = useState<Supplier>(initialSupplierState);
  // eliminar
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // feedback
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");


  const columns: { header: string; key: keyof Supplier }[] = [
    { header: "Empresa", key: "name" },
    { header: "Encargado", key: "location" },
    { header: "Teléfono", key: "phoneNumber" },
    { header: "Correo", key: "email" },
  ];

  const filteredSuppliers = suppliers.filter((supplier) => {
    const term = searchTerm.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(term) ||
      supplier.location.toLowerCase().includes(term) ||
      supplier.phoneNumber.toLowerCase().includes(term) ||
      supplier.email.toLowerCase().includes(term)
    );
  });

  // COMUNICACIÓN CON EL API
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/Supplier');
      if (!res.ok) {
        console.error('GET /Supplier failed:', res.status, await res.text());
        setSuppliers([]);
        return;
      }
      const raw = await res.json();
      const arr: ApiSupplier[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      const normalized = arr.map(normalizeSupplier);
      setSuppliers(normalized.filter((s) => s.isActive));
    } catch (error) {
      console.error('Error de conexión:', error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const saveSupplier = async () => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/api/Supplier/${editingId}` : '/api/Supplier';

      const payload = {
        idSupplier: editingId ?? formSupplier.idSupplier ?? 0,
        name: formSupplier.name,
        email: formSupplier.email,
        isActive: formSupplier.isActive,
        manager: formSupplier.location,
        location: formSupplier.location,
        address: formSupplier.location,
        phoneNumer: formSupplier.phoneNumber,
        phoneNumber: formSupplier.phoneNumber,
        phone: formSupplier.phoneNumber,
      };

      const res = await apiFetch(path, {
        method,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error(`${method} ${path} failed:`, res.status, txt);
        setFeedbackTitle('Error del servidor');
        setFeedbackMessage('No se pudo guardar el proveedor: ' + txt);
        setFeedbackType('error');
        setFeedbackOpen(true);
        return;
      }

      closeModal();
      fetchSuppliers();
      setFeedbackTitle(editingId ? 'Proveedor actualizado' : 'Proveedor creado');
      setFeedbackMessage(editingId ? 'El proveedor se actualizó correctamente.' : 'El proveedor se creó correctamente.');
      setFeedbackType('success');
      setFeedbackOpen(true);
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      setFeedbackTitle('Error');
      setFeedbackMessage('No se pudo guardar el proveedor.');
      setFeedbackType('error');
      setFeedbackOpen(true);
    }
  };

  const requestDeleteSupplier = (item: Supplier) => {
    setSupplierToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSupplier = async () => {
    if (!supplierToDelete?.idSupplier) return;

    try {
      const res = await apiFetch(`/api/Supplier/${supplierToDelete.idSupplier}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());

      fetchSuppliers();
      setFeedbackTitle('Proveedor eliminado');
      setFeedbackMessage(`El proveedor "${supplierToDelete.name}" se eliminó correctamente.`);
      setFeedbackType('success');
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      setFeedbackTitle('Error');
      setFeedbackMessage('No se pudo eliminar el proveedor.');
      setFeedbackType('error');
    } finally {
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
      setFeedbackOpen(true);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormSupplier(initialSupplierState);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Supplier) => {
    setEditingId(item.idSupplier ?? null);
    setFormSupplier(item);
    setIsModalOpen(true);
  };

  const handleView = (supplier: Supplier) => {
    setViewSupplier(supplier);
    setIsViewOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formSupplier.email.includes("@")) {
      setFeedbackTitle('Error de validación');
      setFeedbackMessage('El correo ingresado no es válido.');
      setFeedbackType('error');
      setFeedbackOpen(true);
      return;
    }

    const digits = formSupplier.phoneNumber.replace(/\D/g, "");

    if (digits.length !== 8) {
      setFeedbackTitle('Error de validación');
      setFeedbackMessage('El teléfono debe tener exactamente 8 dígitos.');
      setFeedbackType('error');
      setFeedbackOpen(true);
      return;
    }

    saveSupplier();
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // UI
  return (
    <>
      <ModuleTemplate title="Gestión de Proveedores" buttonText="Nuevo Proveedor" onAddClick={handleCreate}>
        <div style={topBarStyle}>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Buscar proveedor por nombre, encargado, teléfono o correo..."
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
        </div>
        <GenericTable columns={columns} data={filteredSuppliers} isLoading={loading} onEdit={handleEdit} onDelete={requestDeleteSupplier} onView={handleView} />
      </ModuleTemplate>

      {isModalOpen && (
        <div style={backdropStyle}>
          <div style={modalStyle}>
            <h2 style={{ color: "#161A59", marginTop: 0 }}>{editingId ? "Editar Proveedor" : "Nuevo Proveedor"}</h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input
                type="text"
                placeholder="Nombre Empresa"
                required
                maxLength={30}
                value={formSupplier.name}
                onChange={(e) => setFormSupplier({ ...formSupplier, name: e.target.value })}
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Encargado"
                required
                maxLength={30}
                value={formSupplier.location}
                onChange={(e) => setFormSupplier({ ...formSupplier, location: e.target.value })}
                style={inputStyle}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Teléfono"
                  required
                  maxLength={8}
                  value={formSupplier.phoneNumber}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    if (digits.length <= 8) {
                      setFormSupplier({
                        ...formSupplier,
                        phoneNumber: digits
                      });
                    }
                  }}
                  style={{ ...inputStyle, flex: 1 }}
                />

                <input
                  type="email"
                  placeholder="Correo"
                  maxLength={30}
                  required
                  value={formSupplier.email}
                  onChange={(e) => setFormSupplier({ ...formSupplier, email: e.target.value })}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={closeModal} style={cancelBtnStyle}>
                  Cancelar
                </button>
                <button type="submit" style={saveBtnStyle}>
                  {editingId ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        message={`¿Deseas eliminar al proveedor "${supplierToDelete?.name}"?`}
        onConfirm={confirmDeleteSupplier}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSupplierToDelete(null);
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
        title="Detalle de Proveedor"
        data={viewSupplier}
        fields={[
          { label: "Empresa", key: "name" },
          { label: "Encargado", key: "location" },
          { label: "Teléfono", key: "phoneNumber" },
          { label: "Correo", key: "email" },
          
        ]}
        onClose={() => {
          setIsViewOpen(false);
          setViewSupplier(null);
        }}
      />

    </>
  );
};

const inputStyle = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box" as const,
};

const backdropStyle: React.CSSProperties = {
  position: "fixed",
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

const modalStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "500px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
};

const cancelBtnStyle: React.CSSProperties = {
  padding: "8px 15px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const saveBtnStyle: React.CSSProperties = {
  backgroundColor: "#161A59",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
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
