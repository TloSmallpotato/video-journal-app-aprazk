
import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (loading) return;

      if (user) {
        // User is logged in, check if biometric is enabled
        const biometricEnabled = await SecureStore.getItemAsync("biometric_enabled");
        if (biometricEnabled === "true") {
          router.replace("/(auth)/biometric-lock");
        } else {
          router.replace("/(tabs)");
        }
      } else {
        // No user, go to login
        router.replace("/(auth)/login");
      }
    };

    checkAuth();
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
