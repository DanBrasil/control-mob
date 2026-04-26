import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { settingsService } from "@/modules/settings/settings.service";
import { useToast } from "@/shared/hooks/useToast";

export default function SettingsScreen() {
  const toast = useToast();
  const [clinicName, setClinicName] = useState("");

  useEffect(() => {
    const load = async () => {
      const value = await settingsService.get("clinic_name");
      setClinicName(value ?? "");
    };

    load();
  }, []);

  const handleSave = async () => {
    await settingsService.set("clinic_name", clinicName);
    toast.show({ message: "Preferências salvas.", type: "success" });
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Configurações</Text>

      <Card style={styles.card}>
        <Input
          label="Nome da clínica"
          value={clinicName}
          onChangeText={setClinicName}
          placeholder="Ex.: Clínica Central"
        />
      </Card>

      <Button label="Salvar preferências" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    color: "#0f172a",
    fontWeight: "800",
  },
  card: {
    gap: 10,
  },
});
