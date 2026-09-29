import type { BranchN } from "../organisms/graficos/types";
import { styles } from "../organisms/graficos/styles";

export const BranchSelect = (props: {
  branches: BranchN[];
  value: number | "all";
  onChange: (v: number | "all") => void;
}) => {
  const { branches, value, onChange } = props;

  return (
    <select
      value={value === "all" ? "all" : String(value)}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "all" ? "all" : Number(v));
      }}
      style={styles.select}
      title="Filtrar por sucursal"
    >
      <option value="all">Todas</option>
      {branches.map((b) => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ))}
    </select>
  );
};
