import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useSettings } from "@/modules/settings/hooks/useSettings";
import { settingsService } from "@/modules/settings/settings.service";
import { backupService } from "@/services/backup/backup.service";

jest.mock("@/modules/settings/settings.service", () => ({
  settingsService: {
    getGeneralSettings: jest.fn(),
    saveGeneralSettings: jest.fn(),
  },
}));

jest.mock("@/services/backup/backup.service", () => ({
  backupService: {
    exportAndShareBackup: jest.fn(),
    importFromJson: jest.fn(),
  },
}));

jest.mock("@/shared/utils/file", () => ({
  pickJsonFile: jest.fn(),
}));

const mockGetSettings = settingsService.getGeneralSettings as jest.Mock;
const mockSaveSettings = settingsService.saveGeneralSettings as jest.Mock;
const mockExport = backupService.exportAndShareBackup as jest.Mock;
const mockImport = backupService.importFromJson as jest.Mock;

import { pickJsonFile } from "@/shared/utils/file";
const mockPickFile = pickJsonFile as jest.Mock;

const defaultSettings = {
  clinic_name: "Clínica Saúde",
  currency: "BRL",
  default_session_minutes: 50,
  default_business_hours: "08:00-18:00",
};

describe("useSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSettings.mockResolvedValue(defaultSettings);
  });

  it("carrega configuracoes ao montar o hook", async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.loadingInitial).toBe(false);
    });

    expect(result.current.values.clinic_name).toBe("Clínica Saúde");
    expect(result.current.values.currency).toBe("BRL");
  });

  it("inicia loadingInitial como true", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.loadingInitial).toBe(true);
  });

  it("define error quando carregamento falha", async () => {
    mockGetSettings.mockRejectedValue(new Error("DB error"));

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.loadingInitial).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
  });

  it("saveSettings chama servico e atualiza values", async () => {
    mockSaveSettings.mockResolvedValue(undefined);

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.loadingInitial).toBe(false);
    });

    const newValues = { ...defaultSettings, clinic_name: "Nova Clínica" };

    await act(async () => {
      await result.current.saveSettings(newValues);
    });

    expect(mockSaveSettings).toHaveBeenCalledWith(newValues);
    expect(result.current.values.clinic_name).toBe("Nova Clínica");
  });

  it("exportData chama exportAndShareBackup e retorna nome do arquivo", async () => {
    mockExport.mockResolvedValue({
      fileName: "backup-2026.json",
      uri: "/tmp/backup.json",
    });

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.loadingInitial).toBe(false);
    });

    let fileName: string;

    await act(async () => {
      fileName = await result.current.exportData();
    });

    expect(fileName!).toBe("backup-2026.json");
    expect(mockExport).toHaveBeenCalledTimes(1);
  });

  it("selectImportFile define selectedFileName quando arquivo e selecionado", async () => {
    mockPickFile.mockResolvedValue({ name: "dados.json", content: "{}" });

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.loadingInitial).toBe(false);
    });

    await act(async () => {
      await result.current.selectImportFile();
    });

    expect(result.current.selectedFileName).toBe("dados.json");
  });

  it("selectImportFile retorna null quando usuario cancela", async () => {
    mockPickFile.mockResolvedValue(null);

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.loadingInitial).toBe(false);
    });

    let returned: string | null;

    await act(async () => {
      returned = await result.current.selectImportFile();
    });

    expect(returned!).toBeNull();
    expect(result.current.selectedFileName).toBe("");
  });

  it("clearImportFile limpa arquivo selecionado", async () => {
    mockPickFile.mockResolvedValue({ name: "arquivo.json", content: "{}" });

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.loadingInitial).toBe(false);
    });

    await act(async () => {
      await result.current.selectImportFile();
    });

    expect(result.current.selectedFileName).toBe("arquivo.json");

    act(() => {
      result.current.clearImportFile();
    });

    expect(result.current.selectedFileName).toBe("");
  });

  it("importData lanca erro quando nenhum arquivo foi selecionado", async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.loadingInitial).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.importData("replace");
      }),
    ).rejects.toThrow("Selecione um arquivo JSON antes de importar.");
  });

  it("importData chama importFromJson e retorna relatorio", async () => {
    mockPickFile.mockResolvedValue({
      name: "backup.json",
      content: '{"patients":[]}',
    });
    mockImport.mockResolvedValue({
      mode: "replace",
      patientsInserted: 0,
      appointmentsInserted: 0,
      financialEntriesInserted: 0,
      appointmentsSkipped: 0,
    });

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.loadingInitial).toBe(false);
    });

    await act(async () => {
      await result.current.selectImportFile();
    });

    let report: Awaited<ReturnType<typeof result.current.importData>>;

    await act(async () => {
      report = await result.current.importData("replace");
    });

    expect(report!.mode).toBe("replace");
    expect(mockImport).toHaveBeenCalledWith('{"patients":[]}', "replace");
  });
});
