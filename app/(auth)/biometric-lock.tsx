
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { IconSymbol } from "@/components/IconSymbol";
import { HapticFeedback } from "@/utils/haptics";
import { LinearGradient } from "expo-linear-gradient";

export default function BiometricLockScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("biometric");

  useEffect(() => {
    checkBiometricType();
    // Auto-trigger biometric on mount
    setTimeout(() => authenticate(), 500);
  }, []);

  const checkBiometricType = async () => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      setBiometricType("Face ID");
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      setBiometricType("Touch ID");
    }
  };

  const authenticate = async () => {
    try {
      setIsAuthenticating(true);
      await HapticFeedback.light();

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Video Journal",
        fallbackLabel: "Use Password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        await HapticFeedback.success();
        router.replace("/(tabs)");
      } else {
        await HapticFeedback.error();
      }
    } catch (error) {
      console.error("Biometric auth error:", error);
      await HapticFeedback.error();
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleUsePassword = () => {
    router.replace("/(auth)/login");
  };

  return (
    <LinearGradient colors={["#007AFF", "#5856D6"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <IconSymbol
              ios_icon_name={biometricType === "Face ID" ? "faceid" : "touchid"}
              android_material_icon_name="fingerprint"
              size={80}
              color="#fff"
            />
          </View>

          <Text style={styles.title}>Video Journal</Text>
          <Text style={styles.subtitle}>Unlock with {biometricType}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={authenticate}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <React.Fragment>
                <IconSymbol
                  ios_icon_name={biometricType === "Face ID" ? "faceid" : "touchid"}
                  android_material_icon_name="fingerprint"
                  size={24}
                  color="#007AFF"
                />
                <Text style={styles.buttonText}>Unlock</Text>
              </React.Fragment>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={handleUsePassword}>
            <Text style={styles.linkText}>Use Password Instead</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 48,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
    minWidth: 200,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#007AFF",
  },
  linkButton: {
    marginTop: 24,
  },
  linkText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    textDecorationLine: "underline",
  },
});
