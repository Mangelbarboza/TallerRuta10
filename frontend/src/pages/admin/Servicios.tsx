import { useEffect, useState } from 'react';
import { ModuleTemplate } from '../../components/templates/ModuleTemplate';
import { GenericTable } from '../../components/organisms/GenericTable';
import { ConfirmDeleteModal } from '../../components/molecules/ConfirmDeleteModal';
import { FeedbackModal } from '../../components/molecules/FeedbackModal';
import { DetailModal } from "../../components/molecules/DetailModal";
import { apiFetch } from '../../services/api/apiFetch';

// DEFINICIÓN DE TIPOS
interface Service {
  idService?: number;
  name: string;
  description: string;
  basePrice: number;
  basePriceDisplay?: string;
  discountedPriceDisplay?: string | null;
  isActive: boolean;
  branchIds?: number[];
  branches?: Branch[];
  branchesDisplay?: string;
  offerDisplay?: string;
  idOffer?: number | null;
  discount?: number | null;
}

interface Branch {
  idBranch: number;
  name: string;
}

interface Offer {
  idOffer: number;
  startDate: string;
  endDate: string;
  discount: number;
  isActive: boolean;
}

export const Servicios = () => {
  // ESTADOS
  const [searchTerm, setSearchTerm] = useState("");
  const [viewService, setViewService] = useState<Service | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  const [branches, setBranches] = useState<Branch[]>([]);

  const [offers, setOffers] = useState<Offer[]>([]);

  const initialServiceState: Service = {
    name: '', description: '', basePrice: 0, isActive: true, branchIds: [], idOffer: null
  };

  const [formService, setFormService] = useState<Service>(initialServiceState);

  const columns: { header: string; key: keyof Service }[] = [
    { header: 'Servicio', key: 'name' },
    { header: 'Descripción', key: 'description' },
    { header: 'Precio Base', key: 'basePriceDisplay' },
    { header: 'Precio con oferta', key: 'discountedPriceDisplay' }
  ];

  const fetchBranches = async () => {
    const res = await fetch('https://localhost:7265/api/Branch');
    if (res.ok) {
      const data = await res.json();
      setBranches(data.filter((b: any) => b.isActive));
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await apiFetch('/api/Offer');
      const data: Offer[] = await res.json();
      setOffers(data.filter((o) => o.isActive));
    } catch (error) {
      console.error("Error cargando ofertas", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchBranches();
  }, []);

  // COMUNICACIÓN CON EL API
  const fetchServices = async () => {
    try {
      const response = await fetch('https://localhost:7265/api/Service');
      if (response.ok) {
        const data: Service[] = await response.json();

        // Formateamos el precio antes de guardarlo en el estado de la tabla
        const formattedData = data
          .filter(item => item.isActive)
          .map(item => ({
            ...item,
            // Esto transforma 35000 en ₡35,000.00
            basePriceDisplay: new Intl.NumberFormat('es-CR', {
              style: 'currency',
              currency: 'CRC',
            }).format(item.basePrice),
            discountedPriceDisplay: item.discount && item.idOffer
              ? new Intl.NumberFormat('es-CR', {
                style: 'currency',
                currency: 'CRC',
              }).format(item.basePrice - (item.basePrice * item.discount / 100))
              : "Sin oferta",
          }));


        setServices(formattedData);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const filteredServices = services.filter((service) => {
    const term = searchTerm.toLowerCase();

    return (
      service.name.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term)
    );
  });

  const saveService = async () => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/api/Service/${editingId}` : '/api/Service';

      const res = await apiFetch(path, {
        method,
        body: JSON.stringify({
          name: formService.name,
          description: formService.description,
          basePrice: formService.basePrice,
          isActive: true,
          branchIds: formService.branchIds || [],
          idOffer: formService.idOffer ?? null
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      fetchServices();
      closeModal();
      setFeedbackTitle(editingId ? 'Servicio actualizado' : 'Servicio creado');
      setFeedbackMessage(editingId ? 'El servicio se actualizó correctamente.' : 'El servicio se guardó correctamente.');
      setFeedbackType('success');
      setFeedbackOpen(true);
    } catch (error) {
      setFeedbackTitle('Error');
      setFeedbackMessage('No se pudo guardar el servicio. Intente nuevamente.');
      setFeedbackType('error');
      setFeedbackOpen(true);
    }
  };


  const requestDeleteService = (item: Service) => {
    setServiceToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete?.idService) return;

    try {
      const res = await apiFetch(`/api/Service/${serviceToDelete.idService}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());

      fetchServices();
      setFeedbackTitle('Servicio eliminado');
      setFeedbackMessage(`El servicio "${serviceToDelete.name}" se eliminó correctamente.`);
      setFeedbackType('success');
    } catch (error) {
      setFeedbackTitle('Error');
      setFeedbackMessage('No se pudo eliminar el servicio. Intente nuevamente.');
      setFeedbackType('error');
    } finally {
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
      setFeedbackOpen(true);
    }
  };

  // HANDLERS
  const handleCreate = () => {
    setEditingId(null);
    setFormService(initialServiceState);
    setIsModalOpen(true);
  };


  const handleEdit = async (item: Service) => {
    if (!item.idService) return;

    const res = await apiFetch(`/api/Service/${item.idService}`);
    const data = await res.json();

    setEditingId(data.idService);

    setFormService({
      ...data,
      branchIds: data.branchIds || []
    });

    setIsModalOpen(true);
  };

  const handleView = async (service: Service) => {
    const res = await apiFetch(`/api/Service/${service.idService}`);
    const data = await res.json();

    const branchNames = branches
      .filter(b => data.branchIds?.includes(b.idBranch))
      .map(b => b.name)
      .join(", ");

    const offerDisplay = data.idOffer
      ? offers.find(o => o.idOffer === Number(data.idOffer))
        ? `${offers.find(o => o.idOffer === Number(data.idOffer))!.discount}% de descuento`
        : `Oferta #${data.idOffer}`
      : "Sin oferta";
    console.log(data.idOffer, offers)

    const discountedPriceDisplay = data.discount && data.idOffer
      ? new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
      }).format(data.basePrice - (data.basePrice * data.discount / 100))
      : "Sin oferta";

    setViewService({
      ...data,
      basePriceDisplay: new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
      }).format(data.basePrice),
      branchesDisplay: branchNames,
      offerDisplay,
      discountedPriceDisplay
    });

    setIsViewOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  useEffect(() => { fetchOffers(); fetchServices(); }, []);


  // RENDERIZADO
  return (
    <>
      <ModuleTemplate title="Gestión de Servicios" buttonText="Nuevo Servicio" onAddClick={handleCreate}>

        <div style={topBarStyle}>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Buscar servicio por nombre o descripción..."
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
          data={filteredServices}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={requestDeleteService}
          onView={handleView}
        />

      </ModuleTemplate>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h2 style={{ color: '#161A59', marginTop: 0, marginBottom: '20px' }}>{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>

            <form onSubmit={(e) => { e.preventDefault(); saveService(); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

              <input
                type="text" placeholder="Nombre del Servicio (ej: Cambio de Aceite)"
                required
                maxLength={100}
                value={formService.name}
                onChange={(e) => setFormService({ ...formService, name: e.target.value })}
                style={inputStyle}
              />

              <input
                type="text" placeholder="Descripción Detallada"
                required
                maxLength={500}
                value={formService.description}
                onChange={(e) => setFormService({ ...formService, description: e.target.value })}
                style={inputStyle}
              />

              <input
                type="number"
                placeholder="Precio Base (₡)"
                required
                min="0"
                max="100000000"
                value={formService.basePrice || ''}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (value >= 0 && value <= 100000000) {
                    setFormService({
                      ...formService,
                      basePrice: value
                    });
                  }
                }}
                style={inputStyle}
              />

              <select
                value={formService.idOffer ?? ""}
                onChange={(e) =>
                  setFormService({
                    ...formService,
                    idOffer: e.target.value ? Number(e.target.value) : null,
                  })
                }
                style={inputStyle}
              >
                <option value="">Sin oferta</option>
                {offers.map((offer) => (
                  <option key={offer.idOffer} value={offer.idOffer}>
                    {offer.discount}% — {offer.startDate.split("T")[0]} al {offer.endDate.split("T")[0]}
                  </option>
                ))}
              </select>

              <div>
                <label style={{ fontWeight: 'bold' }}>Sucursales</label>
                <div style={{
                  maxHeight: '120px',
                  overflowY: 'auto',
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '4px'
                }}>
                  {branches.map(branch => (
                    <label key={branch.idBranch} style={{ display: 'block' }}>
                      <input
                        type="checkbox"
                        checked={formService.branchIds?.includes(branch.idBranch) || false}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(formService.branchIds || []), branch.idBranch]
                            : (formService.branchIds || []).filter(id => id !== branch.idBranch);

                          setFormService({
                            ...formService,
                            branchIds: updated
                          });
                        }}
                      />
                      {" "}{branch.name}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '8px 15px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' }}>Cancelar</button>
                <button type="submit" style={{ backgroundColor: '#161A59', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        message={`¿Deseas eliminar el servicio "${serviceToDelete?.name}"?`}
        onConfirm={confirmDeleteService}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setServiceToDelete(null);
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

      <DetailModal
        isOpen={isViewOpen}
        title="Detalle de Servicio"
        data={viewService}
        fields={[
          { label: "Nombre", key: "name" },
          { label: "Descripción", key: "description" },
          { label: "Precio Base", key: "basePriceDisplay" },
          { label: "Precio con oferta", key: "discountedPriceDisplay", format: (value) => value ?? "Sin oferta" },
          { label: "Sucursales", key: "branchesDisplay" },
          { label: "Oferta", key: "offerDisplay" },
          
        ]}
        onClose={() => {
          setIsViewOpen(false);
          setViewService(null);
        }}
      />

    </>
  );
};

const inputStyle = { padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' as 'border-box' };

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