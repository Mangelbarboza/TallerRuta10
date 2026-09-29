import type { CSSProperties } from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel: () => void;
  onlyClose?: boolean;
}

export const ConfirmDeleteModal = ({
  isOpen,
  title = "Confirmar eliminación",
  message,
  onConfirm,
  onCancel,
  onlyClose = false,
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#161A59",
              fontWeight: 600,
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: 0,
              fontSize: "15px",
              color: "#333",
            }}
          >
            {message}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          {onlyClose ? (
            <button onClick={onCancel} style={cancelBtn}>
              Cerrar
            </button>
          ) : (
            <>
              <button onClick={onCancel} style={cancelBtn}>
                Cancelar
              </button>
              <button onClick={onConfirm} style={deleteBtn}>
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const modalStyle: CSSProperties = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "420px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
};

const cancelBtn: CSSProperties = {
  padding: "8px 15px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteBtn: CSSProperties = {
  backgroundColor: "#F21D2F",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "4px",
  cursor: "pointer",
};
