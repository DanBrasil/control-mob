import { financialEntrySchema } from "@/modules/financial/schemas/financial.schema";

describe("financialEntrySchema", () => {
  const base = {
    title: "Consulta particular",
    amount: 150.0,
    kind: "entrada" as const,
    entry_date: "2026-04-30T08:00",
  };

  it("valida um lançamento válido completo", () => {
    const result = financialEntrySchema.safeParse({ ...base, notes: "Obs." });

    expect(result.success).toBe(true);
  });

  it("valida um lançamento sem campos opcionais", () => {
    const result = financialEntrySchema.safeParse(base);

    expect(result.success).toBe(true);
  });

  it("rejeita titulo com menos de 3 caracteres", () => {
    const result = financialEntrySchema.safeParse({ ...base, title: "Ab" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Título deve ter ao menos 3 caracteres.",
      );
    }
  });

  it("rejeita amount igual a zero", () => {
    const result = financialEntrySchema.safeParse({ ...base, amount: 0 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Valor deve ser maior que zero.",
      );
    }
  });

  it("rejeita amount negativo", () => {
    const result = financialEntrySchema.safeParse({ ...base, amount: -50 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Valor deve ser maior que zero.",
      );
    }
  });

  it("rejeita entry_date inválida", () => {
    const result = financialEntrySchema.safeParse({
      ...base,
      entry_date: "nao-e-data",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Data do lançamento inválida.",
      );
    }
  });

  it("rejeita entry_date vazia", () => {
    const result = financialEntrySchema.safeParse({ ...base, entry_date: "" });

    expect(result.success).toBe(false);
  });

  it("rejeita kind inválido", () => {
    const result = financialEntrySchema.safeParse({
      ...base,
      kind: "pagamento",
    });

    expect(result.success).toBe(false);
  });

  it("aceita kind 'saida'", () => {
    const result = financialEntrySchema.safeParse({ ...base, kind: "saida" });

    expect(result.success).toBe(true);
  });

  it("aceita observacoes opcionais", () => {
    const result = financialEntrySchema.safeParse({
      ...base,
      notes: undefined,
    });

    expect(result.success).toBe(true);
  });
});
