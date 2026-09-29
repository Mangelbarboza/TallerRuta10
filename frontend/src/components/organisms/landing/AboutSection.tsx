export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#F2F2F2]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-[#161A59]">
            Sobre Nosotros
          </h2>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            En{" "}
            <span className="text-[#F21D2F] font-bold">
              Taller Auto Servicio Ruta 10
            </span>
            , nos dedicamos a brindar servicios automotrices de la más alta
            calidad. Contamos con más de{" "}
            <strong>10 años de experiencia</strong>, ofreciendo soluciones
            confiables y atención personalizada a cada uno de nuestros clientes.
          </p>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Nuestro equipo está conformado por profesionales altamente
            capacitados, comprometidos con el cuidado y mantenimiento de tu
            vehículo como si fuera propio.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Utilizamos equipos de última generación y repuestos de calidad para
            garantizar seguridad, durabilidad y tu total tranquilidad en cada
            servicio.
          </p>
        </div>
      </div>
    </section>
  );
}
