import { useEffect, useState } from "react";
import { Percent } from "lucide-react";

interface Product {
  idProduct: number;
  name: string;
  description: string;
  salePrice: number;
  idOffer?: number | null;
  discount?: number;
  image?: string;
}

interface Service {
  idService: number;
  name: string;
  description: string;
  basePrice: number;
  idOffer?: number | null;
  discount?: number;
}

export function OffersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://localhost:7265";

  const fetchData = async () => {
    try {
      const [productRes, serviceRes] = await Promise.all([
        fetch(`${API_URL}/api/Product`),
        fetch(`${API_URL}/api/Service`)
      ]);

      const productsData: Product[] = await productRes.json();
      const servicesData: Service[] = await serviceRes.json();

      const productsWithOffer = productsData.filter(p => p.idOffer);
      const servicesWithOffer = servicesData.filter(s => s.idOffer);

      setProducts(productsWithOffer);
      setServices(servicesWithOffer);

    } catch (error) {
      console.error("Error cargando ofertas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return null;

  if (products.length === 0 && services.length === 0) return null;

  return (
    <section id="offers" className="py-20 bg-white">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#161A59] mb-4">
            Ofertas Especiales
          </h2>
          <p className="text-gray-600">
            Productos y servicios con descuento 
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* PRODUCTOS EN OFERTA */}
          {products.map(product => {
            const discountedPrice =
              product.salePrice -
              (product.salePrice * (product.discount ?? 0)) / 100;

            return (
              <div
                key={`product-${product.idProduct}`}
                className="bg-[#F2F2F2] rounded-xl p-6 shadow hover:shadow-lg transition"
              >
                <div className="bg-[#F21D2F] w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Percent className="text-white w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-[#161A59] mb-2">
                  {product.name}
                </h3>

                <p className="text-gray-600 mb-2">
                  {product.description}
                </p>

                <p className="text-sm line-through text-gray-500">
                  {new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                  }).format(product.salePrice)}
                </p>

                <p className="text-lg font-bold text-[#F21D2F]">
                  {new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                  }).format(discountedPrice)}
                </p>
              </div>
            );
          })}

          {/* SERVICIOS EN OFERTA */}
          {services.map(service => {
            const discountedPrice =
              service.basePrice -
              (service.basePrice * (service.discount ?? 0)) / 100;

            return (
              <div
                key={`service-${service.idService}`}
                className="bg-[#F2F2F2] rounded-xl p-6 shadow hover:shadow-lg transition"
              >
                <div className="bg-[#161A59] w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Percent className="text-white w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-[#161A59] mb-2">
                  {service.name}
                </h3>

                <p className="text-gray-600 mb-2">
                  {service.description}
                </p>

                <p className="text-sm line-through text-gray-500">
                  {new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                  }).format(service.basePrice)}
                </p>

                <p className="text-lg font-bold text-[#F21D2F]">
                  {new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                  }).format(discountedPrice)}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}