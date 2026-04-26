import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { CalendarDatePicker } from "@/components/ui/CalendarDatePicker";
import { Card } from "@/components/ui/Card";
import { financialService } from "@/modules/financial/financial.service";
import {
  FINANCIAL_KINDS,
  FinancialEntry,
  FinancialKind,
} from "@/modules/financial/types/financial.types";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { theme } from "@/shared/constants/theme";
import { toISODate, toPtBrDateTime } from "@/shared/utils/date";
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
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Financeiro</Text>
          <Text style={styles.subtitle}>ABRIL · 2026</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <Ionicons
              name="download-outline"
              size={18}
              color={theme.colors.textMuted}
            />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="filter" size={18} color={theme.colors.textMuted} />
          </Pressable>
        </View>
      </View>

      <View style={styles.filters}>
        <CalendarDatePicker
          label="De"
          value={startDate}
          onChange={(date) => setStartDate(date)}
        />

        <CalendarDatePicker
          label="Até"
          value={endDate}
          onChange={(date) => setEndDate(date)}
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
        <Ionicons name="add" size={16} color="#ffffff" />
        <Text style={styles.addLabel}>Novo lançamento</Text>
      </Pressable>

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo do mês</Text>
        <Text style={styles.balanceValue}>R$ {totals.saldo.toFixed(2)}</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryKey}>Entradas</Text>
            <Text style={[styles.summaryValue, styles.summaryValueIn]}>
              R$ {totals.entradas.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryKey}>Saídas</Text>
            <Text style={[styles.summaryValue, styles.summaryValueOut]}>
              R$ {totals.saidas.toFixed(2)}
            </Text>
          </View>
        </View>
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
    backgroundColor: theme.colors.background,
    padding: 16,
    gap: 10,
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
  title: {
    fontSize: theme.typography.h1.size,
    color: theme.colors.text,
    fontWeight: theme.typography.h1.weight,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "700",
    letterSpacing: 1,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.glowPrimary,
  },
  balanceLabel: {
    fontSize: 12,
    color: "#ffffff",
    opacity: 0.85,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  balanceValue: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "800",
    marginTop: 2,
  },
  summaryRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  summaryKey: {
    fontSize: 11,
    color: "#ffffff",
    opacity: 0.9,
    fontWeight: "700",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },
  summaryValueIn: {
    color: "#d1fae5",
  },
  summaryValueOut: {
    color: "#ffe4e6",
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
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  kindButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  kindButtonText: {
    color: theme.colors.textMuted,
    fontWeight: "600",
    fontSize: 12,
  },
  kindButtonTextActive: {
    color: theme.colors.primary,
  },
  addButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    ...theme.shadows.glowPrimary,
  },
  addLabel: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "800",
  },
  listContent: {
    gap: 10,
    paddingBottom: 140,
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
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
    flex: 1,
  },
  entryKind: {
    fontSize: 12,
    fontWeight: "700",
  },
  entryMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  entryAmount: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
});
