import { Stack } from "expo-router";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";

export default function ProjectLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen
          name='[id]'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='[id]/add-items'
          options={{
            title: "Ajouter des items",
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name='[id]/view-items'
          options={{
            title: "Voir les items",
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name='[id]/export'
          options={{
            title: "Exporter",
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name='[id]/import'
          options={{
            title: "Importer",
            headerBackTitle: "Retour",
          }}
        />
      </Stack>
    </ProtectedRoute>
  );
}
