import { useEffect, useState } from "react";
import { ModuleTemplate } from "../../components/templates/ModuleTemplate";
import { GenericTable } from "../../components/organisms/GenericTable";
import type { Branch, Product, Supplier } from "../../types/models";
import { branchService } from "../../services/api/branchService";
import type { SelectedBranch } from "../../types/models";
import { DetailModal } from "../../components/molecules/DetailModal";
import { ConfirmDeleteModal } from "../../components/molecules/ConfirmDeleteModal";
import { apiFetch } from "../../services/api/apiFetch";
import { FeedbackModal } from "../../components/molecules/FeedbackModal";

interface Offer {
  idOffer: number;
  startDate: string;
  endDate: string;
  discount: number;
  isActive: boolean;
}

const API_URL = "https://localhost:7265/api";

export const Productos = () => {
  // ESTADOS
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">(
    "success",
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<SelectedBranch[]>(
    [],
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [offers, setOffers] = useState<Offer[]>([]);

  const initialState: Product = {
    name: "",
    description: "",
    salePrice: 0,
    idSupplier: 0,
    idOffer: null,
  };

  const [formProduct, setFormProduct] = useState<Product>(initialState);

  // API
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/Product`);
      const data: Product[] = await response.json();

      const formatted = data.map((p) => ({
        ...p,
        salePriceDisplay: new Intl.NumberFormat("es-CR", {
          style: "currency",
          currency: "CRC",
        }).format(p.salePrice),
        discountedPriceDisplay:
          p.discount && p.idOffer
            ? new Intl.NumberFormat("es-CR", {
                style: "currency",
                currency: "CRC",
              }).format(p.salePrice - (p.salePrice * p.discount) / 100)
            : "Sin oferta",
      }));

      setProducts(formatted);
    } catch (error) {
      console.error("Error cargando productos", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();

    return (
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.salePrice?.toString().includes(term)
    );
  });

  const fetchProductById = async (id: number) => {
    const response = await fetch(`${API_URL}/Product/${id}`);
    return await response.json();
  };

  const fetchOffers = async () => {
    try {
      const res = await apiFetch("/api/Offer");
      const data: Offer[] = await res.json();
      setOffers(data.filter((o) => o.isActive));
    } catch (error) {
      console.error("Error cargando ofertas", error);
    }
  };

  const saveProduct = async () => {
    try {
      if (formProduct.idSupplier === 0) {
        setFeedbackTitle("Proveedor requerido");
        setFeedbackMessage("Debe seleccionar un proveedor.");
        setFeedbackType("error");
        setFeedbackOpen(true);
        return;
      }

      const method = editingId ? "PUT" : "POST";
      const path = editingId ? `/api/Product/${editingId}` : "/api/Product";

      const formData = new FormData();
      if (editingId) formData.append("IdProduct", editingId.toString());
      formData.append("Name", formProduct.name);
      formData.append("Description", formProduct.description ?? "");
      formData.append("SalePrice", formProduct.salePrice.toString());
      formData.append("IdSupplier", formProduct.idSupplier.toString());

      if (formProduct.idOffer != null) {
        formData.append("IdOffer", formProduct.idOffer.toString());
      }

      selectedBranches.forEach((branch, index) => {
        formData.append(
          `Branches[${index}].IdBranch`,
          branch.idBranch.toString(),
        );
        formData.append(`Branches[${index}].Stock`, branch.stock.toString());
      });

      if (imageFile) formData.append("Image", imageFile);

      const res = await apiFetch(path, { method, body: formData });
      if (!res.ok) throw new Error(await res.text());

      fetchProducts();
      closeModal();

      setFeedbackTitle(editingId ? "Producto actualizado" : "Producto creado");
      setFeedbackMessage(
        editingId
          ? `El producto "${formProduct.name}" se actualizó correctamente.`
          : `El producto "${formProduct.name}" se creó correctamente.`,
      );
      setFeedbackType("success");
      setFeedbackOpen(true);
    } catch (error) {
      console.error("Error al guardar producto:", error);

      setFeedbackTitle("Error");
      setFeedbackMessage("No se pudo guardar el producto. Intente nuevamente.");
      setFeedbackType("error");
      setFeedbackOpen(true);
    }
  };

  const deleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };
  const confirmDeleteProduct = async () => {
    if (!productToDelete?.idProduct) return;

    try {
      const res = await apiFetch(`/api/Product/${productToDelete.idProduct}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(await res.text());

      fetchProducts();

      setFeedbackTitle("Producto eliminado");
      setFeedbackMessage(
        `El producto "${productToDelete.name}" se eliminó correctamente.`,
      );
      setFeedbackType("success");
    } catch (error) {
      setFeedbackTitle("Error");
      setFeedbackMessage(
        "No se pudo eliminar el producto. Intente nuevamente.",
      );
      setFeedbackType("error");
    } finally {
      setIsDeleteOpen(false);
      setProductToDelete(null);
      setFeedbackOpen(true);
    }
  };

  // HANDLERS
  const handleCreate = () => {
    setEditingId(null);
    setFormProduct(initialState);
    setSelectedBranches([]);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (product: Product) => {
    if (!product.idProduct) return;

    const data = await fetchProductById(product.idProduct);

    setEditingId(data.idProduct);

    setFormProduct({
      idProduct: data.idProduct,
      name: data.name,
      description: data.description,
      salePrice: data.salePrice,
      idSupplier: data.idSupplier,
      idOffer: data.idOffer ?? null,
    });

    setSelectedBranches(data.branches || []);
    setImagePreview(data.imagePath);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = async (product: Product) => {
    if (!product.idProduct) return;

    const data = await fetchProductById(product.idProduct);

    const supplierName =
      suppliers.find((s) => s.idSupplier === data.idSupplier)?.name ||
      "No definido";

    const branchesDisplay = data.branches?.length
      ? data.branches
          .map((b: { idBranch: number; stock: number }) => {
            const branchName =
              branches.find((br) => br.idBranch === b.idBranch)?.name ||
              "Sucursal";
            return `${branchName} (Stock: ${b.stock})`;
          })
          .join(", ")
      : "No asignado";

    const offerDisplay = data.idOffer
      ? offers.find((o) => o.idOffer === data.idOffer)
        ? `${offers.find((o) => o.idOffer === data.idOffer)!.discount}% de descuento`
        : `Oferta #${data.idOffer}`
      : "Sin oferta";

    const discountedPriceDisplay =
      data.discount && data.idOffer
        ? new Intl.NumberFormat("es-CR", {
            style: "currency",
            currency: "CRC",
          }).format(data.salePrice - (data.salePrice * data.discount) / 100)
        : "Sin oferta";

    setViewProduct({
      ...data,
      salePriceDisplay: new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
      }).format(data.salePrice),
      supplierDisplay: supplierName,
      branchesDisplay,
      offerDisplay,
      discountedPriceDisplay,
    });

    setIsViewOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setSelectedBranches([]);
    setImageFile(null);
    setImagePreview(null);
  };

  useEffect(() => {
    fetchProducts();
    fetchOffers();

    branchService
      .getAll()
      .then((data) => setBranches(data.filter((b) => b.isActive)));

    apiFetch("/api/Supplier")
      .then((res) => res.json())
      .then((data: Supplier[]) =>
        setSuppliers(data.filter((s) => s.isActive !== false)),
      );
  }, []);

  // UI
  return (
    <>
      <ModuleTemplate
        title="Gestión de Productos"
        buttonText="Nuevo Producto"
        onAddClick={handleCreate}
      >
        <div style={topBarStyle}>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Buscar producto por nombre, descripción o precio..."
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
          columns={[
            { header: "Producto", key: "name" },
            { header: "Descripción", key: "description" },
            { header: "Precio", key: "salePriceDisplay" },
            { header: "Precio con oferta", key: "discountedPriceDisplay" },
          ]}
          data={filteredProducts}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={deleteProduct}
          onView={handleView}
        />
      </ModuleTemplate>

      {isModalOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={titleStyle}>
              {editingId ? "Editar Producto" : "Nuevo Producto"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProduct();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <input
                type="text"
                placeholder="Nombre del Producto (ej: Aceite 5W-30)"
                required
                maxLength={100}
                value={formProduct.name}
                onChange={(e) =>
                  setFormProduct({ ...formProduct, name: e.target.value })
                }
                style={inputStyle}
              />
              <div
                style={{ fontSize: "12px", color: "#666", textAlign: "right" }}
              >
                {formProduct.name.length}/100 caracteres
              </div>

              <textarea
                placeholder="Descripción detallada"
                required
                maxLength={1000}
                value={formProduct.description}
                onChange={(e) =>
                  setFormProduct({
                    ...formProduct,
                    description: e.target.value,
                  })
                }
                style={{ ...inputStyle, minHeight: "80px", resize: "none" }}
              />
              <div
                style={{ fontSize: "12px", color: "#666", textAlign: "right" }}
              >
                {formProduct.description?.length || 0}/1000 caracteres
              </div>

              <input
                type="number"
                placeholder="Precio de Venta (₡)"
                required
                max={"100000000"}
                min="1"
                step="0.01"
                value={formProduct.salePrice || ""}
                onChange={(e) =>
                  setFormProduct({
                    ...formProduct,
                    salePrice: Number(e.target.value),
                  })
                }
                style={inputStyle}
              />

              <select
                required
                value={formProduct.idSupplier}
                onChange={(e) =>
                  setFormProduct({
                    ...formProduct,
                    idSupplier: Number(e.target.value),
                  })
                }
                style={inputStyle}
              >
                <option value={0}>Seleccione proveedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.idSupplier} value={supplier.idSupplier}>
                    {supplier.name}
                  </option>
                ))}
              </select>

              <select
                value={formProduct.idOffer ?? ""}
                onChange={(e) =>
                  setFormProduct({
                    ...formProduct,
                    idOffer: e.target.value ? Number(e.target.value) : null,
                  })
                }
                style={inputStyle}
              >
                <option value="">Sin oferta</option>
                {offers.map((offer) => (
                  <option key={offer.idOffer} value={offer.idOffer}>
                    {offer.discount}% — {offer.startDate.split("T")[0]} al{" "}
                    {offer.endDate.split("T")[0]}
                  </option>
                ))}
              </select>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <label style={{ fontWeight: "bold" }}>
                  Imagen del producto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                      setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
                {imagePreview && (
                  <img
                    src={
                      imagePreview.startsWith("blob:") ||
                      imagePreview.startsWith("http")
                        ? imagePreview
                        : `https://localhost:7265${imagePreview}`
                    }
                    alt="Imagen actual"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                )}
              </div>

              <div style={{ marginTop: "10px" }}>
                <label style={{ fontWeight: "bold" }}>Sucursales</label>

                <div style={{ marginTop: "5px" }}>
                  {branches.map((branch) => {
                    const selected = selectedBranches.find(
                      (b) => b.idBranch === branch.idBranch,
                    );

                    return (
                      <div
                        key={branch.idBranch}
                        style={{ marginBottom: "8px" }}
                      >
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBranches([
                                ...selectedBranches,
                                { idBranch: branch.idBranch!, stock: 0 },
                              ]);
                            } else {
                              setSelectedBranches(
                                selectedBranches.filter(
                                  (b) => b.idBranch !== branch.idBranch,
                                ),
                              );
                            }
                          }}
                        />{" "}
                        {branch.name}
                        {selected && (
                          <input
                            type="number"
                            min="0"
                            value={selected.stock}
                            onChange={(e) => {
                              const newStock = Number(e.target.value);
                              setSelectedBranches(
                                selectedBranches.map((b) =>
                                  b.idBranch === branch.idBranch
                                    ? { ...b, stock: newStock }
                                    : b,
                                ),
                              );
                            }}
                            style={{
                              marginLeft: 10,
                              width: 80,
                              padding: "6px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={buttonContainerStyle}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={cancelButtonStyle}
                >
                  Cancelar
                </button>

                <button type="submit" style={saveButtonStyle}>
                  {editingId ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DetailModal
        isOpen={isViewOpen}
        title="Detalle de Producto"
        data={viewProduct}
        fields={[
          { label: "Nombre", key: "name" },
          { label: "Descripción", key: "description" },
          { label: "Precio", key: "salePriceDisplay" },
          {
            label: "Precio con oferta",
            key: "discountedPriceDisplay",
            format: (value) => value ?? "Sin oferta activa",
          },
          { label: "Proveedor", key: "supplierDisplay" },
          { label: "Sucursales", key: "branchesDisplay" },
          { label: "Oferta", key: "offerDisplay" },
        
        ]}
        onClose={() => {
          setIsViewOpen(false);
          setViewProduct(null);
        }}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        message={`¿Deseas eliminar el producto "${productToDelete?.name}"?`}
        onConfirm={confirmDeleteProduct}
        onCancel={() => {
          setIsDeleteOpen(false);
          setProductToDelete(null);
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
  maxHeight: "90vh",
  overflowY: "auto" as const,
};

const titleStyle = {
  color: "#161A59",
  marginTop: 0,
  marginBottom: "20px",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box" as const,
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "15px",
};

const cancelButtonStyle = {
  padding: "8px 15px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "white",
};

const saveButtonStyle = {
  backgroundColor: "#161A59",
  color: "white",
  border: "none",
  padding: "10px 20px",
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
