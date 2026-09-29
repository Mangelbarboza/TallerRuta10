import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from "react";

import { LandingPage } from '../pages/public/LandingPage';
import { AdminLayout } from '../components/templates/AdminLayout';

import { Graficos } from '../pages/admin/Graficos';
import { Sucursales } from '../pages/admin/Sucursales';
import { Clientes } from '../pages/admin/Clientes';
import { Servicios } from '../pages/admin/Servicios';
import { Proveedores } from '../pages/admin/Proveedores';
import { Ofertas } from '../pages/admin/Ofertas';
import { Productos } from '../pages/admin/Productos';
import { Empleados } from '../pages/admin/Employees';
import { Citas } from '../pages/admin/Appointments';

import { LoginAdmin } from '../pages/LoginAdmin';

import { AllProductsPage } from "../pages/public/AllProductsPage";
import { AllOffersPage } from "../pages/public/AllOffersPage";
import { AllServicesPage } from "../pages/public/AllServicesPage";

function isJwtValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return false;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const payload = JSON.parse(json);

    // exp viene en segundos UNIX
    const exp = payload?.exp;
    if (typeof exp !== "number") return true; // si no viene exp, lo consideramos válido (raro)
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}

export const AppRouter = () => {

  const RequireAuth = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem("jwt");

    if (!isJwtValid(token)) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("jwt_expiration");
      localStorage.removeItem("adminAuth"); // por compatibilidad
      return <Navigate to="/admin/login" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/productos" element={<AllProductsPage />} />
        <Route path="/ofertas" element={<AllOffersPage />} />
        <Route path="/servicios" element={<AllServicesPage />} />

        {/* Login Admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* ADMIN protegido */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Graficos />} />
          <Route path="dashboard" element={<Graficos />} />
          <Route path="sucursales" element={<Sucursales />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="ofertas" element={<Ofertas />} />
          <Route path="productos" element={<Productos />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="citas" element={<Citas />} />
        </Route>

        {/* Desconocida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};