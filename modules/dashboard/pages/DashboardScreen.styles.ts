import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 14,
  },
  title: {
    fontSize: 24,
    color: "#0f172a",
    fontWeight: "800",
  },
  generatedAt: {
    fontSize: 12,
    color: "#64748b",
    marginTop: -4,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryCard: {
    width: "48%",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorWrapper: {
    flex: 1,
    padding: 16,
    gap: 12,
    justifyContent: "center",
  },
});
