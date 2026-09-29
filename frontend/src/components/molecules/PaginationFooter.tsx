import { styles } from "../organisms/graficos/styles";

export function PaginationFooter(props: {
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { page, totalPages, canPrev, canNext, onPrev, onNext } = props;

  if (totalPages <= 1) return <div />;

  return (
    <div style={styles.pager}>
      <button
        type="button"
        style={{
          ...styles.pagerBtn,
          opacity: canPrev ? 1 : 0.45,
          cursor: canPrev ? "pointer" : "not-allowed",
        }}
        onClick={onPrev}
        disabled={!canPrev}
        title="Anterior"
      >
        ‹
      </button>
      <div style={styles.pagerText}>
        Página <b>{page}</b> de <b>{totalPages}</b>
      </div>
      <button
        type="button"
        style={{
          ...styles.pagerBtn,
          opacity: canNext ? 1 : 0.45,
          cursor: canNext ? "pointer" : "not-allowed",
        }}
        onClick={onNext}
        disabled={!canNext}
        title="Siguiente"
      >
        ›
      </button>
    </div>
  );
}