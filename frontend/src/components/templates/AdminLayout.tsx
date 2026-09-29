import { Outlet } from 'react-router-dom'; // <--- Importamos Outlet
import { Sidebar } from '../organisms/Sidebar';
import { DashboardHeader } from '../organisms/DashboardHeader';

export const AdminLayout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw',
      overflow: 'hidden',
      fontFamily: 'sans-serif'
    }}>
      
      <DashboardHeader />

      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden' 
      }}>
        
        <Sidebar />

        <main style={{ 
          flex: 1, 
          backgroundColor: '#F2F2F2', 
          padding: '30px', 
          overflowY: 'auto' 
        }}>
         
          <Outlet /> 
        </main>

      </div>
    </div>
  );
};