import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/helpers/errorBoundary";
import { QueryProvider } from "@/providers/QueryProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add your custom fonts here if needed
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }

    // Initialize error handler
    if (__DEV__) {
      // In development, show error logs button after 3 seconds
      setTimeout(() => {
        console.log(
          "🔍 To view error logs, call: errorHandler.showErrorLogs()"
        );
      }, 3000);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <QueryProvider>
          <AuthProvider>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name='(auth)' options={{ headerShown: false }} />
                <Stack.Screen name='(main)' options={{ headerShown: false }} />
                <Stack.Screen
                  name='(project)'
                  options={{ headerShown: false }}
                />
                <Stack.Screen name='(team)' options={{ headerShown: false }} />
                <Stack.Screen name='index' options={{ headerShown: false }} />
              </Stack>
            </BottomSheetModalProvider>
            <StatusBar 
              style='auto' 
              backgroundColor="transparent"
              translucent={Platform.OS === 'android'}
            />
          </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
