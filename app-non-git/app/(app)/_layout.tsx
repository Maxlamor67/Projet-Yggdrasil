import { Stack } from "expo-router";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useQuery} from "@tanstack/react-query";
import {ActivityIndicator, Alert} from "react-native";
import {db} from "../../db/client";
import {useProjectStore} from "../../store/projectStore";

export default function AppLayout() {
    const {setProject} = useProjectStore();
    const getFirstProjectQuery = useQuery({
        queryKey: ['getFirstProject'],
        queryFn: async () => {
            try {
                const existingProject = await db.query.projects.findFirst() || null;
                if (existingProject) {
                    setProject(existingProject);
                }
                return existingProject;
            } catch (_) {
                Alert.alert('Erreur', "Impossible de charger le projet.");
                return null;
            }
        },
    });

    if (getFirstProjectQuery.isPending) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!!getFirstProjectQuery.data?.id}>
                <Stack.Screen name="(map)" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Protected guard={!getFirstProjectQuery.data?.id}>
                <Stack.Screen name="index" />
            </Stack.Protected>

            <Stack.Screen name="scan-qr" />
            <Stack.Screen name="software-connect" />
        </Stack>
  );
}

