import type { EmployeeN } from "../types";
import { Modal } from "../../../molecules/Modal";
import { PaginationFooter } from "../../../molecules/PaginationFooter";
import { styles } from "../styles";

export function EmployeesModal(props: {
  isOpen: boolean;
  itemsTotal: EmployeeN[];
  pageItems: EmployeeN[];
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={props.isOpen}
      title="Información rápida de empleados"
      subtitle="Teléfono y correo (filtra por sucursal si querés)"
      onClose={props.onClose}
      footer={
        <PaginationFooter
          page={props.page}
          totalPages={props.totalPages}
          canPrev={props.canPrev}
          canNext={props.canNext}
          onPrev={props.onPrev}
          onNext={props.onNext}
        />
      }
    >
      {props.itemsTotal.length === 0 ? (
        <div style={styles.empty}>No hay empleados activos para mostrar.</div>
      ) : (
        <div style={styles.modalList}>
          {props.pageItems.map((e) => (
            <div key={e.id} style={styles.modalRow}>
              <div style={{ minWidth: 0 }}>
                <div style={styles.modalRowTitle}>{e.name}</div>
                <div style={styles.modalRowSub}>
                  {e.phone ? `Tel: ${e.phone}` : "Tel: -"}
                  <span style={styles.muted}> • </span>
                  {e.email ? `Correo: ${e.email}` : "Correo: -"}
                  {e.branchName ? (
                    <>
                      <span style={styles.muted}> • </span>
                      {e.branchName}
                    </>
                  ) : null}
                </div>
              </div>
              <span style={{ ...styles.tag, ...styles.tagOk }}>Activo</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}