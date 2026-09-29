import { useEffect, useState } from "react";
import { ModuleTemplate } from "../../components/templates/ModuleTemplate";
import {
  GenericTable,
  type ColumnConfig,
} from "../../components/organisms/GenericTable";
import { ConfirmDeleteModal } from "../../components/molecules/ConfirmDeleteModal";
import { FeedbackModal } from "../../components/molecules/FeedbackModal";
import { DetailModal } from "../../components/molecules/DetailModal";
import { apiFetch } from "../../services/api/apiFetch";

// MODELO
interface Offer {
  idOffer?: number;
  startDate: string;
  endDate: string;
  discount: number;
  isActive: boolean;
  startDateDisplay?: string;
  endDateDisplay?: string;
}

export const Ofertas = () => {
  // ESTADOS
  const [searchTerm, setSearchTerm] = useState("");
  const [viewOffer, setViewOffer] = useState<Offer | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  // eliminar
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // feedback
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

  const initialState: Offer = {
    startDate: "",
    endDate: "",
    discount: 0,
    isActive: true,
  };

  const [formOffer, setFormOffer] = useState<Offer>(initialState);

  const handleView = (offer: Offer) => {
    setViewOffer(offer);
    setIsViewOpen(true);
  };

  // COLUMNAS TABLA
  const columns: ColumnConfig<Offer>[] = [
    { header: "Fecha Inicio", key: "startDateDisplay" },
    { header: "Fecha Fin", key: "endDateDisplay" },
    { header: "Descuento (%)", key: "discount" },
  ];

  // COMUNICACIÓN CON EL API
  const fetchOffers = async () => {
    try {
      const response = await fetch("https://localhost:7265/api/Offer");
      const data: Offer[] = await response.json();

      // ✅ CAMBIO: filtrar para NO mostrar IsActive = 0
      const formatted = data
        .filter((o) => o.isActive === true)
        .map((o) => ({
          ...o,
          startDateDisplay: new Date(o.startDate).toLocaleDateString("es-CR"),
          endDateDisplay: new Date(o.endDate).toLocaleDateString("es-CR"),
        }));

      setOffers(formatted);
    } catch (error) {
      console.error("Error al cargar ofertas", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const term = searchTerm.toLowerCase();

    return (
      (offer.startDateDisplay ?? "").toLowerCase().includes(term) ||
      (offer.endDateDisplay ?? "").toLowerCase().includes(term) ||
      offer.discount.toString().includes(term)
    );
  });

  const saveOffer = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!formOffer.startDate || !formOffer.endDate) {
        setFeedbackTitle("Error");
        setFeedbackMessage("Debes seleccionar fecha de inicio y fecha de fin.");
        setFeedbackType("error");
        setFeedbackOpen(true);
        return;
      }

      const [sy, sm, sd] = formOffer.startDate.split("T")[0].split("-").map(Number);
      const [ey, em, ed] = formOffer.endDate.split("T")[0].split("-").map(Number);
      const start = new Date(sy, (sm || 1) - 1, sd || 1);
      const end = new Date(ey, (em || 1) - 1, ed || 1);

      if (!editingId && start < today) {
        setFeedbackTitle("Fecha inválida");
        setFeedbackMessage("La fecha de inicio no puede ser anterior a hoy.");
        setFeedbackType("error");
        setFeedbackOpen(true);
        return;
      }

      if (end < start) {
        setFeedbackTitle("Fecha inválida");
        setFeedbackMessage("La fecha de fin no puede ser anterior a la fecha de inicio.");
        setFeedbackType("error");
        setFeedbackOpen(true);
        return;
      }

      const method = editingId ? "PUT" : "POST";
      const path = editingId ? `/api/Offer/${editingId}` : "/api/Offer";

      const body = {
        startDate: formOffer.startDate,
        endDate: formOffer.endDate,
        discount: formOffer.discount,
        isActive: true,
      };

      const res = await apiFetch(path, {
        method,
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      fetchOffers();
      closeModal();
      setFeedbackTitle(editingId ? "Oferta actualizada" : "Oferta creada");
      setFeedbackMessage(
        editingId
          ? "La oferta se actualizó correctamente."
          : "La oferta se creó correctamente.",
      );
      setFeedbackType("success");
      setFeedbackOpen(true);
    } catch (error) {
      console.error("Error al guardar oferta:", error);
      setFeedbackTitle("Error");
      setFeedbackMessage("No se pudo guardar la oferta.");
      setFeedbackType("error");
      setFeedbackOpen(true);
    }
  };

  const requestDeleteOffer = (offer: Offer) => {
    setOfferToDelete(offer);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOffer = async () => {
    if (!offerToDelete?.idOffer) return;

    try {
      const res = await apiFetch(`/api/Offer/${offerToDelete.idOffer}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());

      fetchOffers();
      setFeedbackTitle("Oferta eliminada");
      setFeedbackMessage("La oferta se eliminó correctamente.");
      setFeedbackType("success");
    } catch (error) {
      console.error("Error al eliminar oferta:", error);
      setFeedbackTitle("Error");
      setFeedbackMessage("No se pudo eliminar la oferta.");
      setFeedbackType("error");
    } finally {
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);
      setFeedbackOpen(true);
    }
  };

  // FUNCIONES MODAL
  const handleCreate = () => {
    setEditingId(null);
    setFormOffer(initialState);
    setIsModalOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setEditingId(offer.idOffer || null);
    setFormOffer({
      ...offer,
      startDate: offer.startDate.split("T")[0],
      endDate: offer.endDate.split("T")[0],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // UI
  return (
    <>
      <ModuleTemplate
        title="Gestión de Ofertas"
        buttonText="Nueva Oferta"
        onAddClick={handleCreate}
      >
        <div style={topBarStyle}>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Buscar oferta por fecha o descuento..."
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
          data={filteredOffers}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={requestDeleteOffer}
          onView={handleView}
        />
      </ModuleTemplate>

      {isModalOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ color: "#161A59" }}>
              {editingId ? "Editar Oferta" : "Nueva Oferta"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveOffer();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <label style={labelStyle}>Fecha de Inicio:</label>
              <input
                type="date"
                required
                value={formOffer.startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormOffer({ ...formOffer, startDate: e.target.value })
                }
                style={inputStyle}
              />

              <label style={labelStyle}>Fecha de Fin:</label>
              <input
                type="date"
                required
                value={formOffer.endDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormOffer({ ...formOffer, endDate: e.target.value })
                }
                style={inputStyle}
              />

              <label style={labelStyle}>Cantidad de descuento (%):</label>
              <input
                type="number"
                placeholder="Descuento (%)"
                required
                min="1"
                max="100"
                value={formOffer.discount}
                onChange={(e) =>
                  setFormOffer({
                    ...formOffer,
                    discount: Number(e.target.value),
                  })
                }
                style={inputStyle}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
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

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        message="¿Deseas eliminar esta oferta?"
        onConfirm={confirmDeleteOffer}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setOfferToDelete(null);
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
        title="Detalle de Oferta"
        data={viewOffer}
        fields={[
          {
            label: "Fecha Inicio",
            key: "startDate",
            format: (value) => value.split("T")[0],
          },
          {
            label: "Fecha Fin",
            key: "endDate",
            format: (value) => value.split("T")[0],
          },
          {
            label: "Descuento (%)",
            key: "discount",
            format: (value) => `${value}%`,
          },
          
        ]}
        onClose={() => {
          setIsViewOpen(false);
          setViewOffer(null);
        }}
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

const labelStyle = {
  fontSize: "13px",
  color: "#555",
  fontWeight: "bold" as const,
  marginBottom: "-8px",
};