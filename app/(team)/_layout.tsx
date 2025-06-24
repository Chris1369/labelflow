import { Stack } from "expo-router";

export default function TeamLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]/members"
        options={{
          title: "Gestion des membres",
          headerBackTitle: "Retour",
        }}
      />
      <Stack.Screen
        name="[id]/projects"
        options={{
          title: "Gestion des projets",
          headerBackTitle: "Retour",
        }}
      />
    </Stack>
  );
}