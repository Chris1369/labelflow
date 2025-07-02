import { Stack } from "expo-router";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";

export default function ProjectLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='[id]' />
        <Stack.Screen name='[id]/add-items' />
        <Stack.Screen name='[id]/view-items' />
        <Stack.Screen name='[id]/export' />
        <Stack.Screen name='[id]/import' />
      </Stack>
    </ProtectedRoute>
  );
}
