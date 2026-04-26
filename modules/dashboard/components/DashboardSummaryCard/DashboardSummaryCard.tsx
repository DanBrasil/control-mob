import { Text } from "react-native";

import { Card } from "@/components/ui/Card";
import { styles } from "@/modules/dashboard/components/DashboardSummaryCard/DashboardSummaryCard.styles";
import { DashboardSummaryCardProps } from "@/modules/dashboard/components/DashboardSummaryCard/DashboardSummaryCard.types";

export function DashboardSummaryCard({
  title,
  value,
  helperText,
  accentColor,
}: DashboardSummaryCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, accentColor ? { color: accentColor } : null]}>
        {value}
      </Text>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </Card>
  );
}
