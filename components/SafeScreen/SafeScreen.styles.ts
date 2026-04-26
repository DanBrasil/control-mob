import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  keyboardContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
    gap: 12,
  },
  contentNoScroll: {
    flex: 1,
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
});
