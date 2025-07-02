import { Stack } from "expo-router";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";

export default function TeamLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[id]" />
        <Stack.Screen name="[id]/members" />
        <Stack.Screen name="[id]/projects" />
      </Stack>
    </ProtectedRoute>
  );
}