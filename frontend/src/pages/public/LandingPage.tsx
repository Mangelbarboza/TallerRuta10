import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LandingHeader } from "../../components/organisms/landing/LandingHeader";
import { LandingFooter } from "../../components/organisms/landing/LandingFooter";
import { HeroSection } from "../../components/organisms/landing/HeroSection";
import { AboutSection } from "../../components/organisms/landing/AboutSection";
import { BranchesSection } from "../../components/organisms/landing/BranchesSection";
import { ServicesSection } from "../../components/organisms/landing/ServicesSection";
import { OffersSection } from "../../components/organisms/landing/OffersSection";
import { ProductsSection } from "../../components/organisms/landing/ProductsSection";

import { AppointmentModal } from "../../components/molecules/AppointmentModal/AppointmentModal";
import { FeedbackModal } from "../../components/molecules/FeedbackModal";
import { useAppointments } from "../../hooks/useAppointments";
import { AppointmentSection } from "../../components/organisms/landing/AppointmentSection";


export function LandingPage() {
  const navigate = useNavigate();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const { appointments, branches, services, createAppointment } = useAppointments();

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');


  const handleNavigate = (section: string) => {
    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAdminClick = () => {
    navigate("/admin/login");
  };

  const handleCTA = () => {
    const phone = "50688061130";
    const message = encodeURIComponent(
      "Hola, me gustaría cotizar un servicio para mi vehículo"
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleAppointmentClick = () => {
    setIsAppointmentModalOpen(true);
  };

  const handleShowError = (message: string) => {
    setFeedbackTitle('Atención');
    setFeedbackMessage(message);
    setFeedbackType('error');
    setFeedbackOpen(true);
  };

  const handleSaveAppointment = async (formData: any) => {
    try {
      await createAppointment(formData);
      setIsAppointmentModalOpen(false);

      setFeedbackTitle('¡Cita creada!');
      setFeedbackMessage('Nos pondremos en contacto pronto.');
      setFeedbackType('success');
      setFeedbackOpen(true);
    } catch (error) {
      setFeedbackTitle('Error');
      setFeedbackMessage(error instanceof Error ? error.message : 'No se pudo crear la cita. Por favor intenta de nuevo.');
      setFeedbackType('error');
      setFeedbackOpen(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader
        onNavigate={handleNavigate}
        /* Borramos onAdminClick de aquí */
      />
      <HeroSection onCtaClick={handleCTA}
        onAppointmentClick={handleAppointmentClick} />
        <AppointmentSection onAppointmentClick={handleAppointmentClick}/>
      <AboutSection />
      <OffersSection />
      <ServicesSection />
      <ProductsSection />
      <BranchesSection />

      {/* Se lo pasamos al Footer */}
      <LandingFooter onAdminClick={handleAdminClick} />

      {isAppointmentModalOpen && (
        <AppointmentModal
          branches={branches}
          services={services}
          appointments={appointments}
          isPublic={true}
          onSave={handleSaveAppointment}
          onClose={() => setIsAppointmentModalOpen(false)}
          onShowError={handleShowError}
        />
      )}


      <FeedbackModal
        isOpen={feedbackOpen}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        duration={3000}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}