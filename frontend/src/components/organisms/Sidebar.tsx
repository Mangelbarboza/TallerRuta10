import { DashboardMenuItem } from '../molecules/DashboardMenuItem';


import CitasIcon from '../atoms/icons/citas.svg?react';
import ClientesIcon from '../atoms/icons/clientes.svg?react';
import EmpleadosIcon from '../atoms/icons/empleados.svg?react';
import OfertasIcon from '../atoms/icons/ofertas.svg?react';
import ProductosIcon from '../atoms/icons/productos.svg?react';
import ProveedoresIcon from '../atoms/icons/proveedores.svg?react';
import ServiciosIcon from '../atoms/icons/servicios.svg?react';
import SucursalesIcon from '../atoms/icons/sucursales.svg?react';
import DashboardIcon from '../atoms/icons/dashboard.svg?react';

const colors = {
  sidebarBg: '#161A59',
};

export const Sidebar = () => { 
  return (
    <aside style={{ 
      width: '260px', 
      backgroundColor: colors.sidebarBg, 
      display: 'flex', 
      flexDirection: 'column',
      paddingTop: '20px', 
      height: '100%', 
      color: 'white'
    }}>

      <nav>
  <DashboardMenuItem to="/admin/dashboard" icon={<DashboardIcon width={18} height={18} />} label="Dashboard" />
  <DashboardMenuItem to="/admin/sucursales" icon={<SucursalesIcon width={18} height={18} />} label="Sucursales" />
  <DashboardMenuItem to="/admin/clientes" icon={<ClientesIcon width={18} height={18} />} label="Clientes" />
  <DashboardMenuItem to="/admin/servicios" icon={<ServiciosIcon width={18} height={18} />} label="Servicios" />
  <DashboardMenuItem to="/admin/proveedores" icon={<ProveedoresIcon width={18} height={18} />} label="Proveedores" />
  <DashboardMenuItem to="/admin/ofertas" icon={<OfertasIcon width={18} height={18} />} label="Ofertas" />
  <DashboardMenuItem to="/admin/productos" icon={<ProductosIcon width={18} height={18} />} label="Productos" />
  <DashboardMenuItem to="/admin/empleados" icon={<EmpleadosIcon width={18} height={18} />} label="Empleados" />
  <DashboardMenuItem to="/admin/citas" icon={<CitasIcon width={18} height={18} />} label="Citas" />
</nav>

      

      <div style={{ marginTop: 'auto', padding: '20px' }}>

      </div>
    </aside>
  );
};