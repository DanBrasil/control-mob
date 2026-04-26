import { z } from "zod";

import { APPOINTMENT_STATUSES } from "@/modules/appointments/types/appointment.types";
import { FINANCIAL_KINDS } from "@/modules/financial/types/financial.types";
import { normalizeBusinessHoursInput } from "@/shared/utils/date";

const optionalIsoDate = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || !Number.isNaN(Date.parse(value)),
    "Data invalida.",
  );

const isoDate = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Data invalida.");

export const settingsFormSchema = z.object({
  clinic_name: z
    .string()
    .trim()
    .min(1, "Nome da clinica/profissional e obrigatorio."),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "Moeda deve seguir o padrao ISO (ex.: BRL)."),
  default_session_minutes: z.preprocess(
    (value) => {
      if (typeof value === "number") {
        return value;
      }

      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? value : parsed;
      }

      return value;
    },
    z
      .number({ error: "Duracao padrao e obrigatoria." })
      .int("Duracao deve ser um numero inteiro.")
      .min(5, "Duracao minima de 5 minutos.")
      .max(240, "Duracao maxima de 240 minutos."),
  ),
  default_business_hours: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || normalizeBusinessHoursInput(value) !== null,
      "Horario deve estar no formato HH:mm-HH:mm.",
    )
    .transform((value) => {
      if (!value) {
        return value;
      }

      return normalizeBusinessHoursInput(value) ?? value;
    }),
});

const patientBackupSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  phone: z.string().trim().nullable(),
  notes: z.string().trim().nullable(),
  created_at: optionalIsoDate,
  updated_at: optionalIsoDate,
});

const appointmentBackupSchema = z.object({
  id: z.number().int().positive(),
  patient_id: z.number().int().positive(),
  title: z.string().trim().min(1),
  notes: z.string().trim().nullable(),
  start_date: isoDate,
  end_date: z.string().trim().nullable().optional(),
  status: z.enum(APPOINTMENT_STATUSES),
  created_at: optionalIsoDate,
  updated_at: optionalIsoDate,
  patient_name: z.string().trim().optional(),
  patient_phone: z.string().trim().nullable().optional(),
});

const financialBackupSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1),
  amount: z.number(),
  kind: z.enum(FINANCIAL_KINDS),
  entry_date: isoDate,
  notes: z.string().trim().nullable(),
  created_at: optionalIsoDate,
  updated_at: optionalIsoDate,
});

const backupSettingsSchema = z.object({
  clinic_name: z.string().trim().default(""),
  currency: z.string().trim().toUpperCase().default("BRL"),
  default_session_minutes: z.number().int().min(5).max(240).default(50),
  default_business_hours: z.string().trim().optional(),
});

export const backupPayloadSchema = z.object({
  patients: z.array(patientBackupSchema),
  appointments: z.array(appointmentBackupSchema),
  financial_entries: z.array(financialBackupSchema),
  settings: backupSettingsSchema,
});

export type SettingsFormInput = z.input<typeof settingsFormSchema>;
export type SettingsFormValues = z.output<typeof settingsFormSchema>;
