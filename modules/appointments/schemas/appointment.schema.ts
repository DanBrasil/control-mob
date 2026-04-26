import { z } from "zod";

import { APPOINTMENT_STATUSES } from "@/modules/appointments/types/appointment.types";
import { normalizeDateTimeInput } from "@/shared/utils/date";

const parseableDate = (value: string) => normalizeDateTimeInput(value) !== null;

export const appointmentSchema = z
  .object({
    patient_id: z.number().int().positive("Selecione um paciente."),
    title: z.string().trim().min(3, "Título deve ter ao menos 3 caracteres."),
    notes: z
      .string()
      .trim()
      .max(400, "Observações devem ter no máximo 400 caracteres.")
      .optional(),
    start_date: z
      .string()
      .trim()
      .min(1, "Data inicial é obrigatória.")
      .refine(parseableDate, "Data inicial inválida."),
    end_date: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || parseableDate(value),
        "Data final inválida.",
      ),
    status: z.enum(APPOINTMENT_STATUSES, {
      error: "Selecione um status válido.",
    }),
  })
  .superRefine((values, ctx) => {
    if (!values.end_date) {
      return;
    }

    const normalizedStart = normalizeDateTimeInput(values.start_date);
    const normalizedEnd = normalizeDateTimeInput(values.end_date);

    if (!normalizedStart || !normalizedEnd) {
      return;
    }

    const start = new Date(normalizedStart);
    const end = new Date(normalizedEnd);

    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_date"],
        message: "Data final não pode ser menor que data inicial.",
      });
    }
  });

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
