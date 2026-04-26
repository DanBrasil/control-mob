import { settingsRepository } from "@/modules/settings/repositories/settings.repository";
import { settingsService } from "@/modules/settings/settings.service";

jest.mock("@/modules/settings/repositories/settings.repository", () => ({
  settingsRepository: {
    getByKey: jest.fn(),
    listAll: jest.fn(),
    upsertMany: jest.fn(),
    clearAll: jest.fn(),
  },
}));

const repo = settingsRepository as jest.Mocked<typeof settingsRepository>;

describe("settingsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGeneralSettings", () => {
    it("retorna configuracoes mapeadas a partir dos entries do repositorio", async () => {
      repo.listAll.mockResolvedValue([
        { key: "clinic_name", value: "Clínica Saúde" },
        { key: "currency", value: "USD" },
        { key: "default_session_minutes", value: "45" },
        { key: "default_business_hours", value: "09:00-18:00" },
      ]);

      const settings = await settingsService.getGeneralSettings();

      expect(settings.clinic_name).toBe("Clínica Saúde");
      expect(settings.currency).toBe("USD");
      expect(settings.default_session_minutes).toBe(45);
      expect(settings.default_business_hours).toBe("09:00-18:00");
    });

    it("retorna valores padrão quando repositorio retorna lista vazia", async () => {
      repo.listAll.mockResolvedValue([]);

      const settings = await settingsService.getGeneralSettings();

      expect(settings.clinic_name).toBe("");
      expect(settings.currency).toBe("BRL");
      expect(settings.default_session_minutes).toBe(50);
      expect(settings.default_business_hours).toBe("");
    });

    it("usa valor padrão para chaves ausentes", async () => {
      repo.listAll.mockResolvedValue([
        { key: "clinic_name", value: "Consultório" },
      ]);

      const settings = await settingsService.getGeneralSettings();

      expect(settings.currency).toBe("BRL");
      expect(settings.default_session_minutes).toBe(50);
    });
  });

  describe("saveGeneralSettings", () => {
    it("chama upsertMany com os entries mapeados", async () => {
      repo.upsertMany.mockResolvedValue();

      await settingsService.saveGeneralSettings({
        clinic_name: "Minha Clínica",
        currency: "BRL",
        default_session_minutes: 60,
        default_business_hours: "08:00-17:00",
      });

      expect(repo.upsertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          { key: "clinic_name", value: "Minha Clínica" },
          { key: "currency", value: "BRL" },
          { key: "default_session_minutes", value: "60" },
          { key: "default_business_hours", value: "08:00-17:00" },
        ]),
      );
    });
  });

  describe("get e set", () => {
    it("get retorna valor da chave pelo repositorio", async () => {
      repo.getByKey.mockResolvedValue("Clínica ABC");

      const result = await settingsService.get("clinic_name");

      expect(result).toBe("Clínica ABC");
      expect(repo.getByKey).toHaveBeenCalledWith("clinic_name");
    });

    it("set chama upsertMany com o par chave-valor", async () => {
      repo.upsertMany.mockResolvedValue();

      await settingsService.set("currency", "EUR");

      expect(repo.upsertMany).toHaveBeenCalledWith([
        { key: "currency", value: "EUR" },
      ]);
    });
  });

  describe("replaceAll", () => {
    it("chama clearAll e depois upsertMany com todos os entries", async () => {
      repo.clearAll.mockResolvedValue();
      repo.upsertMany.mockResolvedValue();

      await settingsService.replaceAll({
        clinic_name: "Nova Clínica",
        currency: "BRL",
        default_session_minutes: 50,
        default_business_hours: "",
      });

      expect(repo.clearAll).toHaveBeenCalledTimes(1);
      expect(repo.upsertMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getDefaultSettings", () => {
    it("retorna um objeto com os valores padrão corretos", () => {
      const defaults = settingsService.getDefaultSettings();

      expect(defaults.currency).toBe("BRL");
      expect(defaults.default_session_minutes).toBe(50);
      expect(defaults.clinic_name).toBe("");
    });

    it("retorna uma copia independente a cada chamada", () => {
      const a = settingsService.getDefaultSettings();
      const b = settingsService.getDefaultSettings();

      a.clinic_name = "Modificado";

      expect(b.clinic_name).toBe("");
    });
  });
});
