import { useState } from 'react';

export interface ColumnConfig<T> {
  header: string;
  key: keyof T;
}

// funciones onEdit y onDelete opcionales (?)
interface GenericTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}


export function GenericTable<T>({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  onView
}: GenericTableProps<T>) {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = data.slice(startIndex, endIndex);

  if (isLoading) return <p style={{ padding: '20px', textAlign: 'center' }}>Cargando datos de la UCR...</p>;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #EEE' }}>
            {columns.map((col, i) => (
              <th key={i} style={{ padding: '12px', color: '#666' }}>{col.header}</th>
            ))}
            <th style={{ padding: '12px', color: '#666' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} style={{ padding: '20px', textAlign: 'center' }}>No hay datos disponibles</td></tr>
          ) : (
            currentData.map((item, rowIndex) => (
              <tr key={rowIndex} style={{ borderBottom: '1px solid #EEE' }}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{ padding: '12px' }}>
                    {String(item[col.key])}
                  </td>
                ))}
                <td style={{ padding: '12px' }}>
                  {/* BOTÓN VER DETALLE */}
                  <button
                    onClick={() => onView && onView(item)}
                    style={{
                      color: '#0F8B8D',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Detalle
                  </button>

                  {/* conexion del botón EDITAR */}
                  <button
                    onClick={() => onEdit && onEdit(item)}
                    style={{ color: '#161A59', border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}
                  >
                    Editar
                  </button>

                  {/* conexion del botón ELIMINAR */}
                  <button
                    onClick={() => onDelete && onDelete(item)}
                    style={{ color: '#F21D2F', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        marginTop: '20px'
      }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: currentPage === 1 ? '#E5E7EB' : '#F21D2F',
            color: currentPage === 1 ? '#9CA3AF' : 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
        >
          ← Anterior
        </button>

        <span style={{
          fontWeight: 600,
          color: '#374151'
        }}>
          Página {currentPage} de {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: currentPage === totalPages ? '#E5E7EB' : '#161A59',
            color: currentPage === totalPages ? '#9CA3AF' : 'white',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}