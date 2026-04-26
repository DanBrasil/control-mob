import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { patientsService } from "@/modules/patients/patients.service";
import { Patient } from "@/modules/patients/types/patient.types";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { theme } from "@/shared/constants/theme";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

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
      reportNonSensitiveError("patients.list.load", err);
      setError(getErrorMessage(err, FEEDBACK_MESSAGES.genericLoadError));
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
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Pacientes</Text>
          <Text style={styles.subtitle}>{patients.length} ATIVOS</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="filter" size={18} color={theme.colors.textMuted} />
          </Pressable>
          <Pressable
            style={[styles.iconButton, styles.iconButtonPrimary]}
            onPress={() => router.push("/(tabs)/patients/create")}
          >
            <Ionicons name="add" size={18} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      <Input
        label="Buscar"
        placeholder="Buscar por nome ou telefone"
        value={search}
        onChangeText={(value) => {
          setSearch(value);
          loadPatients(value);
        }}
      />

      <View style={styles.chipsRow}>
        <Text style={[styles.filterChip, styles.filterChipActive]}>Todos</Text>
        <Text style={styles.filterChip}>Ansiedade</Text>
        <Text style={styles.filterChip}>TDAH</Text>
        <Text style={styles.filterChip}>Casal</Text>
      </View>

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
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name
                        .split(" ")
                        .map((chunk) => chunk[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.meta}>
                      {item.phone || "Sem telefone"}
                    </Text>
                    {item.notes ? (
                      <Text style={styles.notes} numberOfLines={2}>
                        {item.notes}
                      </Text>
                    ) : null}
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.colors.textMuted}
                  />
                </View>
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
    backgroundColor: theme.colors.background,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  iconButtonPrimary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.h1.size,
    fontWeight: theme.typography.h1.weight,
    color: theme.colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "700",
    letterSpacing: 1,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#ffffff",
    color: theme.colors.textMuted,
    fontWeight: "600",
    fontSize: 12,
  },
  filterChipActive: {
    color: "#ffffff",
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  listContent: {
    gap: 10,
    paddingBottom: 140,
  },
  card: {
    padding: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "800",
  },
  meta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  notes: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});
