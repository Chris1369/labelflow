import { Stack } from "expo-router";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";

export default function MainLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name='home' options={{ headerShown: false }} />
        <Stack.Screen
          name='select-project'
          options={{
            title: "Sélectionner un projet",
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name='select-team'
          options={{
            title: "Sélectionner une équipe",
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name='categories'
          options={{
            title: "Catégories",
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name='labels'
          options={{
            title: "Labels",
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name='dictionary'
          options={{
            title: "Dictionnaire",
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name='settings'
          options={{
            title: "Paramètres",
            headerBackTitle: "Retour",
          }}
        />
        <Stack.Screen
          name='help'
          options={{
            title: "Aide",
            headerBackTitle: "Retour",
          }}
        />
      </Stack>
    </ProtectedRoute>
  );
}
