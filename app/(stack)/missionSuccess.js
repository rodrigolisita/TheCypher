import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function MissionSuccessScreen() {
  const router = useRouter();
  const { decryptedMessage, language } = useLocalSearchParams();

  const handleContinue = () => {
    // Navigate back to the mission hub to see the progress.
    router.push('/missionHub');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {language === 'pt' ? 'MISSÃO COMPLETA' : 'MISSION COMPLETE'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'pt' ? 'Mensagem Decodificada:' : 'Decrypted Message:'}
        </Text>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{decryptedMessage}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>
          {language === 'pt' ? 'Continuar' : 'Continue'}
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
    justifyContent: 'space-between',
    padding: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff7f',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  messageBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
    width: '100%',
  },
  messageText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 18,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#00ff7f',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});