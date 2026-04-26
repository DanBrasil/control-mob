import { z } from "zod";

import { FINANCIAL_KINDS } from "@/modules/financial/types/financial.types";

const parseableDate = (value: string) => !Number.isNaN(Date.parse(value));

export const financialEntrySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Título deve ter ao menos 3 caracteres."),
  amount: z
    .number({ error: "Valor é obrigatório." })
    .positive("Valor deve ser maior que zero."),
  kind: z.enum(FINANCIAL_KINDS, {
    error: "Selecione o tipo do lançamento.",
  }),
  entry_date: z
    .string()
    .trim()
    .min(1, "Data do lançamento é obrigatória.")
    .refine(parseableDate, "Data do lançamento inválida."),
  notes: z
    .string()
    .trim()
    .max(400, "Observações devem ter no máximo 400 caracteres.")
    .optional(),
});

export type FinancialEntryFormValues = z.infer<typeof financialEntrySchema>;
