import { settingsRepository } from "@/modules/settings/repositories/settings.repository";
import {
  GeneralSettings,
  SettingsEntry,
  SettingsKey,
} from "@/modules/settings/types/settings.types";

const DEFAULT_SETTINGS: GeneralSettings = {
  clinic_name: "",
  currency: "BRL",
  default_session_minutes: 50,
  default_business_hours: "",
};

const toEntries = (settings: GeneralSettings): SettingsEntry[] => [
  { key: "clinic_name", value: settings.clinic_name },
  { key: "currency", value: settings.currency },
  {
    key: "default_session_minutes",
    value: String(settings.default_session_minutes),
  },
  {
    key: "default_business_hours",
    value: settings.default_business_hours ?? "",
  },
];

const toSettingsObject = (entries: SettingsEntry[]): GeneralSettings => {
  const map = new Map(entries.map((entry) => [entry.key, entry.value]));

  return {
    clinic_name: map.get("clinic_name") ?? DEFAULT_SETTINGS.clinic_name,
    currency: map.get("currency") ?? DEFAULT_SETTINGS.currency,
    default_session_minutes: Number(map.get("default_session_minutes") ?? 50),
    default_business_hours: map.get("default_business_hours") ?? "",
  };
};

export const settingsService = {
  async get(key: SettingsKey): Promise<string | null> {
    return settingsRepository.getByKey(key);
  },

  async set(key: SettingsKey, value: string): Promise<void> {
    await settingsRepository.upsertMany([{ key, value }]);
  },

  async getGeneralSettings(): Promise<GeneralSettings> {
    const entries = await settingsRepository.listAll();
    return toSettingsObject(entries);
  },

  async saveGeneralSettings(settings: GeneralSettings): Promise<void> {
    await settingsRepository.upsertMany(toEntries(settings));
  },

  async listEntries(): Promise<SettingsEntry[]> {
    return settingsRepository.listAll();
  },

  async replaceAll(settings: GeneralSettings): Promise<void> {
    await settingsRepository.clearAll();
    await settingsRepository.upsertMany(toEntries(settings));
  },

  getDefaultSettings(): GeneralSettings {
    return { ...DEFAULT_SETTINGS };
  },
};
