import { styles } from "../organisms/graficos/styles";

export function KpiCard(props: {
  title: string;
  value: number;
  subtitle?: string;
  iconSrc: string;
  onClick?: () => void;
}) {
  const { title, value, subtitle, iconSrc, onClick } = props;

  return (
    <button type="button" onClick={onClick} style={styles.cardButton}>
      <div style={styles.card}>
        <div style={styles.cardTop}>
          <div style={styles.cardIcon}>
            <img src={iconSrc} alt="" style={{ width: 18, height: 18 }} />
          </div>
          <div style={styles.cardTitle}>{title}</div>
        </div>
        <div style={styles.cardValueRow}>
          <div style={styles.cardValue}>{value}</div>
          <div style={styles.cardCta}>Ver detalle</div>
        </div>
        {subtitle ? <div style={styles.cardSub}>{subtitle}</div> : null}
      </div>
    </button>
  );
}