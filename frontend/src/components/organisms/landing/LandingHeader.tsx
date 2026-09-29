import { Menu, X } from "lucide-react";
import { useState } from "react";

interface LandingHeaderProps {
  onNavigate: (section: string) => void;
}

export function LandingHeader({ onNavigate }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Inicio" },
    { id: "services", label: "Servicios" },
    { id: "products", label: "Productos" },
    { id: "branches", label: "Sucursales" },
    { id: "appointments", label: "Citas" },
    { id: "contact", label: "Contacto" },
  ];

  return (
    <header id="header" className="bg-[#161A59] text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="bg-[#F21D2F] p-2 rounded-lg">
              <img
                src="/logoRuta10.svg"
                alt="Logo Ruta 10"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="font-bold text-xl">Taller Auto Servicio</h1>
              <p className="text-sm text-gray-300">Ruta 10</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="text-white hover:text-[#F21D2F] transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-white hover:text-[#F21D2F] transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}