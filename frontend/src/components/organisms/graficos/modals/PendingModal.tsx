import type { AppointmentN } from "../types";
import { Modal } from "../../../molecules/Modal";
import { PaginationFooter } from "../../../molecules/PaginationFooter";
import { styles } from "../styles";
import { formatDateTime } from "../utils";

export function PendingModal(props: {
  isOpen: boolean;
  itemsTotal: AppointmentN[];
  pageItems: AppointmentN[];
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onOpenDetail: (a: AppointmentN) => void;
}) {
  return (
    <Modal
      isOpen={props.isOpen}
      title="Citas pendientes de confirmar"
      subtitle="Estado: Pendiente"
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
        <div style={styles.empty}>No hay citas pendientes.</div>
      ) : (
        <div style={styles.modalList}>
          {props.pageItems.map((a) => (
            <div key={a.id} style={styles.modalRow}>
              <div style={{ minWidth: 0 }}>
                <div style={styles.modalRowTitle}>
                  {a.clientName ?? "Cliente"} <span style={styles.muted}>•</span> {a.serviceName ?? "Servicio"}
                </div>
                <div style={styles.modalRowSub}>
                  {formatDateTime(a.dateTime)} <span style={styles.muted}>•</span> {a.branchName ?? "Sucursal"}
                </div>
              </div>
              <div style={styles.modalRowRight}>
                <button
                  type="button"
                  style={styles.eyeBtn}
                  title="Ver detalle"
                  onClick={() => props.onOpenDetail(a)}
                >
                  👁
                </button>
                <span style={{ ...styles.tag, ...styles.tagWarn }}>Pendiente</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}