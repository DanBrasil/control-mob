import { financialRepository } from "@/modules/financial/repositories/financial.repository";
import { getDatabase } from "@/services/database";

jest.mock("@/services/database", () => ({
  getDatabase: jest.fn(),
}));

jest.mock("@/shared/utils/date", () => ({
  toISODateTime: jest.fn(() => "2026-04-26T08:00:00.000Z"),
}));

describe("financialRepository", () => {
  const db = {
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDatabase as jest.Mock).mockResolvedValue(db);
  });

  it("list should apply kind filter when provided", async () => {
    db.getAllAsync.mockResolvedValue([]);

    await financialRepository.list({
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      kind: "entrada",
    });

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("AND kind = ?"),
      ["2026-04-01", "2026-04-30", "entrada"],
    );
  });

  it("totals should fallback to zero when query returns null", async () => {
    db.getFirstAsync.mockResolvedValue(null);

    const totals = await financialRepository.totals();

    expect(totals).toEqual({ entradas: 0, saidas: 0, saldo: 0 });
  });
});
