
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BooksScreen() {
  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: '#F5F1ED' }]} 
      edges={['top']}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Books</Text>
          <Text style={styles.subtitle}>Scarlett&apos;s library</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>23 books</Text>
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
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E2A8B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#2E2A8B',
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: 40,
    right: 24,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
