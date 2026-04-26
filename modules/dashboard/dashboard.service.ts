import {
  DashboardAppointmentRow,
  DashboardCancelledRow,
  dashboardRepository,
} from "@/modules/dashboard/repositories/dashboard.repository";
import {
  DashboardAlert,
  DashboardSnapshot,
  DashboardTodayAppointment,
  DashboardUpcomingAppointment,
} from "@/modules/dashboard/types/dashboard.types";
import {
  calculateMonthlyBalance,
  getCurrentMonthRange,
  getNowIsoDateTime,
  getRecentCutoffIsoDateTime,
  getTodayDate,
  summarizeText,
} from "@/modules/dashboard/utils/dashboard-calculations";

const UPCOMING_APPOINTMENTS_LIMIT = 8;
const ALERTS_LIMIT = 5;

const mapTodayAppointment = (
  item: DashboardAppointmentRow,
): DashboardTodayAppointment => ({
  id: item.id,
  patientName: item.patientName,
  startDate: item.startDate,
  status: item.status,
  notesSummary: summarizeText(item.notes),
});

const mapUpcomingAppointment = (
  item: DashboardAppointmentRow,
): DashboardUpcomingAppointment => ({
  id: item.id,
  patientName: item.patientName,
  startDate: item.startDate,
  status: item.status,
});

const mapCancelledAlert = (item: DashboardCancelledRow): DashboardAlert => ({
  id: `cancelado-${item.id}`,
  type: "cancelado",
  patientName: item.patientName,
  startDate: item.startDate,
  description:
    summarizeText(item.notes) ?? "Agendamento cancelado recentemente.",
});

const mapOverdueAlert = (item: DashboardAppointmentRow): DashboardAlert => ({
  id: `atrasado-${item.id}`,
  type: "atrasado",
  patientName: item.patientName,
  startDate: item.startDate,
  description: "Agendamento já passou do horário previsto e segue pendente.",
});

export const dashboardService = {
  async getSnapshot(): Promise<DashboardSnapshot> {
    const monthRange = getCurrentMonthRange();
    const today = getTodayDate();
    const nowIsoDateTime = getNowIsoDateTime();
    const recentCutoff = getRecentCutoffIsoDateTime();

    const [
      totalPatients,
      todayAppointmentsRows,
      upcomingAppointmentsRows,
      completedMonth,
      monthlyFinancialTotals,
      recentCancelledRows,
      overdueRows,
    ] = await Promise.all([
      dashboardRepository.countPatients(),
      dashboardRepository.listTodayAppointments(today),
      dashboardRepository.listUpcomingAppointments(
        nowIsoDateTime,
        UPCOMING_APPOINTMENTS_LIMIT,
      ),
      dashboardRepository.countCompletedAppointmentsInMonth(
        monthRange.startDate,
        monthRange.endDate,
      ),
      dashboardRepository.getMonthlyFinancialTotals(
        monthRange.startDate,
        monthRange.endDate,
      ),
      dashboardRepository.listRecentCancelledAppointments(
        recentCutoff,
        ALERTS_LIMIT,
      ),
      dashboardRepository.listOverdueAppointments(nowIsoDateTime, ALERTS_LIMIT),
    ]);

    const todayAppointments = todayAppointmentsRows.map(mapTodayAppointment);
    const upcomingAppointments = upcomingAppointmentsRows.map(
      mapUpcomingAppointment,
    );

    const monthlyFinancial = {
      entries: monthlyFinancialTotals.entries,
      exits: monthlyFinancialTotals.exits,
      balance: calculateMonthlyBalance(
        monthlyFinancialTotals.entries,
        monthlyFinancialTotals.exits,
      ),
    };

    const alerts = [
      ...recentCancelledRows.map(mapCancelledAlert),
      ...overdueRows.map(mapOverdueAlert),
    ].slice(0, ALERTS_LIMIT);

    return {
      summary: {
        totalPatients,
        appointmentsToday: todayAppointments.length,
        appointmentsCompletedMonth: completedMonth,
        monthBalance: monthlyFinancial.balance,
        monthEntries: monthlyFinancial.entries,
        monthExits: monthlyFinancial.exits,
      },
      todayAppointments,
      upcomingAppointments,
      monthlyFinancial,
      alerts,
      generatedAt: nowIsoDateTime,
    };
  },
};
