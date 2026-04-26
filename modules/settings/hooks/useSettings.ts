import { useCallback, useEffect, useState } from "react";

import { SettingsFormValues } from "@/modules/settings/schemas/settings.schema";
import { settingsService } from "@/modules/settings/settings.service";
import {
  BackupImportMode,
  ImportFileSelection,
  ImportReport,
} from "@/modules/settings/types/settings.types";
import { backupService } from "@/services/backup/backup.service";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";
import { pickJsonFile } from "@/shared/utils/file";

const initialValues: SettingsFormValues = {
  clinic_name: "",
  currency: "BRL",
  default_session_minutes: 50,
  default_business_hours: "",
};

export const useSettings = () => {
  const [values, setValues] = useState<SettingsFormValues>(initialValues);
  const [selectedFile, setSelectedFile] = useState<ImportFileSelection | null>(
    null,
  );
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [pickingFile, setPickingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setLoadingInitial(true);
    setError(null);

    try {
      const settings = await settingsService.getGeneralSettings();
      setValues({
        clinic_name: settings.clinic_name,
        currency: settings.currency,
        default_session_minutes: settings.default_session_minutes,
        default_business_hours: settings.default_business_hours || "",
      });
    } catch (loadError) {
      reportNonSensitiveError("settings.hook.load", loadError);
      setError(getErrorMessage(loadError, FEEDBACK_MESSAGES.genericLoadError));
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSettings = useCallback(async (formValues: SettingsFormValues) => {
    setSavingSettings(true);

    try {
      await settingsService.saveGeneralSettings({
        clinic_name: formValues.clinic_name,
        currency: formValues.currency,
        default_session_minutes: formValues.default_session_minutes,
        default_business_hours: formValues.default_business_hours || "",
      });

      setValues(formValues);
    } finally {
      setSavingSettings(false);
    }
  }, []);

  const exportData = useCallback(async (): Promise<string> => {
    setExporting(true);

    try {
      const exported = await backupService.exportAndShareBackup();
      return exported.fileName;
    } finally {
      setExporting(false);
    }
  }, []);

  const selectImportFile = useCallback(async (): Promise<string | null> => {
    setPickingFile(true);

    try {
      const file = await pickJsonFile();

      if (!file) {
        return null;
      }

      setSelectedFile(file);
      return file.name;
    } finally {
      setPickingFile(false);
    }
  }, []);

  const clearImportFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const importData = useCallback(
    async (mode: BackupImportMode): Promise<ImportReport> => {
      if (!selectedFile) {
        throw new Error("Selecione um arquivo JSON antes de importar.");
      }

      setImporting(true);

      try {
        const report = await backupService.importFromJson(
          selectedFile.content,
          mode,
        );
        await loadSettings();
        return report;
      } finally {
        setImporting(false);
      }
    },
    [loadSettings, selectedFile],
  );

  return {
    values,
    selectedFileName: selectedFile?.name ?? "",
    loadingInitial,
    savingSettings,
    exporting,
    importing,
    pickingFile,
    error,
    reload: loadSettings,
    saveSettings,
    exportData,
    selectImportFile,
    clearImportFile,
    importData,
  };
};
