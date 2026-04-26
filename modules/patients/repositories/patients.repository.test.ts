import { patientsRepository } from "@/modules/patients/repositories/patients.repository";
import { getDatabase } from "@/services/database";

jest.mock("@/services/database", () => ({
  getDatabase: jest.fn(),
}));

jest.mock("@/shared/utils/date", () => ({
  toISODateTime: jest.fn(() => "2026-04-26T00:00:00.000Z"),
}));

describe("patientsRepository", () => {
  const db = {
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDatabase as jest.Mock).mockResolvedValue(db);
  });

  it("list should use search filters when provided", async () => {
    db.getAllAsync.mockResolvedValue([]);

    await patientsRepository.list("maria");

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("WHERE name LIKE ? OR phone LIKE ?"),
      ["%maria%", "%maria%"],
    );
  });

  it("create should trim fields and persist timestamps", async () => {
    db.runAsync.mockResolvedValue({ lastInsertRowId: 7 });

    const createdId = await patientsRepository.create({
      name: "  Maria Silva  ",
      phone: " 11999990000 ",
      notes: "  retorno  ",
    });

    expect(createdId).toBe(7);
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO patients"),
      [
        "Maria Silva",
        "11999990000",
        "retorno",
        "2026-04-26T00:00:00.000Z",
        "2026-04-26T00:00:00.000Z",
      ],
    );
  });
});
