import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { patientsService } from "@/modules/patients/patients.service";
import { Patient } from "@/modules/patients/types/patient.types";

export default function PatientsListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = async (value = search) => {
    setLoading(true);
    setError(null);

    try {
      const data = await patientsService.list(value);
      setPatients(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar pacientes.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [search]),
  );

  return (
    <View style={styles.screen}>
      <Input
        label="Buscar"
        placeholder="Nome ou telefone"
        value={search}
        onChangeText={(value) => {
          setSearch(value);
          loadPatients(value);
        }}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/patients/create")}
      >
        <Text style={styles.addLabel}>+ Adicionar paciente</Text>
      </Pressable>

      {loading ? <LoadingState label="Buscando pacientes..." /> : null}
      {error ? <EmptyState title="Erro" description={error} /> : null}

      {!loading && !error ? (
        <FlatList
          data={patients}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              title="Nenhum paciente"
              description="Cadastre seu primeiro paciente para começar."
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(tabs)/patients/${item.id}`)}
            >
              <Card style={styles.card}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.phone || "Sem telefone"}</Text>
                {item.notes ? (
                  <Text style={styles.notes}>{item.notes}</Text>
                ) : null}
              </Card>
            </Pressable>
          )}
        />
      ) : null}
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
  addButton: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: "#dbe7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  addLabel: {
    fontSize: 14,
    color: "#1f4db8",
    fontWeight: "700",
  },
  listContent: {
    gap: 10,
    paddingBottom: 20,
  },
  card: {
    gap: 6,
  },
  name: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "700",
  },
  meta: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  notes: {
    fontSize: 13,
    color: "#64748b",
  },
});
