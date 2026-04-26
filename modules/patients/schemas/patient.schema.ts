import { z } from "zod";

export const patientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório.")
    .min(3, "Nome deve ter ao menos 3 caracteres."),
  phone: z
    .string()
    .trim()
    .max(20, "Telefone deve ter no máximo 20 caracteres.")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(400, "Observações devem ter no máximo 400 caracteres.")
    .optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
