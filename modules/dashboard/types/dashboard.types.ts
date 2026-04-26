import { AppointmentStatus } from "@/modules/appointments/types/appointment.types";

export type DashboardSummaryMetrics = {
  totalPatients: number;
  appointmentsToday: number;
  appointmentsCompletedMonth: number;
  monthBalance: number;
  monthEntries: number;
  monthExits: number;
};

export type DashboardTodayAppointment = {
  id: number;
  patientName: string;
  startDate: string;
  status: AppointmentStatus;
  notesSummary: string | null;
};

export type DashboardUpcomingAppointment = {
  id: number;
  patientName: string;
  startDate: string;
  status: AppointmentStatus;
};

export type DashboardFinancialSummary = {
  entries: number;
  exits: number;
  balance: number;
};

export type DashboardAlertType = "cancelado" | "atrasado";

export type DashboardAlert = {
  id: string;
  type: DashboardAlertType;
  patientName: string;
  startDate: string;
  description: string;
};

export type DashboardSnapshot = {
  summary: DashboardSummaryMetrics;
  todayAppointments: DashboardTodayAppointment[];
  upcomingAppointments: DashboardUpcomingAppointment[];
  monthlyFinancial: DashboardFinancialSummary;
  alerts: DashboardAlert[];
  generatedAt: string;
};
