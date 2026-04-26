import { AppointmentStatus } from "@/modules/appointments/types/appointment.types";
import { getDatabase } from "@/services/database";

export type DashboardAppointmentRow = {
  id: number;
  patientName: string;
  startDate: string;
  status: AppointmentStatus;
  notes: string | null;
};

export type DashboardCancelledRow = {
  id: number;
  patientName: string;
  startDate: string;
  notes: string | null;
};

export type DashboardFinancialMonthTotals = {
  entries: number;
  exits: number;
};

export const dashboardRepository = {
  async countPatients(): Promise<number> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) AS total FROM patients;",
    );

    return row?.total ?? 0;
  },

  async listTodayAppointments(
    today: string,
  ): Promise<DashboardAppointmentRow[]> {
    const db = await getDatabase();

    return db.getAllAsync<DashboardAppointmentRow>(
      `
      SELECT
        a.id,
        p.name AS patientName,
        a.start_date AS startDate,
        a.status,
        a.notes
      FROM appointments a
      INNER JOIN patients p ON p.id = a.patient_id
      WHERE date(a.start_date) = date(?)
      ORDER BY datetime(a.start_date) ASC;
      `,
      [today],
    );
  },

  async listUpcomingAppointments(
    nowIsoDateTime: string,
    limit: number,
  ): Promise<DashboardAppointmentRow[]> {
    const db = await getDatabase();

    return db.getAllAsync<DashboardAppointmentRow>(
      `
      SELECT
        a.id,
        p.name AS patientName,
        a.start_date AS startDate,
        a.status,
        a.notes
      FROM appointments a
      INNER JOIN patients p ON p.id = a.patient_id
      WHERE datetime(a.start_date) > datetime(?)
      ORDER BY datetime(a.start_date) ASC
      LIMIT ?;
      `,
      [nowIsoDateTime, limit],
    );
  },

  async countCompletedAppointmentsInMonth(
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const db = await getDatabase();

    const row = await db.getFirstAsync<{ total: number }>(
      `
      SELECT COUNT(*) AS total
      FROM appointments
      WHERE status = 'concluido'
        AND date(start_date) BETWEEN date(?) AND date(?);
      `,
      [startDate, endDate],
    );

    return row?.total ?? 0;
  },

  async getMonthlyFinancialTotals(
    startDate: string,
    endDate: string,
  ): Promise<DashboardFinancialMonthTotals> {
    const db = await getDatabase();

    const row = await db.getFirstAsync<DashboardFinancialMonthTotals>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN kind = 'entrada' THEN amount ELSE 0 END), 0) AS entries,
        COALESCE(SUM(CASE WHEN kind = 'saida' THEN amount ELSE 0 END), 0) AS exits
      FROM financial_entries
      WHERE date(entry_date) BETWEEN date(?) AND date(?);
      `,
      [startDate, endDate],
    );

    return {
      entries: row?.entries ?? 0,
      exits: row?.exits ?? 0,
    };
  },

  async listRecentCancelledAppointments(
    sinceIsoDateTime: string,
    limit: number,
  ): Promise<DashboardCancelledRow[]> {
    const db = await getDatabase();

    return db.getAllAsync<DashboardCancelledRow>(
      `
      SELECT
        a.id,
        p.name AS patientName,
        a.start_date AS startDate,
        a.notes
      FROM appointments a
      INNER JOIN patients p ON p.id = a.patient_id
      WHERE a.status = 'cancelado'
        AND datetime(a.updated_at) >= datetime(?)
      ORDER BY datetime(a.updated_at) DESC
      LIMIT ?;
      `,
      [sinceIsoDateTime, limit],
    );
  },

  async listOverdueAppointments(
    nowIsoDateTime: string,
    limit: number,
  ): Promise<DashboardAppointmentRow[]> {
    const db = await getDatabase();

    return db.getAllAsync<DashboardAppointmentRow>(
      `
      SELECT
        a.id,
        p.name AS patientName,
        a.start_date AS startDate,
        a.status,
        a.notes
      FROM appointments a
      INNER JOIN patients p ON p.id = a.patient_id
      WHERE a.status = 'agendado'
        AND datetime(a.start_date) < datetime(?)
      ORDER BY datetime(a.start_date) ASC
      LIMIT ?;
      `,
      [nowIsoDateTime, limit],
    );
  },
};
