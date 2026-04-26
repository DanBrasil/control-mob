import {
  calculateMonthlyBalance,
  formatDashboardDate,
  formatDashboardTime,
  getCurrentMonthRange,
  getRecentCutoffIsoDateTime,
  getTodayDate,
  summarizeText,
} from "@/modules/dashboard/utils/dashboard-calculations";

describe("calculateMonthlyBalance", () => {
  it("retorna entradas menos saidas", () => {
    expect(calculateMonthlyBalance(1000, 400)).toBe(600);
  });

  it("retorna negativo quando saidas superam entradas", () => {
    expect(calculateMonthlyBalance(200, 500)).toBe(-300);
  });

  it("retorna zero quando entradas e saidas são iguais", () => {
    expect(calculateMonthlyBalance(300, 300)).toBe(0);
  });

  it("retorna entradas quando saidas sao zero", () => {
    expect(calculateMonthlyBalance(750, 0)).toBe(750);
  });
});

describe("summarizeText", () => {
  it("retorna null para texto null", () => {
    expect(summarizeText(null)).toBeNull();
  });

  it("retorna null para string vazia", () => {
    expect(summarizeText("")).toBeNull();
  });

  it("retorna null para string apenas com espacos", () => {
    expect(summarizeText("   ")).toBeNull();
  });

  it("retorna texto curto sem truncamento", () => {
    expect(summarizeText("Consulta de retorno")).toBe("Consulta de retorno");
  });

  it("trunca texto longo com reticencias", () => {
    const texto = "a".repeat(80);
    const result = summarizeText(texto, 60);

    expect(result).toHaveLength(60);
    expect(result!.endsWith("…")).toBe(true);
  });

  it("normaliza multiplos espacos internos", () => {
    expect(summarizeText("Texto   com   espacos")).toBe("Texto com espacos");
  });

  it("respeita maxLength personalizado", () => {
    const result = summarizeText("abcdefghij", 5);

    expect(result).toHaveLength(5);
    expect(result!.endsWith("…")).toBe(true);
  });

  it("retorna texto com exatamente o maxLength sem truncar", () => {
    const texto = "a".repeat(60);
    const result = summarizeText(texto, 60);

    expect(result).toBe(texto);
    expect(result!.endsWith("…")).toBe(false);
  });
});

describe("getCurrentMonthRange", () => {
  it("retorna startDate e endDate no formato yyyy-MM-dd", () => {
    const base = new Date("2026-04-15T00:00:00.000Z");
    const range = getCurrentMonthRange(base);

    expect(range.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(range.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("retorna primeiro e ultimo dia do mes", () => {
    const base = new Date("2026-04-15T00:00:00.000Z");
    const range = getCurrentMonthRange(base);

    expect(range.startDate).toBe("2026-04-01");
    expect(range.endDate).toBe("2026-04-30");
  });

  it("lida corretamente com meses de 31 dias", () => {
    const base = new Date("2026-01-10T00:00:00.000Z");
    const range = getCurrentMonthRange(base);

    expect(range.startDate).toBe("2026-01-01");
    expect(range.endDate).toBe("2026-01-31");
  });

  it("lida corretamente com fevereiro em ano nao bissexto", () => {
    const base = new Date("2026-02-10T00:00:00.000Z");
    const range = getCurrentMonthRange(base);

    expect(range.startDate).toBe("2026-02-01");
    expect(range.endDate).toBe("2026-02-28");
  });
});

describe("getTodayDate", () => {
  it("retorna data no formato yyyy-MM-dd", () => {
    const base = new Date("2026-04-26T12:00:00.000Z");
    const result = getTodayDate(base);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getRecentCutoffIsoDateTime", () => {
  it("retorna data anterior a base em N dias", () => {
    const base = new Date("2026-04-26T12:00:00.000Z");
    const cutoff = getRecentCutoffIsoDateTime(7, base);
    const cutoffDate = new Date(cutoff);

    expect(base.getTime() - cutoffDate.getTime()).toBeCloseTo(
      7 * 24 * 60 * 60 * 1000,
      -3,
    );
  });
});

describe("formatDashboardDate", () => {
  it("formata data ISO como dd/MM", () => {
    const result = formatDashboardDate("2026-04-26T10:00:00.000Z");

    expect(result).toMatch(/^\d{2}\/\d{2}$/);
  });

  it("retorna valor original quando data é invalida", () => {
    const result = formatDashboardDate("nao-e-data");

    expect(result).toBe("nao-e-data");
  });
});

describe("formatDashboardTime", () => {
  it("formata data ISO como HH:mm", () => {
    const result = formatDashboardTime("2026-04-26T15:30:00.000Z");

    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it("retorna valor original quando data é invalida", () => {
    const result = formatDashboardTime("invalida");

    expect(result).toBe("invalida");
  });
});
