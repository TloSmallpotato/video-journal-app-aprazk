
import { Redirect } from "expo-router";
import { Platform } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

export default function Index() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // On web, skip biometric lock and go straight to tabs or login
  if (Platform.OS === 'web') {
    if (session) {
      return <Redirect href="/(tabs)/profile" />;
    }
    return <Redirect href="/(auth)/login" />;
  }

  // On native platforms, use biometric lock if authenticated
  if (session) {
    return <Redirect href="/auth" />;
  }

  return <Redirect href="/(auth)/login" />;
}
