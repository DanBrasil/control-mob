import { StyleSheet } from "react-native";

import { theme } from "@/shared/constants/theme";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 140,
    flexGrow: 1,
    gap: 12,
  },
  contentNoScroll: {
    flex: 1,
    padding: 16,
    paddingBottom: 140,
    gap: 12,
  },
});
