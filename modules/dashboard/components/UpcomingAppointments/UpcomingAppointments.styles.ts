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
  patientName: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  status: {
    fontSize: 12,
    fontWeight: "700",
  },
  meta: {
    color: "#475569",
    fontSize: 13,
  },
});
