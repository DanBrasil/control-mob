import { Stack } from "expo-router";

export default function AppointmentsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ title: "Novo agendamento" }} />
      <Stack.Screen
        name="[id]"
        options={{ title: "Detalhes do agendamento" }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{ title: "Editar agendamento" }}
      />
    </Stack>
  );
}
