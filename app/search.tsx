
import React from "react";
import { View, Text, StyleSheet, Platform, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: isDark ? '#1a1a2e' : '#F5F1ED' }]} 
      edges={['top']}
    >
      <View style={styles.container}>
        <Text style={[styles.searchText, isDark && styles.searchTextDark]}>Search</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 48 : 0,
    paddingHorizontal: 24,
  },
  searchText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E2A8B',
  },
  searchTextDark: {
    color: '#FFFFFF',
  },
});
