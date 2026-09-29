import { useProducts } from "../../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Search, ArrowLeft } from "lucide-react";

export const AllProductsPage = () => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const API_URL = "https://localhost:7265";

  const [search, setSearch] = useState("");

  // 🔎 FILTRADO
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-[#F2F2F2]">

      {/* HERO ESTILO LANDING */}
      <div className="bg-[#161A59] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Catálogo de Productos
          </h1>

          <p className="text-lg text-gray-300 mb-6">
            Encuentra todo lo que tu vehículo necesita
          </p>

          {/* BOTÓN VOLVER */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-[#F21D2F] px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            <ArrowLeft size={18} />
            Volver al Inicio
          </button>

        </div>
      </div>

      {/* CONTENIDO */}
      <section className="py-16">
        <div className="container mx-auto px-4">

          {/* BUSCADOR */}
          <div className="max-w-md mx-auto mb-12 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#161A59]"
            />
          </div>

          {/* GRID */}
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">
              No se encontraron productos.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.idProduct}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                >
                  <img
                    src={`${API_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#161A59] mb-2">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <p className="text-lg font-bold text-[#F21D2F]">
                      {new Intl.NumberFormat("es-CR", {
                        style: "currency",
                        currency: "CRC",
                      }).format(product.salePrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};