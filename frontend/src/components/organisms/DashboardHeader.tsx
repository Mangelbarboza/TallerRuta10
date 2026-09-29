import { useNavigate } from "react-router-dom";
import Logo from '../atoms/icons/logoRuta10.svg?react';

const colors = {
  primaryRed: '#F21D2F',
  sidebarBg: '#161A59',
};

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <header style={{
      height: '70px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E0E0E0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      width: '100%',
      zIndex: 100,
      position: 'relative'
    }}>
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#333'
      }}>
        <span style={{ display: 'inline-flex', width: 50, height: 50, color: colors.primaryRed }}>
          <Logo width="100%" height="100%" />
        </span>

        <span style={{ fontStyle: 'italic' }}>AUTO SERVICIO <span style={{ color: colors.primaryRed }}>RUTA 10</span></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: colors.sidebarBg, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
          }}>
            LC
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Leo Cortés</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Administrador</div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("jwt");
              localStorage.removeItem("jwt_expiration");
              localStorage.removeItem("adminAuth");
              navigate("/");
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              marginLeft: '8px'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};