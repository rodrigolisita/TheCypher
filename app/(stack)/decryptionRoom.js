import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// We need the mission data here too, to find the selected mission by its ID.
const missions = [
  { id: '1', title: { en: 'Operation Nightingale', pt: 'Projeto Rouxinol' }, difficulty: 'Easy', cipher: 'Caesar' },
  { id: '2', title: { en: 'The Serpent\'s Kiss', pt: 'O Beijo da Serpente' }, difficulty: 'Easy', cipher: 'Atbash' },
  { id: '3', title: { en: 'Viper\'s Nest', pt: 'Covil da Víbora' }, difficulty: 'Medium', cipher: 'Vigenère' },
  { id: '4', title: { en: 'Ghost Protocol', pt: 'Protocolo Fantasma' }, difficulty: 'Hard', cipher: 'RSA', locked: true },
  { id: '5', title: { en: 'Shadow Veil', pt: 'Véu das Sombras' }, difficulty: 'Hard', cipher: 'AES', locked: true },
];

export default function DecryptionRoomScreen() {
  const router = useRouter();
  // Get the parameters passed from the mission hub
  const { missionId, language } = useLocalSearchParams();

  // Find the full mission object from our data array
  const selectedMission = missions.find(m => m.id === missionId);

  // If for some reason the mission isn't found, show an error
  if (!selectedMission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Mission Not Found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Return to Hub</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.missionTitle}>{selectedMission.title[language]}</Text>
        <Text style={styles.missionInfo}>Cipher: {selectedMission.cipher}</Text>
      </View>

      {/* Placeholder for the main puzzle content */}
      <View style={styles.puzzleContainer}>
        <Text style={styles.placeholderText}>[Decryption Puzzle Interface Here]</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>
          {language === 'pt' ? 'Retornar ao Hub' : 'Return to Hub'}
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
    justifyContent: 'space-between', // Pushes header up, button down
    padding: 20,
  },
  header: {
    width: '100%',
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: 28,
    color: '#00ff7f',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  missionInfo: {
    fontSize: 16,
    color: '#a0a0a0',
    fontFamily: 'monospace',
    marginTop: 5,
  },
  puzzleContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#555',
    fontFamily: 'monospace',
    fontSize: 18,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 24,
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