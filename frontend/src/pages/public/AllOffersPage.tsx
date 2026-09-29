import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Percent, Calendar, ArrowLeft } from "lucide-react";

interface Offer {
  idOffer: number;
  startDate: string;
  endDate: string;
  discount: number;
  isActive: boolean;
}

export const AllOffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchOffers = async () => {
    try {
      const response = await fetch(
        "https://localhost:7265/api/Offer/active"
      );
      const data: Offer[] = await response.json();
      setOffers(data);
    } catch (error) {
      console.error("Error al cargar ofertas", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // 🔎 FILTRO POR PORCENTAJE
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) =>
      offer.discount.toString().includes(search)
    );
  }, [offers, search]);

  return (
    <div className="min-h-screen bg-[#F2F2F2]">

      {/* HERO */}
      <div className="bg-[#161A59] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Todas nuestras ofertas
          </h1>

          <p className="text-gray-300 mb-6">
            Promociones activas por tiempo limitado
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

          {/* FILTRO */}
          <div className="max-w-md mx-auto mb-12">
            <input
              type="text"
              placeholder="Buscar por porcentaje (ej: 20)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#161A59]"
            />
          </div>

          {filteredOffers.length === 0 ? (
            <p className="text-center text-gray-500">
              No se encontraron ofertas.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.idOffer}
                  className="bg-gradient-to-br from-[#161A59] to-[#F21D2F] text-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Percent className="h-6 w-6" />
                    </div>
                    <h3 className="text-3xl font-bold">
                      {offer.discount}% OFF
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Válido del{" "}
                      {new Date(offer.startDate).toLocaleDateString()} al{" "}
                      {new Date(offer.endDate).toLocaleDateString()}
                    </span>
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