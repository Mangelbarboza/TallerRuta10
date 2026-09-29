import type { OfferN } from "../types";
import { Modal } from "../../../molecules/Modal";
import { PaginationFooter } from "../../../molecules/PaginationFooter";
import { styles } from "../styles";
import { formatDate } from "../utils";

export function OffersModal(props: {
  isOpen: boolean;
  itemsTotal: OfferN[];
  pageItems: OfferN[];
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
      title="Ofertas prontas a vencer"
      subtitle="Activas y vencen en los próximos 14 días"
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
        <div style={styles.empty}>No hay ofertas por vencer pronto.</div>
      ) : (
        <div style={styles.modalList}>
          {props.pageItems.map((o) => (
            <div key={o.id} style={styles.modalRow}>
              <div>
                <div style={styles.modalRowTitle}>
                  Oferta #{o.id}
                  {typeof o.discount === "number" ? (
                    <>
                      {" "}
                      <span style={styles.muted}>•</span> {o.discount}%
                    </>
                  ) : null}
                </div>
                <div style={styles.modalRowSub}>
                  Inicio: {formatDate(o.startDate)} <span style={styles.muted}>•</span> Vence: {formatDate(o.endDate)}
                </div>
              </div>
              <span style={{ ...styles.tag, ...styles.tagDanger }}>Por vencer</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}