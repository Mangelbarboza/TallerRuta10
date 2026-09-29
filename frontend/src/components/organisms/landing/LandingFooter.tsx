import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";

interface LandingFooterProps {
  onAdminClick: () => void;
}

export function LandingFooter({ onAdminClick }: LandingFooterProps) {
  return (
    <footer id="contact" className="bg-[#0D0D0D] text-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 place-items-center md:place-items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#F21D2F] p-2 rounded-lg">
                <img
                  src="/logoRuta10.svg"
                  alt="Logo Ruta 10"
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Taller Auto Servicio</h3>
                <p className="text-sm text-gray-400">Ruta 10</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Tu taller de confianza con más de 10 años brindando servicios
              automotrices de calidad.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#header" className="hover:text-[#F21D2F] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#F21D2F] transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#F21D2F] transition-colors">
                  Productos
                </a>
              </li>
              <li>
                <a href="#branches" className="hover:text-[#F21D2F] transition-colors">
                  Sucursales
                </a>
              </li>
              <li>
                <a href="#appointments" className="hover:text-[#F21D2F] transition-colors">
                  Citas
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-[#F21D2F] mt-0.5" />
                <span>30502, Provincia de Cartago, Turrialba, 30502</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#F21D2F]" />
                <span>25560433</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#F21D2F]" />
                <span>autoserviciorutadiez@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Hours & Social */}
          <div>
            <div className="mt-6">
              <h5 className="font-bold mb-3 text-sm">Redes Sociales</h5>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/1FvKbaTwYU/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#161A59] p-2 rounded-full hover:bg-[#F21D2F] transition-colors"
                >
                  <Facebook className="h-5 w-5 text-white" />
                </a>
                <a
                  href="https://www.instagram.com/autoruta10cr?igsh=eG0wMWt1ZjUwdTRo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#161A59] p-2 rounded-full hover:bg-[#F21D2F] transition-colors"
                >
                  <Instagram className="h-5 w-5 text-white" />
                </a>
                <a
                  href="https://wa.me/50688061130"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#161A59] p-2 rounded-full hover:bg-[#F21D2F] transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright + Admin Button */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center flex flex-col items-center gap-2">
          <p className="text-gray-400 text-sm">
            &copy; 2026 Taller Auto Servicio Ruta 10. Todos los derechos reservados.
          </p>
          <button 
            onClick={onAdminClick}
            className="text-gray-700 hover:text-gray-500 text-[10px] transition-colors uppercase tracking-widest"
          >
            Administrar
          </button>
        </div>
      </div>
    </footer>
  );
}