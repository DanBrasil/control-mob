import { getDatabase } from "@/services/database";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";

export const LOCAL_DATA_PRIVACY_NOTICE = FEEDBACK_MESSAGES.localDataOnlyNotice;

export const clearAllLocalData = async (): Promise<void> => {
  const db = await getDatabase();

  await db.execAsync("BEGIN TRANSACTION;");

  try {
    await db.runAsync("DELETE FROM appointments;");
    await db.runAsync("DELETE FROM financial_entries;");
    await db.runAsync("DELETE FROM settings;");
    await db.runAsync("DELETE FROM patients;");
    await db.execAsync("COMMIT;");
  } catch (error) {
    await db.execAsync("ROLLBACK;");
    throw error;
  }
};
