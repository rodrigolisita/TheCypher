import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function MissionHubScreen() {
  // Read the language parameter passed from the previous screen
  const { language } = useLocalSearchParams();
  const router = useRouter(); // Initialize router to handle navigation

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          {language === 'pt' ? 'Central de Missões' : 'Mission Hub'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'pt' ? 'Selecione sua próxima missão.' : 'Select your next mission.'}
        </Text>
      </View>

      {/* Button to navigate back to the language selection screen */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>
          {language === 'pt' ? 'Voltar' : 'Go Back'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'space-around', // Adjusted to space out content
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#00ff7f',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'monospace',
  },
  backButton: {
    borderColor: '#00ff7f',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#00ff7f',
    fontSize: 16,
    fontFamily: 'monospace',
  }
});