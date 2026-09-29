import { useProducts } from "../../../hooks/useProducts";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProductsSection() {
  const { products } = useProducts();
  const navigate = useNavigate();
  const API_URL = "https://localhost:7265";
  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* TÍTULO */}

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#161A59] mb-4">
            Nuestros Productos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Productos de alta calidad para el cuidado de tu vehículo
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8 ">
          {products.slice(0, 6).map((product) => (
            <div
              key={product.idProduct}
              className="bg-[#F2F2F2] rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              {/* ICONO */}
              <div className="bg-[#161A59] w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Package className="text-white w-6 h-6" />
              </div>
              {/* INFO */}
              <h3 className="text-xl font-bold text-[#161A59] mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-lg font-bold text-[#F21D2F]">
                {new Intl.NumberFormat("es-CR", {
                  style: "currency",
                  currency: "CRC",
                }).format(product.salePrice)}
              </p>

              <img
                src={`${API_URL}${product.image}`}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/productos")}
            className="bg-[#F21D2F] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Ver más productos
          </button>
        </div>
      </div>
    </section>
  );
}
