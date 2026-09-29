import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../services/api/apiClient";

import pendientesIcon from "../atoms/icons/pendientes.svg";
import procesoIcon from "../atoms/icons/proceso.svg";
import ofertasDashIcon from "../atoms/icons/OfertasDash.svg";
import empleadosDashIcon from "../atoms/icons/empleadosDash.svg";

import type { AppointmentN, BranchN, EmployeeN, OfferN } from "../organisms/graficos/types";
import {
  addDays,
  formatDate,
  isSameDay,
  normalizeAppointment,
  normalizeBranch,
  normalizeEmployee,
  normalizeOffer,
  pad2,
  startOfDay,
  withinDaysFromNow,
} from "../organisms/graficos/utils";

import { styles, COLOR_BLUE, COLOR_GRAY, COLOR_RED } from "../organisms/graficos/styles";
import { usePagination } from "../organisms/graficos/hooks/usePagination";

import { DashboardGrid } from "../organisms/graficos/DashboardGrid";
import { PendingModal } from "../organisms/graficos/modals/PendingModal";
import { InProcessModal } from "../organisms/graficos/modals/InProcessModal";
import { OffersModal } from "../organisms/graficos/modals/OffersModal";
import { EmployeesModal } from "../organisms/graficos/modals/EmployeesModal";
import { DetailModal } from "../organisms/graficos/modals/DetailModal";

export const GraficosDashboard = () => {
  const [appointments, setAppointments] = useState<AppointmentN[]>([]);
  const [branches, setBranches] = useState<BranchN[]>([]);
  const [employees, setEmployees] = useState<EmployeeN[]>([]);
  const [offers, setOffers] = useState<OfferN[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | "all">("all");
  const [barsEndDate, setBarsEndDate] = useState<Date>(startOfDay(new Date()));
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [openModal, setOpenModal] = useState<
    null | "pending" | "inProcess" | "employees" | "offers" | "detail"
  >(null);
  const [detailItem, setDetailItem] = useState<AppointmentN | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const [appJson, brJson, empJson, offerJson] = await Promise.all([
        apiRequest<any[]>("/api/Appointment"),
        apiRequest<any[]>("/api/Branch"),
        apiRequest<any[]>("/api/Employee"),
        apiRequest<any[]>("/api/Offer"),
      ]);

      const brList: BranchN[] = Array.isArray(brJson) ? brJson.map(normalizeBranch) : [];
      const branchMap = new Map(brList.map((b) => [b.id, b.name]));

      const appList: AppointmentN[] = Array.isArray(appJson)
        ? appJson.map(normalizeAppointment).map((a) => ({
            ...a,
            branchName: a.branchName ?? (a.branchId ? branchMap.get(a.branchId) : undefined),
          }))
        : [];

      const empList: EmployeeN[] = Array.isArray(empJson)
        ? empJson.map(normalizeEmployee).map((e) => ({
            ...e,
            branchName: e.branchName ?? (e.idBranch ? branchMap.get(e.idBranch) : undefined),
          }))
        : [];

      const offerList: OfferN[] = Array.isArray(offerJson) ? offerJson.map(normalizeOffer) : [];

      setBranches(brList);
      setAppointments(appList);
      setEmployees(empList);
      setOffers(offerList);
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (selectedBranchId === "all") return appointments;
    return appointments.filter((a) => a.branchId === selectedBranchId);
  }, [appointments, selectedBranchId]);

  const filteredEmployees = useMemo(() => {
    if (selectedBranchId === "all") return employees;
    return employees.filter((e) => e.idBranch === selectedBranchId);
  }, [employees, selectedBranchId]);

  const activeEmployees = useMemo(
    () => filteredEmployees.filter((e) => e.isActive),
    [filteredEmployees]
  );

  const offersExpiringSoon = useMemo(() => {
    return offers
      .filter((o) => o.isActive)
      .filter((o) => withinDaysFromNow(o.endDate, 14))
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  }, [offers]);

  const pendingToConfirm = useMemo(
    () => filteredAppointments.filter((a) => a.status === "Pendiente"),
    [filteredAppointments]
  );

  const inProcess = useMemo(
    () => filteredAppointments.filter((a) => a.status === "En Proceso"),
    [filteredAppointments]
  );

  const upcomingConfirmedTop5 = useMemo(() => {
    const now = new Date().getTime();
    return filteredAppointments
      .filter((a) => a.status === "Confirmada")
      .filter((a) => new Date(a.dateTime).getTime() >= now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .slice(0, 5);
  }, [filteredAppointments]);

  const donutCounts = useMemo(() => {
    const p = filteredAppointments.filter((a) => a.status === "Pendiente").length;
    const c = filteredAppointments.filter((a) => a.status === "Confirmada").length;
    const ip = filteredAppointments.filter((a) => a.status === "En Proceso").length;
    return { p, c, ip };
  }, [filteredAppointments]);

  const donutData = useMemo(() => {
    return {
      labels: ["Pendiente", "Confirmada", "En Proceso"],
      datasets: [
        {
          data: [donutCounts.p, donutCounts.c, donutCounts.ip],
          backgroundColor: [COLOR_RED, COLOR_BLUE, COLOR_GRAY],
          borderColor: ["#ffffff", "#ffffff", "#ffffff"],
          borderWidth: 2,
        },
      ],
    };
  }, [donutCounts]);

  const donutOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" as const } },
      cutout: "68%",
    };
  }, []);

  const last7Window = useMemo(() => {
    const end = startOfDay(barsEndDate);
    const start = addDays(end, -6);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) days.push(addDays(start, i));
    return { start, end, days };
  }, [barsEndDate]);

  const completedCounts = useMemo(() => {
    return last7Window.days.map((day) => {
      return filteredAppointments.filter(
        (a) => a.status === "Completada" && isSameDay(new Date(a.dateTime), day)
      ).length;
    });
  }, [filteredAppointments, last7Window]);

  const barData = useMemo(() => {
    return {
      labels: last7Window.days.map((d) => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`),
      datasets: [
        {
          label: "Completadas",
          data: completedCounts,
          backgroundColor: COLOR_BLUE,
          borderColor: COLOR_BLUE,
          borderWidth: 1,
        },
      ],
    };
  }, [last7Window, completedCounts]);

  const barOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: COLOR_GRAY } },
        x: { grid: { color: "rgba(0,0,0,0)" } },
      },
    };
  }, []);

  const canGoNextWeek = useMemo(() => {
    const today = startOfDay(new Date()).getTime();
    return startOfDay(barsEndDate).getTime() < today;
  }, [barsEndDate]);

  const pendingPaged = usePagination(
    pendingToConfirm
      .slice()
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
    5
  );

  const inProcessPaged = usePagination(
    inProcess
      .slice()
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
    5
  );

  const employeesPaged = usePagination(
    activeEmployees.slice().sort((a, b) => a.name.localeCompare(b.name)),
    5
  );

  const offersPaged = usePagination(offersExpiringSoon, 5);

  useEffect(() => {
    if (!openModal) return;
    pendingPaged.reset();
    inProcessPaged.reset();
    employeesPaged.reset();
    offersPaged.reset();
  }, [openModal]);

  const barsRangeLabel = `${formatDate(last7Window.start.toISOString())} - ${formatDate(
    last7Window.end.toISOString()
  )}`;

  return (
    <div style={styles.page}>
      {loading ? (
        <div style={styles.infoBox}>Cargando dashboard...</div>
      ) : errorMsg ? (
        <div style={styles.errorBox}>
          {errorMsg}
          <button type="button" style={styles.retryBtn} onClick={fetchAll}>
            Reintentar
          </button>
        </div>
      ) : null}

      <DashboardGrid
        branches={branches}
        selectedBranchId={selectedBranchId}
        onBranchChange={setSelectedBranchId}
        pendingCount={pendingToConfirm.length}
        inProcessCount={inProcess.length}
        offersCount={offersExpiringSoon.length}
        employeesCount={activeEmployees.length}
        pendientesIcon={pendientesIcon}
        procesoIcon={procesoIcon}
        ofertasDashIcon={ofertasDashIcon}
        empleadosDashIcon={empleadosDashIcon}
        donutData={donutData}
        donutOptions={donutOptions}
        upcomingConfirmedTop5={upcomingConfirmedTop5}
        barData={barData}
        barOptions={barOptions}
        barsRangeLabel={barsRangeLabel}
        canGoNextWeek={canGoNextWeek}
        onPrevWeek={() => setBarsEndDate(addDays(barsEndDate, -7))}
        onNextWeek={() => setBarsEndDate(addDays(barsEndDate, 7))}
        onOpenPending={() => setOpenModal("pending")}
        onOpenInProcess={() => setOpenModal("inProcess")}
        onOpenOffers={() => setOpenModal("offers")}
        onOpenEmployees={() => setOpenModal("employees")}
      />

      <PendingModal
        isOpen={openModal === "pending"}
        itemsTotal={pendingToConfirm}
        pageItems={pendingPaged.pageItems}
        page={pendingPaged.page}
        totalPages={pendingPaged.totalPages}
        canPrev={pendingPaged.canPrev}
        canNext={pendingPaged.canNext}
        onPrev={pendingPaged.prev}
        onNext={pendingPaged.next}
        onClose={() => setOpenModal(null)}
        onOpenDetail={(a) => {
          setDetailItem(a);
          setOpenModal("detail");
        }}
      />

      <InProcessModal
        isOpen={openModal === "inProcess"}
        itemsTotal={inProcess}
        pageItems={inProcessPaged.pageItems}
        page={inProcessPaged.page}
        totalPages={inProcessPaged.totalPages}
        canPrev={inProcessPaged.canPrev}
        canNext={inProcessPaged.canNext}
        onPrev={inProcessPaged.prev}
        onNext={inProcessPaged.next}
        onClose={() => setOpenModal(null)}
        onOpenDetail={(a) => {
          setDetailItem(a);
          setOpenModal("detail");
        }}
      />

      <OffersModal
        isOpen={openModal === "offers"}
        itemsTotal={offersExpiringSoon}
        pageItems={offersPaged.pageItems}
        page={offersPaged.page}
        totalPages={offersPaged.totalPages}
        canPrev={offersPaged.canPrev}
        canNext={offersPaged.canNext}
        onPrev={offersPaged.prev}
        onNext={offersPaged.next}
        onClose={() => setOpenModal(null)}
      />

      <EmployeesModal
        isOpen={openModal === "employees"}
        itemsTotal={activeEmployees}
        pageItems={employeesPaged.pageItems}
        page={employeesPaged.page}
        totalPages={employeesPaged.totalPages}
        canPrev={employeesPaged.canPrev}
        canNext={employeesPaged.canNext}
        onPrev={employeesPaged.prev}
        onNext={employeesPaged.next}
        onClose={() => setOpenModal(null)}
      />

      <DetailModal
        isOpen={openModal === "detail"}
        detailItem={detailItem}
        onClose={() => {
          setOpenModal(null);
          setDetailItem(null);
        }}
      />
    </div>
  );
};