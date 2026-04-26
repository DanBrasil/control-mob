import { format } from "date-fns";

import { appointmentsRepository } from "@/modules/appointments/repositories/appointments.repository";
import { financialRepository } from "@/modules/financial/repositories/financial.repository";
import { patientsRepository } from "@/modules/patients/repositories/patients.repository";
import { backupPayloadSchema } from "@/modules/settings/schemas/settings.schema";
import { settingsService } from "@/modules/settings/settings.service";
import {
  BackupData,
  BackupImportMode,
  ImportReport,
} from "@/modules/settings/types/settings.types";
import { getDatabase } from "@/services/database";
import { toISODateTime } from "@/shared/utils/date";
import { shareFile, writeJsonFile } from "@/shared/utils/file";
import { parseJsonWithSchema } from "@/shared/utils/json-validation";

const MIN_DATE = "1900-01-01";
const MAX_DATE = "2999-12-31";

const getExistingIdSet = async (table: string): Promise<Set<number>> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ id: number }>(`SELECT id FROM ${table};`);
  return new Set(rows.map((row) => row.id));
};

const insertPatient = async (
  id: number,
  name: string,
  phone: string | null,
  notes: string | null,
  createdAt: string,
  updatedAt: string,
) => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO patients (id, name, phone, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [id, name, phone, notes, createdAt, updatedAt],
  );
};

const insertAppointment = async (
  id: number,
  patientId: number,
  title: string,
  notes: string | null,
  startDate: string,
  endDate: string | null,
  status: string,
  createdAt: string,
  updatedAt: string,
) => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO appointments (
      id,
      patient_id,
      title,
      notes,
      start_date,
      end_date,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      patientId,
      title,
      notes,
      startDate,
      endDate,
      status,
      createdAt,
      updatedAt,
    ],
  );
};

const insertFinancialEntry = async (
  id: number,
  title: string,
  amount: number,
  kind: string,
  entryDate: string,
  notes: string | null,
  createdAt: string,
  updatedAt: string,
) => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO financial_entries (
      id,
      title,
      amount,
      kind,
      entry_date,
      notes,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [id, title, amount, kind, entryDate, notes, createdAt, updatedAt],
  );
};

const inTransaction = async (
  action: () => Promise<ImportReport>,
): Promise<ImportReport> => {
  const db = await getDatabase();
  await db.execAsync("BEGIN TRANSACTION;");

  try {
    const report = await action();
    await db.execAsync("COMMIT;");
    return report;
  } catch (error) {
    await db.execAsync("ROLLBACK;");
    throw error;
  }
};

const replaceData = async (payload: BackupData): Promise<ImportReport> => {
  const now = toISODateTime();
  const db = await getDatabase();

  await db.runAsync("DELETE FROM appointments;");
  await db.runAsync("DELETE FROM financial_entries;");
  await db.runAsync("DELETE FROM settings;");
  await db.runAsync("DELETE FROM patients;");

  for (const patient of payload.patients) {
    await insertPatient(
      patient.id,
      patient.name,
      patient.phone,
      patient.notes,
      patient.created_at ?? now,
      patient.updated_at ?? now,
    );
  }

  for (const appointment of payload.appointments) {
    await insertAppointment(
      appointment.id,
      appointment.patient_id,
      appointment.title,
      appointment.notes,
      appointment.start_date,
      appointment.end_date ?? null,
      appointment.status,
      appointment.created_at ?? now,
      appointment.updated_at ?? now,
    );
  }

  for (const entry of payload.financial_entries) {
    await insertFinancialEntry(
      entry.id,
      entry.title,
      entry.amount,
      entry.kind,
      entry.entry_date,
      entry.notes,
      entry.created_at ?? now,
      entry.updated_at ?? now,
    );
  }

  await settingsService.saveGeneralSettings(payload.settings);

  return {
    mode: "replace",
    patientsInserted: payload.patients.length,
    appointmentsInserted: payload.appointments.length,
    financialEntriesInserted: payload.financial_entries.length,
    appointmentsSkipped: 0,
  };
};

const mergeData = async (payload: BackupData): Promise<ImportReport> => {
  const now = toISODateTime();
  const patientIds = await getExistingIdSet("patients");
  const appointmentIds = await getExistingIdSet("appointments");
  const financialIds = await getExistingIdSet("financial_entries");

  let patientsInserted = 0;
  let appointmentsInserted = 0;
  let financialEntriesInserted = 0;
  let appointmentsSkipped = 0;

  for (const patient of payload.patients) {
    if (patientIds.has(patient.id)) {
      continue;
    }

    await insertPatient(
      patient.id,
      patient.name,
      patient.phone,
      patient.notes,
      patient.created_at ?? now,
      patient.updated_at ?? now,
    );

    patientIds.add(patient.id);
    patientsInserted += 1;
  }

  for (const appointment of payload.appointments) {
    if (appointmentIds.has(appointment.id)) {
      continue;
    }

    if (!patientIds.has(appointment.patient_id)) {
      appointmentsSkipped += 1;
      continue;
    }

    await insertAppointment(
      appointment.id,
      appointment.patient_id,
      appointment.title,
      appointment.notes,
      appointment.start_date,
      appointment.end_date ?? null,
      appointment.status,
      appointment.created_at ?? now,
      appointment.updated_at ?? now,
    );

    appointmentIds.add(appointment.id);
    appointmentsInserted += 1;
  }

  for (const entry of payload.financial_entries) {
    if (financialIds.has(entry.id)) {
      continue;
    }

    await insertFinancialEntry(
      entry.id,
      entry.title,
      entry.amount,
      entry.kind,
      entry.entry_date,
      entry.notes,
      entry.created_at ?? now,
      entry.updated_at ?? now,
    );

    financialIds.add(entry.id);
    financialEntriesInserted += 1;
  }

  await settingsService.saveGeneralSettings(payload.settings);

  return {
    mode: "merge",
    patientsInserted,
    appointmentsInserted,
    financialEntriesInserted,
    appointmentsSkipped,
  };
};

export const backupService = {
  async getBackupData(): Promise<BackupData> {
    const [patients, appointments, financialEntries, settings] =
      await Promise.all([
        patientsRepository.list(),
        appointmentsRepository.list({
          startDate: MIN_DATE,
          endDate: MAX_DATE,
        }),
        financialRepository.list({
          startDate: MIN_DATE,
          endDate: MAX_DATE,
        }),
        settingsService.getGeneralSettings(),
      ]);

    return {
      patients,
      appointments,
      financial_entries: financialEntries,
      settings,
    };
  },

  async exportToJsonFile(): Promise<{ fileName: string; uri: string }> {
    const payload = await this.getBackupData();
    const fileName = `controlmob-backup-${format(new Date(), "yyyyMMdd-HHmmss")}.json`;
    const uri = await writeJsonFile(fileName, payload);

    return { fileName, uri };
  },

  async exportAndShareBackup(): Promise<{ fileName: string; uri: string }> {
    const exported = await this.exportToJsonFile();
    await shareFile(exported.uri);
    return exported;
  },

  async importFromJson(
    rawContent: string,
    mode: BackupImportMode,
  ): Promise<ImportReport> {
    const payload = parseJsonWithSchema(rawContent, backupPayloadSchema);

    return inTransaction(async () => {
      if (mode === "replace") {
        return replaceData(payload);
      }

      return mergeData(payload);
    });
  },
};
