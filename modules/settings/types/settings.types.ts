import { AppointmentStatus } from "@/modules/appointments/types/appointment.types";
import { FinancialKind } from "@/modules/financial/types/financial.types";

export const SETTINGS_KEYS = [
  "clinic_name",
  "currency",
  "default_session_minutes",
  "default_business_hours",
] as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[number];

export type SettingsEntry = {
  key: SettingsKey;
  value: string;
};

export type GeneralSettings = {
  clinic_name: string;
  currency: string;
  default_session_minutes: number;
  default_business_hours?: string;
};

export type BackupPatient = {
  id: number;
  name: string;
  phone: string | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BackupAppointment = {
  id: number;
  patient_id: number;
  title: string;
  notes: string | null;
  start_date: string;
  end_date?: string | null;
  status: AppointmentStatus;
  created_at?: string;
  updated_at?: string;
};

export type BackupFinancialEntry = {
  id: number;
  title: string;
  amount: number;
  kind: FinancialKind;
  entry_date: string;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BackupData = {
  patients: BackupPatient[];
  appointments: BackupAppointment[];
  financial_entries: BackupFinancialEntry[];
  settings: GeneralSettings;
};

export type BackupImportMode = "replace" | "merge";

export type ImportReport = {
  mode: BackupImportMode;
  patientsInserted: number;
  appointmentsInserted: number;
  financialEntriesInserted: number;
  appointmentsSkipped: number;
};

export type ImportFileSelection = {
  name: string;
  content: string;
};
