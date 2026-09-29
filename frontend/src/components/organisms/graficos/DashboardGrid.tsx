import { useMemo } from "react";
import type { AppointmentN, BranchN } from "./types";
import { BranchSelect } from "../../atoms/BranchSelect";
import { KpiCard } from "../../molecules/KpiCard";
import { styles } from "./styles";
import { formatDateTime } from "./utils";
import { useViewportWidth } from "./hooks/useViewportWidth";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle);

export function DashboardGrid(props: {
  branches: BranchN[];
  selectedBranchId: number | "all";
  onBranchChange: (v: number | "all") => void;

  pendingCount: number;
  inProcessCount: number;
  offersCount: number;
  employeesCount: number;

  pendientesIcon: string;
  procesoIcon: string;
  ofertasDashIcon: string;
  empleadosDashIcon: string;

  donutData: any;
  donutOptions: any;

  upcomingConfirmedTop5: AppointmentN[];

  barData: any;
  barOptions: any;

  barsRangeLabel: string;
  canGoNextWeek: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;

  onOpenPending: () => void;
  onOpenInProcess: () => void;
  onOpenOffers: () => void;
  onOpenEmployees: () => void;
}) {
  const width = useViewportWidth();

  const layout = useMemo<"three" | "two" | "one">(() => {
    if (width < 1100) return "one";
    if (width < 1500) return "two";
    return "three";
  }, [width]);

  const gridStyle = useMemo(() => {
    if (layout === "three") {
      return {
        ...styles.grid,
        width: "100%",
        minWidth: 0,
        gridTemplateColumns:
          "minmax(280px, 1fr) minmax(460px, 1.35fr) minmax(280px, 1fr)",
      };
    }
    if (layout === "two") {
      return { ...styles.grid, width: "100%", minWidth: 0, gridTemplateColumns: "1fr 1fr" };
    }
    return { ...styles.grid, width: "100%", minWidth: 0, gridTemplateColumns: "1fr" };
  }, [layout]);

  const leftPos = useMemo(() => {
    if (layout === "three") return {};
    if (layout === "two") return { gridColumn: "1 / 2", gridRow: 2 };
    return { gridColumn: "1 / -1", gridRow: 2 };
  }, [layout]);

  const centerPos = useMemo(() => {
    if (layout === "three") return {};
    return { gridColumn: "1 / -1", gridRow: 1 };
  }, [layout]);

  const rightPos = useMemo(() => {
    if (layout === "three") return {};
    if (layout === "two") return { gridColumn: "2 / 3", gridRow: 2 };
    return { gridColumn: "1 / -1", gridRow: 3 };
  }, [layout]);

  return (
    <div style={gridStyle}>
      <div style={{ ...styles.col, ...leftPos, minWidth: 0 }}>
        <KpiCard
          title="Citas pendientes de confirmar"
          value={props.pendingCount}
          subtitle="Requieren acción"
          onClick={props.onOpenPending}
          iconSrc={props.pendientesIcon}
        />
        <KpiCard
          title="Citas en proceso"
          value={props.inProcessCount}
          subtitle="Atendiéndose ahora"
          onClick={props.onOpenInProcess}
          iconSrc={props.procesoIcon}
        />

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <div style={styles.panelTitle}>Distribución de estados</div>
              <div style={styles.panelSubtitle}>Pendiente, Confirmada, En Proceso</div>
            </div>
            <BranchSelect
              branches={props.branches}
              value={props.selectedBranchId}
              onChange={props.onBranchChange}
            />
          </div>
          <div style={styles.chartBox}>
            <Doughnut data={props.donutData} options={props.donutOptions} />
          </div>
        </div>
      </div>

      <div style={{ ...styles.center, ...centerPos, minWidth: 0 }}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <div style={styles.panelTitle}>Próximas 5 citas confirmadas</div>
              <div style={styles.panelSubtitle}>Ordenadas por fecha y hora</div>
            </div>
            <span style={styles.badge}>{props.upcomingConfirmedTop5.length}</span>
          </div>

          <div style={{ marginTop: 12 }}>
            {props.upcomingConfirmedTop5.length === 0 ? (
              <div style={styles.empty}>No hay citas confirmadas pronto.</div>
            ) : (
              <div style={styles.list}>
                {props.upcomingConfirmedTop5.map((a) => (
                  <div key={a.id} style={styles.listRow}>
                    <div style={styles.listLeft}>
                      <div style={styles.listTime}>{formatDateTime(a.dateTime)}</div>
                      <div style={styles.listMain}>
                        <span style={styles.listClient}>{a.clientName ?? "Cliente"}</span>
                        <span style={styles.dot}>•</span>
                        <span style={styles.listService}>{a.serviceName ?? "Servicio"}</span>
                      </div>
                      <div style={styles.listMeta}>{a.branchName ?? "Sucursal"}</div>
                    </div>
                    <div style={styles.statusPill}>Confirmada</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ ...styles.col, ...rightPos, minWidth: 0 }}>
        <KpiCard
          title="Ofertas prontas a vencer"
          value={props.offersCount}
          subtitle="Próximos 14 días"
          onClick={props.onOpenOffers}
          iconSrc={props.ofertasDashIcon}
        />
        <KpiCard
          title="Información rápida de empleados"
          value={props.employeesCount}
          subtitle="Activos"
          onClick={props.onOpenEmployees}
          iconSrc={props.empleadosDashIcon}
        />

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <div style={styles.panelTitle}>Citas completadas por día</div>
              <div style={styles.panelSubtitle}>{props.barsRangeLabel}</div>
            </div>

            <div style={styles.headerRight}>
              <BranchSelect
                branches={props.branches}
                value={props.selectedBranchId}
                onChange={props.onBranchChange}
              />
              <div style={styles.weekNav}>
                <button type="button" style={styles.weekBtn} onClick={props.onPrevWeek} title="Semana anterior">
                  ‹
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.weekBtn,
                    opacity: props.canGoNextWeek ? 1 : 0.45,
                    cursor: props.canGoNextWeek ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (!props.canGoNextWeek) return;
                    props.onNextWeek();
                  }}
                  disabled={!props.canGoNextWeek}
                  title="Semana siguiente"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          <div style={styles.chartBox}>
            <Bar data={props.barData} options={props.barOptions} />
          </div>

          <div style={styles.hintRow}>
            <span style={styles.hintDot} />
            <span style={styles.hintText}>Azul = completadas</span>
          </div>
        </div>
      </div>
    </div>
  );
}