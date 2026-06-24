import {GestureHandlerRootView} from "react-native-gesture-handler";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import * as SplashScreen from 'expo-splash-screen';
import {useMigrations} from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import {Edge, SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {db, expoDb} from "../db/client";
import {Alert, Platform, Text, View} from "react-native";
import {useEffect} from "react";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";

// Empêcher le splash screen de se cacher automatiquement
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expoDb);
  const queryClient = new QueryClient();
  const safeAreaEdges: Edge[] = ['right', 'left', 'top'];
  if (Platform.OS === 'ios') {
    safeAreaEdges.push('bottom');
  }

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour la base de données.');
      void SplashScreen.hideAsync();
    }

    if (success) {
      void SplashScreen.hideAsync();
    }
  }, [success, error]);

  if (!success && !error) {
    return null;
  }

  if (error) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Erreur de base de données. Veuillez redémarrer.</Text>
        </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} edges={safeAreaEdges}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
