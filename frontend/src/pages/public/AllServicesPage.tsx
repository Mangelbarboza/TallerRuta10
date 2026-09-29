import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, ArrowLeft, Search } from "lucide-react";

interface Service {
  idService?: number;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
}

export const AllServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const response = await fetch("https://localhost:7265/api/Service");
      const data: Service[] = await response.json();
      setServices(data.filter(s => s.isActive));
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔎 FILTRO
  const filteredServices = useMemo(() => {
    return services.filter(service =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  return (
    <div className="min-h-screen bg-[#F2F2F2]">

      {/* HERO */}
      <div className="bg-[#161A59] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Todos nuestros servicios
          </h1>

          <p className="text-gray-300 mb-6">
            Soluciones profesionales para tu vehículo
          </p>

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
              placeholder="Buscar servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#161A59]"
            />
          </div>

          {filteredServices.length === 0 ? (
            <p className="text-center text-gray-500">
              No se encontraron servicios.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredServices.map(service => (
                <div
                  key={service.idService}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300"
                >
                  <div className="bg-[#F21D2F] w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <Wrench className="text-white w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-[#161A59] mb-2">
                    {service.name}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <p className="text-lg font-bold text-[#F21D2F]">
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                    }).format(service.basePrice)}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};