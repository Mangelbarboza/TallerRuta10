import type { ReactNode } from 'react';
interface ModuleTemplateProps {
  title: string;
  buttonText?: string;
  onAddClick?: () => void; 
  children: ReactNode;
}

export const ModuleTemplate = ({ title, buttonText = "Agregar", onAddClick, children }: ModuleTemplateProps) => {
  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h1 style={{ color: '#161A59', margin: 0 }}>{title}</h1>
        <button 
          onClick={onAddClick}
          style={{ 
            backgroundColor: '#F21D2F', color: 'white', padding: '10px 20px', 
            border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' 
          }}
        >
          + {buttonText}
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', minHeight: '400px' }}>
        {children}
      </div>
    </div>
  );
};