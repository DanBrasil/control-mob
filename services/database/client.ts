import * as SQLite from "expo-sqlite";

import { migrations } from "@/services/database/migrations";

let database: SQLite.SQLiteDatabase | null = null;
let bootstrapped = false;

async function getUserVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;",
  );
  return row?.user_version ?? 0;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const currentVersion = await getUserVersion(db);
  const pending = migrations
    .filter((migration) => migration.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await db.execAsync("BEGIN TRANSACTION;");

    try {
      for (const statement of migration.statements) {
        await db.execAsync(statement);
      }

      await db.execAsync(`PRAGMA user_version = ${migration.version};`);
      await db.execAsync("COMMIT;");
    } catch (error) {
      await db.execAsync("ROLLBACK;");
      throw error;
    }
  }
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!database) {
    database = await SQLite.openDatabaseAsync("controlmob.db");
    await database.execAsync("PRAGMA foreign_keys = ON;");
  }

  return database;
}

export async function bootstrapDatabase(): Promise<void> {
  if (bootstrapped) {
    return;
  }

  const db = await getDatabase();
  await runMigrations(db);
  bootstrapped = true;
}
