import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { theme } from "@/shared/constants/theme";

type Props = {
  loading?: boolean;
  onExport: () => Promise<void>;
};

export function BackupSection({ loading = false, onExport }: Props) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Backup</Text>
      <Text style={styles.description}>
        Exporte pacientes, agendamentos, financeiro e configuracoes em JSON.
      </Text>

      <View style={styles.action}>
        <Button label="Exportar dados" onPress={onExport} loading={loading} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  title: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "800",
  },
  description: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 19,
  },
  action: {
    marginTop: 4,
  },
});
