import { useEffect } from "react";
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { useGoogleDriveService } from "@/hooks/use-google-drive-service";
import { GoogleDriveService } from "@/services/GoogleDriveService";

export default function UserScreen() {
  const {
    request,
    login,
    accessToken,
  } = useGoogleDriveService();

  useEffect(() => {
    if (!accessToken) return;

    console.log("ACCESS TOKEN:");
    console.log(accessToken);

    const loadUser = async () => {
      try {
        const drive = new GoogleDriveService(accessToken);

        const user = await drive.getUser();

        console.log("Usuario Google:");
        console.log(user);

        Alert.alert(
          "Bienvenido",
          user.name ?? "Usuario"
        );
      } catch (error) {
        console.log(error);

        Alert.alert(
          "Error",
          "No fue posible obtener la información del usuario."
        );
      }
    };

    loadUser();
  }, [accessToken]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">
            Configuración
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.label}>
            Respaldo en Google Drive
          </ThemedText>

          <Button
            title="Conectar con Google"
            disabled={!request}
            onPress={login}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  scroll: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    paddingVertical: 12,
  },

  card: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    gap: 16,
  },

  label: {
    fontWeight: "600",
  },
});