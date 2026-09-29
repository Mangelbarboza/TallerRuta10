import { Calendar, CheckCircle, Clock, Wrench } from "lucide-react";

interface AppointmentSectionProps {
  onAppointmentClick: () => void;
}

export function AppointmentSection({ onAppointmentClick }: AppointmentSectionProps) {
  return (
    <section id="appointments" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-[#161A59] mb-4">
              ¿Listo para darle el cuidado que tu vehículo merece?
            </h2>
            <p className="text-xl text-gray-600">
              Agenda tu cita en menos de 2 minutos y deja tu vehículo en manos expertas
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-[#161A59] to-[#F21D2F] rounded-lg p-6 hover:scale-105 transition-all shadow-lg">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <p className="text-white font-semibold">Agenda Rápida</p>
              <p className="text-white/90 text-sm mt-2">En menos de 2 minutos</p>
            </div>

            <div className="bg-gradient-to-br from-[#161A59] to-[#F21D2F] rounded-lg p-6 hover:scale-105 transition-all shadow-lg">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <p className="text-white font-semibold">Sin Compromiso</p>
              <p className="text-white/90 text-sm mt-2">Confirma después</p>
            </div>

            <div className="bg-gradient-to-br from-[#161A59] to-[#F21D2F] rounded-lg p-6 hover:scale-105 transition-all shadow-lg">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <p className="text-white font-semibold">Horarios Flexibles</p>
              <p className="text-white/90 text-sm mt-2">Tú eliges cuándo</p>
            </div>

            <div className="bg-gradient-to-br from-[#161A59] to-[#F21D2F] rounded-lg p-6 hover:scale-105 transition-all shadow-lg">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <p className="text-white font-semibold">Servicio Experto</p>
              <p className="text-white/90 text-sm mt-2">10+ años de experiencia</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={onAppointmentClick}
                className="bg-[#F21D2F] hover:bg-[#D9303E] text-white text-xl font-bold py-5 px-10 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Calendar className="h-6 w-6" />
                Agendar Cita en Línea
              </button>
              <button
                onClick={() => window.open('https://wa.me/50688061130?text=Hola,%20me%20gustaría%20solicitar%20una%20cita%20para%20mi%20vehículo.', '_blank')}
                className="bg-[#161A59] hover:bg-[#1f257a] text-white text-xl font-bold py-5 px-10 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Calendar className="h-6 w-6" />
                Solicitar por WhatsApp
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              Confirmación rápida y atención garantizada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}