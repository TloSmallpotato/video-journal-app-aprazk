
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { HapticFeedback } from "@/utils/haptics";
import { IconSymbol } from "@/components/IconSymbol";

export default function LoginScreen() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await HapticFeedback.light();
      await signInWithEmail(email, password);

      // Check if biometric is available
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        // Store credentials for biometric unlock
        await SecureStore.setItemAsync("user_email", email);
        await SecureStore.setItemAsync("biometric_enabled", "true");
      }

      await HapticFeedback.success();
      router.replace("/(tabs)");
    } catch (error: any) {
      await HapticFeedback.error();
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <IconSymbol 
              ios_icon_name="video.fill" 
              android_material_icon_name="videocam" 
              size={60} 
              color="#007AFF" 
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <IconSymbol 
                ios_icon_name="envelope.fill" 
                android_material_icon_name="email" 
                size={20} 
                color="#8E8E93" 
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.inputContainer}>
              <IconSymbol 
                ios_icon_name="lock.fill" 
                android_material_icon_name="lock" 
                size={20} 
                color="#8E8E93" 
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                placeholderTextColor="#8E8E93"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <IconSymbol
                  ios_icon_name={showPassword ? "eye.slash.fill" : "eye.fill"}
                  android_material_icon_name={showPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color="#8E8E93"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text style={styles.linkText}>
                Don&apos;t have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  linkButton: {
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    fontSize: 15,
    color: "#8E8E93",
  },
  linkTextBold: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
