import { getDatabase } from "@/services/database";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { toISODateTime } from "@/shared/utils/date";
import { reportNonSensitiveError } from "@/shared/utils/error-message";

import {
  CreatePatientInput,
  Patient,
  UpdatePatientInput,
} from "@/modules/patients/types/patient.types";

function mapInput(input: CreatePatientInput | UpdatePatientInput) {
  return {
    name: input.name.trim(),
    phone: input.phone?.trim() || null,
    notes: input.notes?.trim() || null,
  };
}

const toRepositoryError = (
  scope: string,
  fallbackMessage: string,
  error: unknown,
): never => {
  reportNonSensitiveError(scope, error);
  throw new Error(fallbackMessage);
};

export const patientsRepository = {
  async list(search?: string): Promise<Patient[]> {
    try {
      const db = await getDatabase();

      if (!search?.trim()) {
        return db.getAllAsync<Patient>(
          `SELECT id, name, phone, notes, created_at, updated_at
           FROM patients
           ORDER BY name ASC;`,
        );
      }

      return db.getAllAsync<Patient>(
        `SELECT id, name, phone, notes, created_at, updated_at
         FROM patients
         WHERE name LIKE ? OR phone LIKE ?
         ORDER BY name ASC;`,
        [`%${search.trim()}%`, `%${search.trim()}%`],
      );
    } catch (error) {
      return toRepositoryError(
        "patients.repository.list",
        FEEDBACK_MESSAGES.genericLoadError,
        error,
      );
    }
  },

  async findById(id: number): Promise<Patient | null> {
    try {
      const db = await getDatabase();
      const patient = await db.getFirstAsync<Patient>(
        `SELECT id, name, phone, notes, created_at, updated_at
         FROM patients
         WHERE id = ?
         LIMIT 1;`,
        [id],
      );

      return patient ?? null;
    } catch (error) {
      return toRepositoryError(
        "patients.repository.findById",
        FEEDBACK_MESSAGES.genericLoadError,
        error,
      );
    }
  },

  async create(input: CreatePatientInput): Promise<number> {
    try {
      const db = await getDatabase();
      const now = toISODateTime();
      const payload = mapInput(input);

      const result = await db.runAsync(
        `INSERT INTO patients (name, phone, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?);`,
        [payload.name, payload.phone, payload.notes, now, now],
      );

      return result.lastInsertRowId;
    } catch (error) {
      return toRepositoryError(
        "patients.repository.create",
        FEEDBACK_MESSAGES.genericSaveError,
        error,
      );
    }
  },

  async update(id: number, input: UpdatePatientInput): Promise<void> {
    try {
      const db = await getDatabase();
      const payload = mapInput(input);

      await db.runAsync(
        `UPDATE patients
         SET name = ?, phone = ?, notes = ?, updated_at = ?
         WHERE id = ?;`,
        [payload.name, payload.phone, payload.notes, toISODateTime(), id],
      );
    } catch (error) {
      return toRepositoryError(
        "patients.repository.update",
        FEEDBACK_MESSAGES.genericSaveError,
        error,
      );
    }
  },

  async remove(id: number): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM patients WHERE id = ?;", [id]);
    } catch (error) {
      return toRepositoryError(
        "patients.repository.remove",
        FEEDBACK_MESSAGES.genericDeleteError,
        error,
      );
    }
  },
};
