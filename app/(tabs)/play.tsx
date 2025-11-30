
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayScreen() {
  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: '#F5F1ED' }]} 
      edges={['top']}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Play</Text>
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
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E2A8B',
  },
});
