import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Props = {
  loading?: boolean;
  onClearAllData: () => void;
};

export function DangerZoneSection({ loading = false, onClearAllData }: Props) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Zona de perigo</Text>
      <Text style={styles.description}>
        Apaga pacientes, agendamentos, financeiro e configuracoes salvas neste
        dispositivo.
      </Text>

      <View style={styles.action}>
        <Button
          label="Apagar todos os dados locais"
          variant="danger"
          onPress={onClearAllData}
          loading={loading}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    color: "#b91c1c",
    fontWeight: "800",
  },
  description: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },
  action: {
    marginTop: 4,
  },
});
