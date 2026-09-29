import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";

// MODELO
interface Service {
  idService?: number;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // COMUNICACIÓN CON EL API
  const fetchServices = async () => {
    try {
      const response = await fetch("https://localhost:7265/api/Service");
      const data: Service[] = await response.json();

      setServices(data.filter(s => s.isActive));
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  //  UI
  return (
    <section id="services" className="py-20 bg-[#F2F2F2]">
      <div className="container mx-auto px-4">

        {/* TÍTULO */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#161A59] mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Servicios profesionales para el cuidado y mantenimiento de tu vehículo
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500">Cargando servicios...</p>
        )}

        {/* LISTADO */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {services.slice(0, 6).map(service => (
              <div
                key={service.idService}
                className="bg-py-20 bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
              >
                {/* ICON */}
                <div className="bg-[#F21D2F] w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Wrench className="text-white w-6 h-6" />
                </div>

                {/* INFO */}
                <h3 className="text-xl font-bold text-[#161A59] mb-2">
                  {service.name}
                </h3>

                <p className="text-gray-600 mb-4">
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

        <div className="text-center mt-10">
          <button
            onClick={() => window.location.href = "/servicios"}
            className="bg-[#F21D2F] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Ver todos los servicios
          </button>
        </div>
      </div>
    </section>
  );
}
