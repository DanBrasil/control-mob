import { getDatabase } from "@/services/database";
import {
  Appointment,
  AppointmentFilters,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/modules/appointments/types/appointment.types";
import { toISODateTime } from "@/shared/utils/date";

const mapInput = (input: CreateAppointmentInput | UpdateAppointmentInput) => ({
  patient_id: input.patient_id,
  title: input.title.trim(),
  notes: input.notes?.trim() || null,
  start_date: toISODateTime(new Date(input.start_date)),
  end_date: input.end_date ? toISODateTime(new Date(input.end_date)) : null,
  status: input.status,
});

export const appointmentsRepository = {
  async list(filters: AppointmentFilters): Promise<Appointment[]> {
    const db = await getDatabase();

    const query = `
      SELECT
        a.id,
        a.patient_id,
        p.name AS patient_name,
        p.phone AS patient_phone,
        a.title,
        a.notes,
        a.start_date,
        a.end_date,
        a.status,
        a.created_at,
        a.updated_at
      FROM appointments a
      INNER JOIN patients p ON p.id = a.patient_id
      WHERE date(a.start_date) BETWEEN date(?) AND date(?)
      ${filters.status ? "AND a.status = ?" : ""}
      ORDER BY a.start_date ASC;
    `;

    const params: (string | number)[] = [filters.startDate, filters.endDate];

    if (filters.status) {
      params.push(filters.status);
    }

    return db.getAllAsync<Appointment>(query, params);
  },

  async findById(id: number): Promise<Appointment | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Appointment>(
      `
      SELECT
        a.id,
        a.patient_id,
        p.name AS patient_name,
        p.phone AS patient_phone,
        a.title,
        a.notes,
        a.start_date,
        a.end_date,
        a.status,
        a.created_at,
        a.updated_at
      FROM appointments a
      INNER JOIN patients p ON p.id = a.patient_id
      WHERE a.id = ?
      LIMIT 1;
      `,
      [id],
    );

    return row ?? null;
  },

  async create(input: CreateAppointmentInput): Promise<number> {
    const db = await getDatabase();
    const now = toISODateTime();
    const payload = mapInput(input);

    const result = await db.runAsync(
      `
      INSERT INTO appointments (
        patient_id,
        title,
        notes,
        start_date,
        end_date,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        payload.patient_id,
        payload.title,
        payload.notes,
        payload.start_date,
        payload.end_date,
        payload.status,
        now,
        now,
      ],
    );

    return result.lastInsertRowId;
  },

  async update(id: number, input: UpdateAppointmentInput): Promise<void> {
    const db = await getDatabase();
    const payload = mapInput(input);

    await db.runAsync(
      `
      UPDATE appointments
      SET
        patient_id = ?,
        title = ?,
        notes = ?,
        start_date = ?,
        end_date = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?;
      `,
      [
        payload.patient_id,
        payload.title,
        payload.notes,
        payload.start_date,
        payload.end_date,
        payload.status,
        toISODateTime(),
        id,
      ],
    );
  },

  async remove(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM appointments WHERE id = ?;", [id]);
  },
};
