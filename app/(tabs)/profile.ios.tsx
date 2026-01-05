
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
            await signOut();
            // Clear biometric settings
            await SecureStore.deleteItemAsync("biometric_enabled");
            await SecureStore.deleteItemAsync("user_email");
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const handleNavigateToSearch = () => {
    router.push('/search');
  };

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: isDark ? '#1a1a2e' : '#F5F1ED' }]} 
      edges={['top']}
    >
      <View style={styles.container}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Profile</Text>
        
        <View style={styles.infoContainer}>
          {user && (
            <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
              <IconSymbol
                ios_icon_name="person.circle.fill"
                android_material_icon_name="account-circle"
                size={64}
                color={isDark ? '#4A47A3' : '#2E2A8B'}
              />
              <Text style={[styles.userName, isDark && styles.userNameDark]}>
                {user.name || "User"}
              </Text>
              <Text style={[styles.userEmail, isDark && styles.userEmailDark]}>
                {user.email}
              </Text>
            </View>
          )}

          <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
            <IconSymbol
              ios_icon_name="lock.shield.fill"
              android_material_icon_name="security"
              size={32}
              color={isDark ? '#4A47A3' : '#2E2A8B'}
            />
            <Text style={[styles.infoTitle, isDark && styles.infoTitleDark]}>
              Biometric Security
            </Text>
            <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
              Face ID / Touch ID enabled for quick unlock
            </Text>
            <View style={styles.badge}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={16}
                color="#34C759"
              />
              <Text style={styles.badgeText}>Protected</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
            onPress={handleLogout}
          >
            <IconSymbol
              ios_icon_name="arrow.right.square.fill"
              android_material_icon_name="logout"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.searchButton, isDark && styles.searchButtonDark]}
            onPress={handleNavigateToSearch}
          >
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.searchButtonText}>To Search Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E2A8B',
    marginBottom: 32,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  infoContainer: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoCardDark: {
    backgroundColor: '#2a2a3e',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E2A8B',
    marginTop: 16,
  },
  userNameDark: {
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  userEmailDark: {
    color: '#CCCCCC',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E2A8B',
    marginTop: 16,
    marginBottom: 8,
  },
  infoTitleDark: {
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  infoTextDark: {
    color: '#CCCCCC',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoutButtonDark: {
    backgroundColor: '#FF453A',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  searchButtonDark: {
    backgroundColor: '#2ECC71',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
