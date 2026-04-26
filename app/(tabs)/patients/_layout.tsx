import { Stack } from "expo-router";

export default function PatientsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ title: "Novo paciente" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalhes do paciente" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Editar paciente" }} />
    </Stack>
  );
}
