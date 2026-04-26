import { AuditFields, EntityId } from "@/shared/types/common";

export const FINANCIAL_KINDS = ["entrada", "saida"] as const;

export type FinancialKind = (typeof FINANCIAL_KINDS)[number];

export type FinancialEntry = {
  id: EntityId;
  title: string;
  amount: number;
  kind: FinancialKind;
  entry_date: string;
  notes: string | null;
} & AuditFields;

export type CreateFinancialEntryInput = {
  title: string;
  amount: number;
  kind: FinancialKind;
  entry_date: string;
  notes?: string;
};

export type UpdateFinancialEntryInput = CreateFinancialEntryInput;

export type FinancialFilters = {
  startDate: string;
  endDate: string;
  kind?: FinancialKind;
};

export type FinancialTotals = {
  entradas: number;
  saidas: number;
  saldo: number;
};
