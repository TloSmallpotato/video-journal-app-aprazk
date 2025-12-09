
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBiometricAuth } from "../../contexts/BiometricAuthContext";
import { IconSymbol } from "../../components/IconSymbol";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { logout, isBiometricSupported, isBiometricEnrolled } = useBiometricAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogout = async () => {
    await logout();
    router.replace('/auth');
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
              Status: {isBiometricSupported && isBiometricEnrolled ? 'Enabled' : 'Not Available'}
            </Text>
            {isBiometricSupported && isBiometricEnrolled && (
              <View style={styles.badge}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check_circle"
                  size={16}
                  color="#34C759"
                />
                <Text style={styles.badgeText}>Protected</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
            onPress={handleLogout}
          >
            <IconSymbol
              ios_icon_name="lock.fill"
              android_material_icon_name="lock"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.logoutButtonText}>Lock App</Text>
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
    elevation: 3,
  },
  infoCardDark: {
    backgroundColor: '#2a2a3e',
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
    backgroundColor: '#2E2A8B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonDark: {
    backgroundColor: '#4A47A3',
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
    elevation: 4,
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
