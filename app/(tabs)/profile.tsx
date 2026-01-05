
import { HapticFeedback } from "@/utils/haptics";
import { router } from "expo-router";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { View, Text, StyleSheet, Platform, TouchableOpacity, useColorScheme, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { user, signOut, loading } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await HapticFeedback.light();
              await signOut();
              await HapticFeedback.success();
              router.replace("/(auth)/login");
            } catch (error) {
              await HapticFeedback.error();
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleNavigateToSearch = async () => {
    await HapticFeedback.light();
    router.push("/search");
  };

  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <IconSymbol
            ios_icon_name="person.circle.fill"
            android_material_icon_name="account-circle"
            size={100}
            color="#007AFF"
          />
          <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Profile</Text>
          {user && (
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: isDark ? "#fff" : "#000" }]}>
                {user.user_metadata?.name || user.email?.split("@")[0] || "User"}
              </Text>
              <Text style={[styles.userEmail, { color: isDark ? "#999" : "#666" }]}>
                {user.email}
              </Text>
              <View style={styles.badge}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={16}
                  color="#34C759"
                />
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? "#1C1C1E" : "#F2F2F7" }]}
            onPress={handleNavigateToSearch}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search"
                size={24}
                color="#007AFF"
              />
              <Text style={[styles.menuItemText, { color: isDark ? "#fff" : "#000" }]}>
                Search & Notifications
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={isDark ? "#666" : "#999"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#999" : "#666" }]}>
            Account Information
          </Text>
          <View style={[styles.infoCard, { backgroundColor: isDark ? "#1C1C1E" : "#F2F2F7" }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? "#999" : "#666" }]}>
                User ID
              </Text>
              <Text style={[styles.infoValue, { color: isDark ? "#fff" : "#000" }]} numberOfLines={1}>
                {user?.id?.substring(0, 8)}...
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? "#999" : "#666" }]}>
                Created
              </Text>
              <Text style={[styles.infoValue, { color: isDark ? "#fff" : "#000" }]}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          <IconSymbol
            ios_icon_name="arrow.right.square.fill"
            android_material_icon_name="logout"
            size={20}
            color="#fff"
          />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 48 : 0,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 16,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 199, 89, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  badgeText: {
    color: "#34C759",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
    textAlign: "right",
    marginLeft: 16,
  },
  infoDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
