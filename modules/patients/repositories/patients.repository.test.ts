import { patientsRepository } from "@/modules/patients/repositories/patients.repository";
import { getDatabase } from "@/services/database";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";

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

  it("list should return all patients when search is empty", async () => {
    db.getAllAsync.mockResolvedValue([{ id: 1, name: "Maria" }]);

    const result = await patientsRepository.list();

    expect(result).toHaveLength(1);
    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("FROM patients"),
    );
  });

  it("list should use search filters when provided", async () => {
    db.getAllAsync.mockResolvedValue([]);

    await patientsRepository.list("maria");

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("WHERE name LIKE ? OR phone LIKE ?"),
      ["%maria%", "%maria%"],
    );
  });

  it("list should return empty array when database is empty", async () => {
    db.getAllAsync.mockResolvedValue([]);

    const result = await patientsRepository.list();

    expect(result).toEqual([]);
  });

  it("list should throw friendly error when database fails", async () => {
    (getDatabase as jest.Mock).mockRejectedValue(new Error("SQLite failure"));

    await expect(patientsRepository.list()).rejects.toThrow(
      FEEDBACK_MESSAGES.genericLoadError,
    );
  });

  it("findById should return patient when found", async () => {
    const mockPatient = { id: 1, name: "Maria", phone: null, notes: null };
    db.getFirstAsync.mockResolvedValue(mockPatient);

    const result = await patientsRepository.findById(1);

    expect(result).toEqual(mockPatient);
    expect(db.getFirstAsync).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id = ?"),
      [1],
    );
  });

  it("findById should return null when patient not found", async () => {
    db.getFirstAsync.mockResolvedValue(null);

    const result = await patientsRepository.findById(999);

    expect(result).toBeNull();
  });

  it("findById should throw friendly error when database fails", async () => {
    (getDatabase as jest.Mock).mockRejectedValue(new Error("SQLite failure"));

    await expect(patientsRepository.findById(1)).rejects.toThrow(
      FEEDBACK_MESSAGES.genericLoadError,
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

  it("create should throw friendly error when insert fails", async () => {
    db.runAsync.mockRejectedValue(new Error("UNIQUE constraint failed"));

    await expect(patientsRepository.create({ name: "Maria" })).rejects.toThrow(
      FEEDBACK_MESSAGES.genericSaveError,
    );
  });

  it("update should execute UPDATE query with trimmed values", async () => {
    db.runAsync.mockResolvedValue({});

    await patientsRepository.update(1, {
      name: "  Ana Lima  ",
      phone: undefined,
      notes: undefined,
    });

    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE patients"),
      ["Ana Lima", null, null, "2026-04-26T00:00:00.000Z", 1],
    );
  });

  it("update should throw friendly error when update fails", async () => {
    db.runAsync.mockRejectedValue(new Error("SQLite error"));

    await expect(
      patientsRepository.update(1, { name: "Maria" }),
    ).rejects.toThrow(FEEDBACK_MESSAGES.genericSaveError);
  });

  it("remove should execute DELETE query with correct id", async () => {
    db.runAsync.mockResolvedValue({});

    await patientsRepository.remove(1);

    expect(db.runAsync).toHaveBeenCalledWith(
      "DELETE FROM patients WHERE id = ?;",
      [1],
    );
  });

  it("remove should throw friendly error when delete fails", async () => {
    db.runAsync.mockRejectedValue(new Error("SQLite error"));

    await expect(patientsRepository.remove(1)).rejects.toThrow(
      FEEDBACK_MESSAGES.genericDeleteError,
    );
  });
});
