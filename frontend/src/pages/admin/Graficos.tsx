import { ModuleTemplate } from "../../components/templates/ModuleTemplate";
import { GraficosDashboard } from "../../components/templates/GraficosDashboard";

export const Graficos = () => {
  return (
    <ModuleTemplate title="Gestión de reportes y graficos" buttonText="">
      <GraficosDashboard />
    </ModuleTemplate>
  );
};