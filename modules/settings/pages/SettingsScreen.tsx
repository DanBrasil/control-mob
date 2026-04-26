import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { SafeScreen } from "@/components/SafeScreen";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Button } from "@/components/ui/Button";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { theme } from "@/shared/constants/theme";
import { useToast } from "@/shared/hooks/useToast";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";
import {
  clearAllLocalData,
  LOCAL_DATA_PRIVACY_NOTICE,
} from "@/shared/utils/privacy";

import { BackupSection } from "@/modules/settings/components/BackupSection";
import { DangerZoneSection } from "@/modules/settings/components/DangerZoneSection";
import { ImportSection } from "@/modules/settings/components/ImportSection";
import { PrivacySection } from "@/modules/settings/components/PrivacySection";
import { SettingsForm } from "@/modules/settings/components/SettingsForm";
import { useSettings } from "@/modules/settings/hooks/useSettings";
import { SettingsFormValues } from "@/modules/settings/schemas/settings.schema";

export function SettingsScreen() {
  const toast = useToast();
  const [replaceConfirmVisible, setReplaceConfirmVisible] = useState(false);
  const [clearDataConfirmVisible, setClearDataConfirmVisible] = useState(false);
  const [clearingData, setClearingData] = useState(false);

  const {
    values,
    selectedFileName,
    loadingInitial,
    savingSettings,
    exporting,
    importing,
    pickingFile,
    error,
    reload,
    saveSettings,
    exportData,
    selectImportFile,
    importData,
  } = useSettings();

  const handleSaveSettings = async (formValues: SettingsFormValues) => {
    try {
      await saveSettings(formValues);
      toast.show({
        message: "Configuracoes salvas com sucesso.",
        type: "success",
      });
    } catch (saveError) {
      reportNonSensitiveError("settings.save", saveError);
      toast.show({
        message: getErrorMessage(saveError, FEEDBACK_MESSAGES.genericSaveError),
        type: "error",
      });
    }
  };

  const handleExport = async () => {
    try {
      const fileName = await exportData();
      toast.show({
        message: `Backup gerado (${fileName}).`,
        type: "success",
      });
    } catch (exportError) {
      reportNonSensitiveError("settings.export", exportError);
      toast.show({
        message: getErrorMessage(
          exportError,
          FEEDBACK_MESSAGES.genericExportError,
        ),
        type: "error",
      });
    }
  };

  const handleSelectFile = async () => {
    try {
      const name = await selectImportFile();

      if (name) {
        toast.show({
          message: `Arquivo selecionado: ${name}`,
          type: "info",
        });
      }
    } catch (selectionError) {
      reportNonSensitiveError("settings.pick-file", selectionError);
      toast.show({
        message: getErrorMessage(
          selectionError,
          FEEDBACK_MESSAGES.genericLoadError,
        ),
        type: "error",
      });
    }
  };

  const handleImportMerge = async () => {
    try {
      const report = await importData("merge");
      toast.show({
        message: `Importacao concluida: ${report.patientsInserted} pacientes, ${report.appointmentsInserted} agendamentos, ${report.financialEntriesInserted} lancamentos.`,
        type: "success",
      });
    } catch (mergeError) {
      reportNonSensitiveError("settings.import-merge", mergeError);
      toast.show({
        message: getErrorMessage(
          mergeError,
          FEEDBACK_MESSAGES.genericImportError,
        ),
        type: "error",
      });
    }
  };

  const handleConfirmReplace = async () => {
    setReplaceConfirmVisible(false);

    try {
      const report = await importData("replace");
      toast.show({
        message: `Dados substituidos: ${report.patientsInserted} pacientes, ${report.appointmentsInserted} agendamentos, ${report.financialEntriesInserted} lancamentos.`,
        type: "success",
      });
    } catch (replaceError) {
      reportNonSensitiveError("settings.import-replace", replaceError);
      toast.show({
        message: getErrorMessage(
          replaceError,
          FEEDBACK_MESSAGES.genericImportError,
        ),
        type: "error",
      });
    }
  };

  const handleConfirmClearAllData = async () => {
    setClearDataConfirmVisible(false);
    setClearingData(true);

    try {
      await clearAllLocalData();
      await reload();
      toast.show({
        message: FEEDBACK_MESSAGES.localDataRemoved,
        type: "success",
      });
    } catch (clearError) {
      reportNonSensitiveError("settings.clear-data", clearError);
      toast.show({
        message: getErrorMessage(
          clearError,
          FEEDBACK_MESSAGES.localDataRemovalError,
        ),
        type: "error",
      });
    } finally {
      setClearingData(false);
    }
  };

  if (loadingInitial) {
    return (
      <View style={styles.loadingWrapper}>
        <LoadingState label="Carregando configuracoes..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorWrapper}>
        <EmptyState title="Erro" description={error} />
        <Button label="Tentar novamente" onPress={reload} />
      </View>
    );
  }

  return (
    <>
      <SafeScreen contentStyle={styles.content}>
        <Text style={styles.title}>Configuracoes</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>AF</Text>
          </View>

          <View style={styles.profileBody}>
            <Text style={styles.profileName}>Nathaly Bruza</Text>
            <Text style={styles.profileMeta}>
              Psicóloga clínica · CRP 06/12345
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.colors.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuracoes gerais</Text>
          <SettingsForm
            defaultValues={values}
            loading={savingSettings}
            onSubmit={handleSaveSettings}
          />
        </View>

        <View style={styles.section}>
          <BackupSection loading={exporting} onExport={handleExport} />
        </View>

        <View style={styles.section}>
          <PrivacySection notice={LOCAL_DATA_PRIVACY_NOTICE} />
        </View>

        <View style={styles.section}>
          <ImportSection
            selectedFileName={selectedFileName}
            pickingFile={pickingFile}
            importing={importing}
            onPickFile={handleSelectFile}
            onImportMerge={handleImportMerge}
            onImportReplace={() => setReplaceConfirmVisible(true)}
          />
        </View>

        <View style={styles.section}>
          <DangerZoneSection
            loading={clearingData}
            onClearAllData={() => setClearDataConfirmVisible(true)}
          />
        </View>
      </SafeScreen>

      <ConfirmDialog
        visible={replaceConfirmVisible}
        title="Substituir dados atuais?"
        message="Esta acao remove os dados atuais e aplica o conteudo do arquivo selecionado."
        confirmLabel="Substituir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmReplace}
        onCancel={() => setReplaceConfirmVisible(false)}
      />

      <ConfirmDialog
        visible={clearDataConfirmVisible}
        title="Apagar todos os dados locais?"
        message="Esta acao remove permanentemente pacientes, agendamentos, financeiro e configuracoes deste dispositivo."
        confirmLabel="Apagar tudo"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmClearAllData}
        onCancel={() => setClearDataConfirmVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
  },
  title: {
    fontSize: 28,
    color: theme.colors.text,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  profileCard: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#ffffff",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitials: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
  },
  profileBody: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "800",
  },
  profileMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorWrapper: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 12,
    backgroundColor: theme.colors.background,
  },
});
