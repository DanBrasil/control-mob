import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 18,
    color: "#0f172a",
    fontWeight: "800",
  },
  list: {
    gap: 8,
  },
  card: {
    gap: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    fontSize: 12,
    fontWeight: "700",
  },
  patientName: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "700",
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: "#475569",
  },
  meta: {
    fontSize: 12,
    color: "#64748b",
  },
  successCard: {
    gap: 4,
  },
  successTitle: {
    fontSize: 15,
    color: "#0f766e",
    fontWeight: "700",
  },
  successDescription: {
    fontSize: 13,
    color: "#475569",
  },
});
