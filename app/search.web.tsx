
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: "center",
  },
});

export default function SearchScreenWeb() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#000" : "#F2F2F7" }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? "#FFF" : "#000" }]}>
          Push Notifications
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? "#FFF" : "#000" }]}>
          Push notifications are not supported on web. Please test on iOS or Android.
        </Text>
      </View>
    </SafeAreaView>
  );
}
