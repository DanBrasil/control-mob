import { backupService } from "@/services/backup/backup.service";
import { getDatabase } from "@/services/database";

jest.mock("@/services/database", () => ({
  getDatabase: jest.fn(),
}));

jest.mock("@/modules/patients/repositories/patients.repository", () => ({
  patientsRepository: {
    list: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock(
  "@/modules/appointments/repositories/appointments.repository",
  () => ({
    appointmentsRepository: {
      list: jest.fn().mockResolvedValue([]),
    },
  }),
);

jest.mock("@/modules/financial/repositories/financial.repository", () => ({
  financialRepository: {
    list: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock("@/modules/settings/settings.service", () => ({
  settingsService: {
    getGeneralSettings: jest.fn().mockResolvedValue({
      clinic_name: "",
      currency: "BRL",
      default_session_minutes: 50,
      default_business_hours: "",
    }),
    saveGeneralSettings: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@/shared/utils/file", () => ({
  writeJsonFile: jest.fn().mockResolvedValue("/tmp/backup.json"),
  shareFile: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/shared/utils/date", () => ({
  toISODateTime: jest.fn(() => "2026-04-26T00:00:00.000Z"),
}));

const db = {
  runAsync: jest.fn().mockResolvedValue({}),
  execAsync: jest.fn().mockResolvedValue({}),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
};

beforeEach(() => {
  jest.clearAllMocks();
  (getDatabase as jest.Mock).mockResolvedValue(db);
});

const validPayload = {
  patients: [{ id: 1, name: "Maria Silva", phone: null, notes: null }],
  appointments: [
    {
      id: 1,
      patient_id: 1,
      title: "Consulta inicial",
      notes: null,
      start_date: "2026-04-28T10:00:00.000Z",
      status: "agendado",
    },
  ],
  financial_entries: [
    {
      id: 1,
      title: "Sessão",
      amount: 150,
      kind: "entrada",
      entry_date: "2026-04-28T10:00:00.000Z",
      notes: null,
    },
  ],
  settings: {
    clinic_name: "Minha Clínica",
    currency: "BRL",
    default_session_minutes: 50,
  },
};

describe("backupService.importFromJson", () => {
  it("lanca erro quando JSON e malformado", async () => {
    await expect(
      backupService.importFromJson("{invalido}", "replace"),
    ).rejects.toThrow("Arquivo JSON invalido.");
  });

  it("lanca erro quando estrutura JSON e invalida", async () => {
    const json = JSON.stringify({ patients: "nao-e-array" });

    await expect(backupService.importFromJson(json, "replace")).rejects.toThrow(
      /Estrutura invalida/,
    );
  });

  it("retorna relatorio de replace com contagem correta", async () => {
    const report = await backupService.importFromJson(
      JSON.stringify(validPayload),
      "replace",
    );

    expect(report.mode).toBe("replace");
    expect(report.patientsInserted).toBe(1);
    expect(report.appointmentsInserted).toBe(1);
    expect(report.financialEntriesInserted).toBe(1);
    expect(report.appointmentsSkipped).toBe(0);
  });

  it("executa BEGIN TRANSACTION e COMMIT no modo replace", async () => {
    await backupService.importFromJson(JSON.stringify(validPayload), "replace");

    expect(db.execAsync).toHaveBeenCalledWith("BEGIN TRANSACTION;");
    expect(db.execAsync).toHaveBeenCalledWith("COMMIT;");
  });

  it("executa DELETE em todas as tabelas no modo replace", async () => {
    await backupService.importFromJson(JSON.stringify(validPayload), "replace");

    expect(db.runAsync).toHaveBeenCalledWith("DELETE FROM appointments;");
    expect(db.runAsync).toHaveBeenCalledWith("DELETE FROM patients;");
    expect(db.runAsync).toHaveBeenCalledWith("DELETE FROM financial_entries;");
    expect(db.runAsync).toHaveBeenCalledWith("DELETE FROM settings;");
  });

  it("retorna relatorio de merge sem duplicar registros existentes", async () => {
    db.getAllAsync.mockImplementation(async (query: string) => {
      if (query.includes("FROM patients")) return [{ id: 1 }];
      if (query.includes("FROM appointments")) return [];
      if (query.includes("FROM financial_entries")) return [];
      return [];
    });

    const report = await backupService.importFromJson(
      JSON.stringify(validPayload),
      "merge",
    );

    expect(report.mode).toBe("merge");
    expect(report.patientsInserted).toBe(0);
  });

  it("pula agendamento cujo patient_id nao existe no merge", async () => {
    db.getAllAsync.mockImplementation(async (query: string) => {
      if (query.includes("FROM patients")) return [];
      if (query.includes("FROM appointments")) return [];
      if (query.includes("FROM financial_entries")) return [];
      return [];
    });

    const payloadSemPaciente = {
      ...validPayload,
      patients: [],
      appointments: [validPayload.appointments[0]],
    };

    const report = await backupService.importFromJson(
      JSON.stringify(payloadSemPaciente),
      "merge",
    );

    expect(report.appointmentsSkipped).toBe(1);
    expect(report.appointmentsInserted).toBe(0);
  });

  it("executa ROLLBACK quando ocorre erro durante o import", async () => {
    db.runAsync.mockRejectedValueOnce(new Error("UNIQUE constraint"));

    await expect(
      backupService.importFromJson(JSON.stringify(validPayload), "replace"),
    ).rejects.toThrow();

    expect(db.execAsync).toHaveBeenCalledWith("ROLLBACK;");
  });
});
