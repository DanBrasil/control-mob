import {
  CreateFinancialEntryInput,
  FinancialEntry,
  FinancialFilters,
  FinancialTotals,
  UpdateFinancialEntryInput,
} from "@/modules/financial/types/financial.types";
import { getDatabase } from "@/services/database";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { toISODateTime } from "@/shared/utils/date";
import { reportNonSensitiveError } from "@/shared/utils/error-message";

const mapInput = (
  input: CreateFinancialEntryInput | UpdateFinancialEntryInput,
) => ({
  title: input.title.trim(),
  amount: input.amount,
  kind: input.kind,
  entry_date: toISODateTime(new Date(input.entry_date)),
  notes: input.notes?.trim() || null,
});

const toRepositoryError = (
  scope: string,
  fallbackMessage: string,
  error: unknown,
): never => {
  reportNonSensitiveError(scope, error);
  throw new Error(fallbackMessage);
};

export const financialRepository = {
  async list(filters: FinancialFilters): Promise<FinancialEntry[]> {
    try {
      const db = await getDatabase();

      const query = `
        SELECT id, title, amount, kind, entry_date, notes, created_at, updated_at
        FROM financial_entries
        WHERE date(entry_date) BETWEEN date(?) AND date(?)
        ${filters.kind ? "AND kind = ?" : ""}
        ORDER BY entry_date DESC;
      `;

      const params: (string | number)[] = [filters.startDate, filters.endDate];

      if (filters.kind) {
        params.push(filters.kind);
      }

      return db.getAllAsync<FinancialEntry>(query, params);
    } catch (error) {
      return toRepositoryError(
        "financial.repository.list",
        FEEDBACK_MESSAGES.genericLoadError,
        error,
      );
    }
  },

  async findById(id: number): Promise<FinancialEntry | null> {
    try {
      const db = await getDatabase();
      const row = await db.getFirstAsync<FinancialEntry>(
        `
        SELECT id, title, amount, kind, entry_date, notes, created_at, updated_at
        FROM financial_entries
        WHERE id = ?
        LIMIT 1;
        `,
        [id],
      );

      return row ?? null;
    } catch (error) {
      return toRepositoryError(
        "financial.repository.findById",
        FEEDBACK_MESSAGES.genericLoadError,
        error,
      );
    }
  },

  async create(input: CreateFinancialEntryInput): Promise<number> {
    try {
      const db = await getDatabase();
      const now = toISODateTime();
      const payload = mapInput(input);

      const result = await db.runAsync(
        `
        INSERT INTO financial_entries (
          title,
          amount,
          kind,
          entry_date,
          notes,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [
          payload.title,
          payload.amount,
          payload.kind,
          payload.entry_date,
          payload.notes,
          now,
          now,
        ],
      );

      return result.lastInsertRowId;
    } catch (error) {
      return toRepositoryError(
        "financial.repository.create",
        FEEDBACK_MESSAGES.genericSaveError,
        error,
      );
    }
  },

  async update(id: number, input: UpdateFinancialEntryInput): Promise<void> {
    try {
      const db = await getDatabase();
      const payload = mapInput(input);

      await db.runAsync(
        `
        UPDATE financial_entries
        SET
          title = ?,
          amount = ?,
          kind = ?,
          entry_date = ?,
          notes = ?,
          updated_at = ?
        WHERE id = ?;
        `,
        [
          payload.title,
          payload.amount,
          payload.kind,
          payload.entry_date,
          payload.notes,
          toISODateTime(),
          id,
        ],
      );
    } catch (error) {
      return toRepositoryError(
        "financial.repository.update",
        FEEDBACK_MESSAGES.genericSaveError,
        error,
      );
    }
  },

  async remove(id: number): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM financial_entries WHERE id = ?;", [id]);
    } catch (error) {
      return toRepositoryError(
        "financial.repository.remove",
        FEEDBACK_MESSAGES.genericDeleteError,
        error,
      );
    }
  },

  async totals(): Promise<FinancialTotals> {
    try {
      const db = await getDatabase();
      const row = await db.getFirstAsync<FinancialTotals>(
        `
        SELECT
          COALESCE(SUM(CASE WHEN kind = 'entrada' THEN amount ELSE 0 END), 0) AS entradas,
          COALESCE(SUM(CASE WHEN kind = 'saida' THEN amount ELSE 0 END), 0) AS saidas,
          COALESCE(SUM(CASE WHEN kind = 'entrada' THEN amount ELSE -amount END), 0) AS saldo
        FROM financial_entries;
        `,
      );

      return {
        entradas: row?.entradas ?? 0,
        saidas: row?.saidas ?? 0,
        saldo: row?.saldo ?? 0,
      };
    } catch (error) {
      return toRepositoryError(
        "financial.repository.totals",
        FEEDBACK_MESSAGES.genericLoadError,
        error,
      );
    }
  },
};
