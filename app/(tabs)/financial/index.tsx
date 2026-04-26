import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { financialService } from "@/modules/financial/financial.service";
import {
  FINANCIAL_KINDS,
  FinancialEntry,
  FinancialKind,
} from "@/modules/financial/types/financial.types";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import {
  formatDateForPtBrInput,
  maskPtBrDateInput,
  normalizeDateInput,
  toISODate,
  toPtBrDateTime,
} from "@/shared/utils/date";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

const kindLabel: Record<FinancialKind, string> = {
  entrada: "Entrada",
  saida: "Saída",
};

const kindColor: Record<FinancialKind, string> = {
  entrada: "#0f766e",
  saida: "#b91c1c",
};

export default function FinancialScreen() {
  const router = useRouter();
  const [items, setItems] = useState<FinancialEntry[]>([]);
  const [totals, setTotals] = useState({ entradas: 0, saidas: 0, saldo: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialStartDate = toISODate();
  const initialEndDate = toISODate(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  );
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [startDateInput, setStartDateInput] = useState(
    formatDateForPtBrInput(initialStartDate),
  );
  const [endDateInput, setEndDateInput] = useState(
    formatDateForPtBrInput(initialEndDate),
  );
  const [kind, setKind] = useState<FinancialKind | undefined>();

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        setError(null);

        try {
          const [entries, dataTotals] = await Promise.all([
            financialService.list({ startDate, endDate, kind }),
            financialService.getTotals(),
          ]);

          setItems(entries);
          setTotals(dataTotals);
        } catch (loadError) {
          reportNonSensitiveError("financial.list.load", loadError);
          setError(
            getErrorMessage(loadError, FEEDBACK_MESSAGES.genericLoadError),
          );
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [startDate, endDate, kind]),
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Financeiro</Text>

      <View style={styles.filters}>
        <Input
          label="De"
          placeholder="DD/MM/AAAA"
          value={startDateInput}
          onChangeText={(value) => {
            const masked = maskPtBrDateInput(value);
            const normalized = normalizeDateInput(masked);

            setStartDateInput(masked);

            if (normalized) {
              setStartDate(normalized);
            }
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
        />
        <Input
          label="Até"
          placeholder="DD/MM/AAAA"
          value={endDateInput}
          onChangeText={(value) => {
            const masked = maskPtBrDateInput(value);
            const normalized = normalizeDateInput(masked);

            setEndDateInput(masked);

            if (normalized) {
              setEndDate(normalized);
            }
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.kindRow}>
        <Pressable
          style={[styles.kindButton, !kind ? styles.kindButtonActive : null]}
          onPress={() => setKind(undefined)}
          hitSlop={6}
        >
          <Text
            style={[
              styles.kindButtonText,
              !kind ? styles.kindButtonTextActive : null,
            ]}
          >
            Todos
          </Text>
        </Pressable>
        {FINANCIAL_KINDS.map((currentKind) => (
          <Pressable
            key={currentKind}
            style={[
              styles.kindButton,
              kind === currentKind ? styles.kindButtonActive : null,
            ]}
            onPress={() => setKind(currentKind)}
            hitSlop={6}
          >
            <Text
              style={[
                styles.kindButtonText,
                kind === currentKind ? styles.kindButtonTextActive : null,
              ]}
            >
              {kindLabel[currentKind]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/financial/create")}
      >
        <Text style={styles.addLabel}>+ Novo lançamento</Text>
      </Pressable>

      <Card style={styles.card}>
        <Text style={styles.label}>Entradas</Text>
        <Text style={styles.value}>R$ {totals.entradas.toFixed(2)}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.label}>Saídas</Text>
        <Text style={styles.value}>R$ {totals.saidas.toFixed(2)}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.label}>Saldo</Text>
        <Text style={styles.value}>R$ {totals.saldo.toFixed(2)}</Text>
      </Card>

      {loading ? <LoadingState label="Buscando lançamentos..." /> : null}
      {error ? <EmptyState title="Erro" description={error} /> : null}

      {!loading && !error ? (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              title="Nenhum lançamento"
              description="Crie um lançamento ou ajuste os filtros de período."
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(tabs)/financial/${item.id}`)}
            >
              <Card style={styles.entryCard}>
                <View style={styles.entryTop}>
                  <Text style={styles.entryTitle}>{item.title}</Text>
                  <Text
                    style={[styles.entryKind, { color: kindColor[item.kind] }]}
                  >
                    {kindLabel[item.kind]}
                  </Text>
                </View>
                <Text style={styles.entryMeta}>
                  {toPtBrDateTime(item.entry_date)}
                </Text>
                <Text style={styles.entryAmount}>
                  R$ {item.amount.toFixed(2)}
                </Text>
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
    gap: 10,
  },
  title: {
    fontSize: 24,
    color: "#0f172a",
    fontWeight: "800",
  },
  card: {
    gap: 5,
  },
  filters: {
    gap: 10,
  },
  kindRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  kindButton: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  kindButtonActive: {
    borderColor: "#1f4db8",
    backgroundColor: "#dbe7ff",
  },
  kindButtonText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 12,
  },
  kindButtonTextActive: {
    color: "#1f4db8",
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
  label: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  value: {
    fontSize: 22,
    color: "#1f4db8",
    fontWeight: "800",
  },
  listContent: {
    gap: 10,
    paddingBottom: 24,
  },
  entryCard: {
    gap: 4,
  },
  entryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  entryTitle: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  entryKind: {
    fontSize: 12,
    fontWeight: "700",
  },
  entryMeta: {
    color: "#475569",
    fontSize: 13,
  },
  entryAmount: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },
});
