import { appointmentsRepository } from "@/modules/appointments/repositories/appointments.repository";
import { getDatabase } from "@/services/database";

jest.mock("@/services/database", () => ({
  getDatabase: jest.fn(),
}));

jest.mock("@/shared/utils/date", () => ({
  toISODateTime: jest.fn(() => "2026-04-26T12:00:00.000Z"),
}));

describe("appointmentsRepository", () => {
  const db = {
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDatabase as jest.Mock).mockResolvedValue(db);
  });

  it("list should apply status filter when provided", async () => {
    db.getAllAsync.mockResolvedValue([]);

    await appointmentsRepository.list({
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      status: "agendado",
    });

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("AND a.status = ?"),
      ["2026-04-01", "2026-04-30", "agendado"],
    );
  });

  it("create should normalize values before insert", async () => {
    db.runAsync.mockResolvedValue({ lastInsertRowId: 9 });

    const id = await appointmentsRepository.create({
      patient_id: 1,
      title: "  Retorno  ",
      notes: "  observacao  ",
      start_date: "2026-04-28T10:00",
      end_date: "2026-04-28T11:00",
      status: "agendado",
    });

    expect(id).toBe(9);
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO appointments"),
      [
        1,
        "Retorno",
        "observacao",
        "2026-04-26T12:00:00.000Z",
        "2026-04-26T12:00:00.000Z",
        "agendado",
        "2026-04-26T12:00:00.000Z",
        "2026-04-26T12:00:00.000Z",
      ],
    );
  });
});
