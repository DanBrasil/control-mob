import { appointmentsRepository } from "@/modules/appointments/repositories/appointments.repository";
import { getDatabase } from "@/services/database";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";

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

  it("list should return empty array when no appointments exist", async () => {
    db.getAllAsync.mockResolvedValue([]);

    const result = await appointmentsRepository.list({
      startDate: "2026-04-01",
      endDate: "2026-04-30",
    });

    expect(result).toEqual([]);
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

  it("list should not include status filter when not provided", async () => {
    db.getAllAsync.mockResolvedValue([]);

    await appointmentsRepository.list({
      startDate: "2026-04-01",
      endDate: "2026-04-30",
    });

    expect(db.getAllAsync).toHaveBeenCalledWith(
      expect.not.stringContaining("AND a.status = ?"),
      ["2026-04-01", "2026-04-30"],
    );
  });

  it("list should throw friendly error when database fails", async () => {
    (getDatabase as jest.Mock).mockRejectedValue(new Error("SQLite failure"));

    await expect(
      appointmentsRepository.list({
        startDate: "2026-04-01",
        endDate: "2026-04-30",
      }),
    ).rejects.toThrow(FEEDBACK_MESSAGES.genericLoadError);
  });

  it("findById should return appointment when found", async () => {
    const mockRow = {
      id: 1,
      title: "Consulta",
      patient_name: "Maria",
      status: "agendado",
    };
    db.getFirstAsync.mockResolvedValue(mockRow);

    const result = await appointmentsRepository.findById(1);

    expect(result).toEqual(mockRow);
    expect(db.getFirstAsync).toHaveBeenCalledWith(
      expect.stringContaining("WHERE a.id = ?"),
      [1],
    );
  });

  it("findById should return null when appointment not found", async () => {
    db.getFirstAsync.mockResolvedValue(null);

    const result = await appointmentsRepository.findById(999);

    expect(result).toBeNull();
  });

  it("findById should throw friendly error when database fails", async () => {
    (getDatabase as jest.Mock).mockRejectedValue(new Error("SQLite failure"));

    await expect(appointmentsRepository.findById(1)).rejects.toThrow(
      FEEDBACK_MESSAGES.genericLoadError,
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

  it("create should set end_date to null when not provided", async () => {
    db.runAsync.mockResolvedValue({ lastInsertRowId: 10 });

    await appointmentsRepository.create({
      patient_id: 1,
      title: "Consulta",
      start_date: "2026-04-28T10:00",
      status: "agendado",
    });

    const callArgs = db.runAsync.mock.calls[0][1];
    expect(callArgs[4]).toBeNull();
  });

  it("create should throw friendly error when insert fails", async () => {
    db.runAsync.mockRejectedValue(new Error("DB error"));

    await expect(
      appointmentsRepository.create({
        patient_id: 1,
        title: "Consulta",
        start_date: "2026-04-28T10:00",
        status: "agendado",
      }),
    ).rejects.toThrow(FEEDBACK_MESSAGES.genericSaveError);
  });

  it("update should execute UPDATE query with correct params", async () => {
    db.runAsync.mockResolvedValue({});

    await appointmentsRepository.update(1, {
      patient_id: 1,
      title: "Consulta",
      start_date: "2026-04-28T10:00",
      status: "concluido",
    });

    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE appointments"),
      expect.arrayContaining([1, "concluido"]),
    );
  });

  it("remove should execute DELETE query with correct id", async () => {
    db.runAsync.mockResolvedValue({});

    await appointmentsRepository.remove(1);

    expect(db.runAsync).toHaveBeenCalledWith(
      "DELETE FROM appointments WHERE id = ?;",
      [1],
    );
  });

  it("remove should throw friendly error when delete fails", async () => {
    db.runAsync.mockRejectedValue(new Error("SQLite error"));

    await expect(appointmentsRepository.remove(1)).rejects.toThrow(
      FEEDBACK_MESSAGES.genericDeleteError,
    );
  });
});
