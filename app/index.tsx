
import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

export default function Index() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // Redirect to tabs if authenticated, otherwise to login
  if (session) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return <Redirect href="/(auth)/login" />;
}
