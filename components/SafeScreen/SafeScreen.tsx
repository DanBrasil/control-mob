import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  View,
  ViewProps,
} from "react-native";

import { styles } from "@/components/SafeScreen/SafeScreen.styles";

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardVerticalOffset?: number;
  scrollViewProps?: ScrollViewProps;
  contentStyle?: ViewProps["style"];
};

export function SafeScreen({
  children,
  scrollable = true,
  keyboardVerticalOffset = 80,
  scrollViewProps,
  contentStyle,
}: Props) {
  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {scrollable ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            {...scrollViewProps}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.contentNoScroll, contentStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
