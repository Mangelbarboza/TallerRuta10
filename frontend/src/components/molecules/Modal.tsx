import type { ReactNode } from "react";
import { styles } from "../organisms/graficos/styles";

export function Modal(props: {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  if (!props.isOpen) return null;

  return (
    <div style={styles.overlay} onMouseDown={props.onClose}>
      <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.modalTitle}>{props.title}</div>
            {props.subtitle ? <div style={styles.modalSubtitle}>{props.subtitle}</div> : null}
          </div>
          <button type="button" onClick={props.onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>
        <div style={styles.modalBody}>{props.children}</div>
        {props.footer ? <div style={styles.modalFooter}>{props.footer}</div> : null}
      </div>
    </div>
  );
}