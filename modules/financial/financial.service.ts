import { financialRepository } from "@/modules/financial/repositories/financial.repository";
import {
  CreateFinancialEntryInput,
  FinancialEntry,
  FinancialFilters,
  FinancialTotals,
  UpdateFinancialEntryInput,
} from "@/modules/financial/types/financial.types";

export const financialService = {
  list(filters: FinancialFilters): Promise<FinancialEntry[]> {
    return financialRepository.list(filters);
  },

  getById(id: number): Promise<FinancialEntry | null> {
    return financialRepository.findById(id);
  },

  async create(input: CreateFinancialEntryInput): Promise<FinancialEntry | null> {
    const id = await financialRepository.create(input);
    return financialRepository.findById(id);
  },

  async update(
    id: number,
    input: UpdateFinancialEntryInput,
  ): Promise<FinancialEntry | null> {
    await financialRepository.update(id, input);
    return financialRepository.findById(id);
  },

  remove(id: number): Promise<void> {
    return financialRepository.remove(id);
  },

  getTotals(): Promise<FinancialTotals> {
    return financialRepository.totals();
  },
};
