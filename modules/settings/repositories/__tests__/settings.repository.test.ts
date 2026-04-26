import { settingsRepository } from "@/modules/settings/repositories/settings.repository";
import { getDatabase } from "@/services/database";

jest.mock("@/services/database", () => ({
  getDatabase: jest.fn(),
}));

jest.mock("@/shared/utils/date", () => ({
  toISODateTime: jest.fn(() => "2026-04-26T00:00:00.000Z"),
}));

describe("settingsRepository", () => {
  const db = {
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDatabase as jest.Mock).mockResolvedValue(db);
  });

  describe("getByKey", () => {
    it("returns value when key exists", async () => {
      db.getFirstAsync.mockResolvedValue({ value: "Clínica Saúde" });

      const result = await settingsRepository.getByKey("clinic_name");

      expect(result).toBe("Clínica Saúde");
      expect(db.getFirstAsync).toHaveBeenCalledWith(
        expect.stringContaining("WHERE key = ?"),
        ["clinic_name"],
      );
    });

    it("returns null when key does not exist", async () => {
      db.getFirstAsync.mockResolvedValue(null);

      const result = await settingsRepository.getByKey("clinic_name");

      expect(result).toBeNull();
    });

    it("returns null when row value is null", async () => {
      db.getFirstAsync.mockResolvedValue({ value: null });

      const result = await settingsRepository.getByKey("currency");

      expect(result).toBeNull();
    });
  });

  describe("listAll", () => {
    it("returns mapped settings entries", async () => {
      db.getAllAsync.mockResolvedValue([
        { key: "clinic_name", value: "Minha Clínica" },
        { key: "currency", value: "BRL" },
      ]);

      const result = await settingsRepository.listAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ key: "clinic_name", value: "Minha Clínica" });
    });

    it("returns empty array when settings table is empty", async () => {
      db.getAllAsync.mockResolvedValue([]);

      const result = await settingsRepository.listAll();

      expect(result).toEqual([]);
    });

    it("filters out rows with null value", async () => {
      db.getAllAsync.mockResolvedValue([
        { key: "clinic_name", value: "Clínica" },
        { key: "currency", value: null },
      ]);

      const result = await settingsRepository.listAll();

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe("clinic_name");
    });

    it("filters out rows with unknown key", async () => {
      db.getAllAsync.mockResolvedValue([
        { key: "clinic_name", value: "Clínica" },
        { key: "unknown_key", value: "value" },
      ]);

      const result = await settingsRepository.listAll();

      expect(result).toHaveLength(1);
    });
  });

  describe("upsertMany", () => {
    it("inserts each entry with UPSERT query", async () => {
      db.runAsync.mockResolvedValue({});

      await settingsRepository.upsertMany([
        { key: "clinic_name", value: "Clínica" },
        { key: "currency", value: "BRL" },
      ]);

      expect(db.runAsync).toHaveBeenCalledTimes(2);
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining("ON CONFLICT"),
        expect.arrayContaining(["clinic_name", "Clínica"]),
      );
    });

    it("does nothing when entries array is empty", async () => {
      await settingsRepository.upsertMany([]);

      expect(db.runAsync).not.toHaveBeenCalled();
    });
  });

  describe("clearAll", () => {
    it("executes DELETE query", async () => {
      db.runAsync.mockResolvedValue({});

      await settingsRepository.clearAll();

      expect(db.runAsync).toHaveBeenCalledWith("DELETE FROM settings;");
    });
  });
});
