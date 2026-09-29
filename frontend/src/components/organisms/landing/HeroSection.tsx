import { Shield, Clock, Award } from "lucide-react";
import { Button } from "../../atoms/Button";

interface HeroSectionProps {
  onCtaClick: () => void;
  onAppointmentClick: () => void;
}

export function HeroSection({ onCtaClick, onAppointmentClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#161A59] to-[#0D0D0D] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Tu Auto en las
              <span className="text-[#F21D2F]"> Mejores Manos</span>
            </h1>

            <p className="text-xl mb-8 text-gray-300">
              Servicio automotriz de confianza con más de 10 años de experiencia.
              Calidad, profesionalismo y atención personalizada garantizada.
            </p>

            { /* Key Features */}
            <div className="grid grid-cols-3 mb-8">
              <div className="text-center">
                <div className="bg-[#F21D2F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-8 w-8" />
                </div>
                <p className="text-sm">Garantía Total</p>
              </div>

              <div className="text-center">
                <div className="bg-[#F21D2F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-8 w-8" />
                </div>
                <p className="text-sm">Servicio Rápido</p>
              </div>

              <div className="text-center">
                <div className="bg-[#F21D2F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-8 w-8" />
                </div>
                <p className="text-sm">10+ Años</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={onCtaClick}
                variant="default"
                className="mt-8 bg-[#F21D2F] hover:bg-[#D9303E] text-lg px-8 py-6 h-auto"
              >
                Cotizar Ahora
              </Button>

              <Button
                onClick={onAppointmentClick}
                variant="default"
                className="mt-8 bg-[#F21D2F] hover:bg-[#D9303E] text-lg px-8 py-6 h-auto"
              >
                Solicitar cita
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/img_hero_taller.jpeg"
                alt="Taller Auto Servicio Ruta 10"
                className="w-full h-auto"
              />
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F21D2F] rounded-full opacity-20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
