import { Text, View } from "react-native";

import { DashboardSummaryCard } from "@/modules/dashboard/components/DashboardSummaryCard";
import { DashboardFinancialSummary } from "@/modules/dashboard/types/dashboard.types";

import { styles } from "./MonthlyFinancialSummary.styles";

type Props = {
  data: DashboardFinancialSummary;
  formatMoney: (value: number) => string;
};

export function MonthlyFinancialSummary({ data, formatMoney }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo financeiro mensal</Text>

      <View style={styles.cards}>
        <DashboardSummaryCard
          title="Entradas"
          value={formatMoney(data.entries)}
          accentColor="#0f766e"
        />
        <DashboardSummaryCard
          title="Saídas"
          value={formatMoney(data.exits)}
          accentColor="#b91c1c"
        />
        <DashboardSummaryCard
          title="Saldo"
          value={formatMoney(data.balance)}
          accentColor={data.balance >= 0 ? "#1f4db8" : "#b91c1c"}
        />
      </View>
    </View>
  );
}
