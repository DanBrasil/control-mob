import { getDatabase } from "@/services/database";
import { toISODateTime } from "@/shared/utils/date";

import {
  SETTINGS_KEYS,
  SettingsEntry,
  SettingsKey,
} from "@/modules/settings/types/settings.types";

type SettingsRow = {
  key: SettingsKey;
  value: string | null;
};

const isSettingsKey = (value: string): value is SettingsKey =>
  SETTINGS_KEYS.includes(value as SettingsKey);

export const settingsRepository = {
  async getByKey(key: SettingsKey): Promise<string | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ value: string | null }>(
      "SELECT value FROM settings WHERE key = ? LIMIT 1;",
      [key],
    );

    return row?.value ?? null;
  },

  async listAll(): Promise<SettingsEntry[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<SettingsRow>(
      "SELECT key, value FROM settings ORDER BY key ASC;",
    );

    return rows
      .filter((row) => row.value !== null && isSettingsKey(row.key))
      .map((row) => ({
        key: row.key,
        value: row.value as string,
      }));
  },

  async upsertMany(entries: SettingsEntry[]): Promise<void> {
    if (entries.length === 0) {
      return;
    }

    const db = await getDatabase();
    const now = toISODateTime();

    for (const entry of entries) {
      await db.runAsync(
        `INSERT INTO settings (key, value, created_at, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
        [entry.key, entry.value, now, now],
      );
    }
  },

  async clearAll(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM settings;");
  },
};
