import { financialRepository } from "@/modules/financial/repositories/financial.repository";
import { getDatabase } from "@/services/database";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";

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

  it("list should return empty array when no entries exist", async () => {
    db.getAllAsync.mockResolvedValue([]);

    const result = await financialRepository.list({
      startDate: "2026-04-01",
      endDate: "2026-04-30",
    });

    expect(result).toEqual([]);
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

  it("list should not include kind filter when omitted", async () => {
    db.getAllAsync.mockResolvedValue([]);

    await financialRepository.list({
      startDate: "2026-04-01",
      endDate: "2026-04-30",
    });

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.not.stringContaining("AND kind = ?"),
      ["2026-04-01", "2026-04-30"],
    );
  });

  it("list should throw friendly error when database fails", async () => {
    (getDatabase as jest.Mock).mockRejectedValue(new Error("SQLite failure"));

    await expect(
      financialRepository.list({
        startDate: "2026-04-01",
        endDate: "2026-04-30",
      }),
    ).rejects.toThrow(FEEDBACK_MESSAGES.genericLoadError);
  });

  it("findById should return entry when found", async () => {
    const mockEntry = {
      id: 1,
      title: "Consulta",
      amount: 150,
      kind: "entrada",
    };
    db.getFirstAsync.mockResolvedValue(mockEntry);

    const result = await financialRepository.findById(1);

    expect(result).toEqual(mockEntry);
    expect(db.getFirstAsync).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id = ?"),
      [1],
    );
  });

  it("findById should return null when entry not found", async () => {
    db.getFirstAsync.mockResolvedValue(null);

    const result = await financialRepository.findById(999);

    expect(result).toBeNull();
  });

  it("create should insert entry and return new id", async () => {
    db.runAsync.mockResolvedValue({ lastInsertRowId: 5 });

    const id = await financialRepository.create({
      title: "  Sessão  ",
      amount: 200,
      kind: "entrada",
      entry_date: "2026-04-26T08:00",
      notes: "  obs  ",
    });

    expect(id).toBe(5);
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO financial_entries"),
      expect.arrayContaining(["Sessão", 200, "entrada", "obs"]),
    );
  });

  it("create should throw friendly error when insert fails", async () => {
    db.runAsync.mockRejectedValue(new Error("DB error"));

    await expect(
      financialRepository.create({
        title: "Consulta",
        amount: 100,
        kind: "entrada",
        entry_date: "2026-04-26T08:00",
      }),
    ).rejects.toThrow(FEEDBACK_MESSAGES.genericSaveError);
  });

  it("update should execute UPDATE with correct id", async () => {
    db.runAsync.mockResolvedValue({});

    await financialRepository.update(2, {
      title: "Taxa",
      amount: 50,
      kind: "saida",
      entry_date: "2026-04-26T08:00",
    });

    const callArgs = db.runAsync.mock.calls[0][1];
    expect(callArgs[callArgs.length - 1]).toBe(2);
  });

  it("remove should execute DELETE query with correct id", async () => {
    db.runAsync.mockResolvedValue({});

    await financialRepository.remove(3);

    expect(db.runAsync).toHaveBeenCalledWith(
      "DELETE FROM financial_entries WHERE id = ?;",
      [3],
    );
  });

  it("remove should throw friendly error when delete fails", async () => {
    db.runAsync.mockRejectedValue(new Error("SQLite error"));

    await expect(financialRepository.remove(1)).rejects.toThrow(
      FEEDBACK_MESSAGES.genericDeleteError,
    );
  });

  it("totals should return correct totals", async () => {
    db.getFirstAsync.mockResolvedValue({
      entradas: 500,
      saidas: 200,
      saldo: 300,
    });

    const totals = await financialRepository.totals();

    expect(totals).toEqual({ entradas: 500, saidas: 200, saldo: 300 });
  });

  it("totals should fallback to zero when query returns null", async () => {
    db.getFirstAsync.mockResolvedValue(null);

    const totals = await financialRepository.totals();

    expect(totals).toEqual({ entradas: 0, saidas: 0, saldo: 0 });
  });

  it("totals should throw friendly error when database fails", async () => {
    (getDatabase as jest.Mock).mockRejectedValue(new Error("SQLite failure"));

    await expect(financialRepository.totals()).rejects.toThrow(
      FEEDBACK_MESSAGES.genericLoadError,
    );
  });
});
