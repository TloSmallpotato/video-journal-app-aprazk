
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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { HapticFeedback } from "@/utils/haptics";
import { IconSymbol } from "@/components/IconSymbol";

export default function SignupScreen() {
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      await HapticFeedback.light();
      await signUpWithEmail(email, password, name);
      await HapticFeedback.success();
      router.replace("/(tabs)");
    } catch (error: any) {
      await HapticFeedback.error();
      Alert.alert("Signup Failed", error.message || "Could not create account");
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <IconSymbol 
                ios_icon_name="chevron.left" 
                android_material_icon_name="arrow-back" 
                size={24} 
                color="#007AFF" 
              />
            </TouchableOpacity>

            <View style={styles.header}>
              <IconSymbol 
                ios_icon_name="person.crop.circle.badge.plus" 
                android_material_icon_name="person-add" 
                size={60} 
                color="#007AFF" 
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <IconSymbol 
                  ios_icon_name="person.fill" 
                  android_material_icon_name="person" 
                  size={20} 
                  color="#8E8E93" 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                  placeholderTextColor="#8E8E93"
                />
              </View>

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
                  autoComplete="password-new"
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

              <View style={styles.inputContainer}>
                <IconSymbol 
                  ios_icon_name="lock.fill" 
                  android_material_icon_name="lock" 
                  size={20} 
                  color="#8E8E93" 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.back()}
              >
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 24,
    zIndex: 1,
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
