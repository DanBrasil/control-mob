import { getDatabase } from "@/services/database";
import { toISODateTime } from "@/shared/utils/date";

export const settingsService = {
  async get(key: string): Promise<string | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ value: string | null }>(
      "SELECT value FROM settings WHERE key = ? LIMIT 1;",
      [key],
    );

    return row?.value ?? null;
  },

  async set(key: string, value: string): Promise<void> {
    const db = await getDatabase();
    const now = toISODateTime();

    await db.runAsync(
      `INSERT INTO settings (key, value, created_at, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
      [key, value, now, now],
    );
  },
};
