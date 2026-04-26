import { Stack } from "expo-router";

export default function FinancialStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ title: "Novo lançamento" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalhes do lançamento" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Editar lançamento" }} />
    </Stack>
  );
}
