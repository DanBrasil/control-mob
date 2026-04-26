import { getDatabase } from "@/services/database";
import { toISODate } from "@/shared/utils/date";

export type DashboardMetrics = {
  appointmentsToday: number;
  pendingAppointments: number;
  balance: number;
};

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const db = await getDatabase();
    const today = toISODate();

    const todayRow = await db.getFirstAsync<{ total: number }>(
      `SELECT COUNT(*) AS total
       FROM appointments
       WHERE date(start_date) = date(?);`,
      [today],
    );

    const pendingRow = await db.getFirstAsync<{ total: number }>(
      `SELECT COUNT(*) AS total
       FROM appointments
       WHERE status = 'agendado';`,
    );

    const balanceRow = await db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(CASE WHEN kind = 'entrada' THEN amount ELSE -amount END), 0) AS total
       FROM financial_entries;`,
    );

    return {
      appointmentsToday: todayRow?.total ?? 0,
      pendingAppointments: pendingRow?.total ?? 0,
      balance: balanceRow?.total ?? 0,
    };
  },
};
