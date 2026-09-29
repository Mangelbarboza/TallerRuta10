import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface DashboardMenuItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

export const DashboardMenuItem = ({ to, icon, label }: DashboardMenuItemProps) => {
  return (
    <NavLink 
      to={to} 
      end 

      className={({ isActive }) => 
        `sidebar-link ${isActive ? 'active' : ''}`
      }
    >

      <span style={{ marginRight: '10px', fontSize: '18px', display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>

      {label}
    </NavLink>
  );
};