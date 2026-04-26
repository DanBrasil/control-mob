import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Props = {
  selectedFileName: string;
  pickingFile?: boolean;
  importing?: boolean;
  onPickFile: () => Promise<void>;
  onImportMerge: () => Promise<void>;
  onImportReplace: () => void;
};

export function ImportSection({
  selectedFileName,
  pickingFile = false,
  importing = false,
  onPickFile,
  onImportMerge,
  onImportReplace,
}: Props) {
  const hasFile = selectedFileName.length > 0;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Importacao</Text>
      <Text style={styles.description}>
        Selecione um backup JSON e escolha entre mesclar com os dados atuais ou
        substituir tudo.
      </Text>

      <View style={styles.fileArea}>
        <Text style={styles.fileLabel}>Arquivo selecionado</Text>
        <Text style={styles.fileName}>
          {hasFile ? selectedFileName : "Nenhum arquivo"}
        </Text>
      </View>

      <Button
        label="Selecionar arquivo JSON"
        variant="outline"
        onPress={onPickFile}
        loading={pickingFile}
      />

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button
            label="Mesclar dados"
            onPress={onImportMerge}
            loading={importing}
            disabled={!hasFile || pickingFile}
          />
        </View>

        <View style={styles.actionButton}>
          <Button
            label="Substituir dados"
            variant="danger"
            onPress={onImportReplace}
            loading={importing}
            disabled={!hasFile || pickingFile}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  title: {
    fontSize: 18,
    color: "#0f172a",
    fontWeight: "800",
  },
  description: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },
  fileArea: {
    borderWidth: 1,
    borderColor: "#dbe4f0",
    borderRadius: 10,
    backgroundColor: "#f8fbff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  fileLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  fileName: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "600",
  },
  actions: {
    gap: 8,
  },
  actionButton: {
    width: "100%",
  },
});
