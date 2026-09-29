import type { AppointmentN } from "../types";
import { Modal } from "../../../molecules/Modal";
import { styles } from "../styles";
import { formatDateTime } from "../utils";
import { DetailRow } from "../../../atoms/DetailRow";

export function DetailModal(props: {
  isOpen: boolean;
  detailItem: AppointmentN | null;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={props.isOpen}
      title="Detalle de cita"
      subtitle="Información completa del registro"
      onClose={props.onClose}
    >
      {!props.detailItem ? (
        <div style={styles.empty}>No hay información para mostrar.</div>
      ) : (
        <div style={styles.detailGrid}>
          <DetailRow label="Cliente" value={props.detailItem.clientName ?? "-"} />
          <DetailRow label="Servicio" value={props.detailItem.serviceName ?? "-"} />
          <DetailRow label="Sucursal" value={props.detailItem.branchName ?? "-"} />
          <DetailRow label="Fecha y hora" value={formatDateTime(props.detailItem.dateTime)} />
          <DetailRow label="Estado" value={String(props.detailItem.status)} />
          <DetailRow label="Observaciones" value={props.detailItem.observations ?? "-"} />
          <DetailRow label="Placa" value={props.detailItem.vehiclePlate ?? "-"} />
          <DetailRow label="Marca" value={props.detailItem.vehicleBrand ?? "-"} />
        </div>
      )}
    </Modal>
  );
}