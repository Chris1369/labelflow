import { Stack } from "expo-router";
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";

export default function MainLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='home' />
        <Stack.Screen name='select-project' />
        <Stack.Screen name='select-team' />
        <Stack.Screen name='categories' />
        <Stack.Screen name='labels' />
        <Stack.Screen name='dictionary' />
        <Stack.Screen name='settings' />
        <Stack.Screen name='help' />
      </Stack>
    </ProtectedRoute>
  );
}
