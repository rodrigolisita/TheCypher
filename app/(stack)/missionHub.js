import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Mission data, including multilingual titles.
const missions = [
  { id: '1', title: { en: 'Operation Nightingale', pt: 'Projeto Rouxinol' }, difficulty: 'Easy', cipher: 'Caesar' },
  { id: '2', title: { en: 'The Serpent\'s Kiss', pt: 'O Beijo da Serpente' }, difficulty: 'Easy', cipher: 'Atbash' },
  { id: '3', title: { en: 'Viper\'s Nest', pt: 'Covil da Víbora' }, difficulty: 'Medium', cipher: 'Vigenère' },
  { id: '4', title: { en: 'Ghost Protocol', pt: 'Protocolo Fantasma' }, difficulty: 'Hard', cipher: 'RSA', locked: true },
  { id: '5', title: { en: 'Shadow Veil', pt: 'Véu das Sombras' }, difficulty: 'Hard', cipher: 'AES', locked: true },
];

// Reusable component for displaying a single mission.
const MissionCell = ({ mission, onPress, language }) => {
  const isLocked = mission.locked;
  return (
    <TouchableOpacity 
      style={[styles.cell, isLocked && styles.cellLocked]}
      onPress={() => !isLocked && onPress(mission)}
      disabled={isLocked}
    >
      <View>
        <Text style={[styles.cellTitle, isLocked && styles.cellTextLocked]}>{mission.title[language]}</Text>
        <Text style={[styles.cellSubtitle, isLocked && styles.cellTextLocked]}>
          {language === 'pt' ? 'Dificuldade' : 'Difficulty'}: {mission.difficulty}
        </Text>
      </View>
      {isLocked && (
        <Text style={styles.lockedText}>LOCKED</Text>
      )}
    </TouchableOpacity>
  );
};

export default function MissionHubScreen() {
  const { language } = useLocalSearchParams();
  const router = useRouter();

  const handleMissionSelect = (mission) => {
    // Navigate to the decryption room, passing the mission's ID and language.
    router.push({ 
      pathname: '/decryptionRoom', 
      params: { missionId: mission.id, language: language }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          {language === 'pt' ? 'Central de Missões' : 'Mission Hub'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'pt' ? 'Selecione sua próxima missão.' : 'Select your next mission.'}
        </Text>
      </View>

      <FlatList
        data={missions}
        renderItem={({ item }) => (
          <MissionCell 
            mission={item} 
            onPress={handleMissionSelect}
            language={language}
          />
        )}
        keyExtractor={item => item.id}
        style={styles.list}
      />

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
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
  list: {
    width: '100%',
  },
  cell: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ff7f',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cellLocked: {
    borderColor: '#555',
    backgroundColor: '#222',
  },
  cellTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  cellSubtitle: {
    color: '#a0a0a0',
    fontSize: 14,
    fontFamily: 'monospace',
    marginTop: 5,
  },
  cellTextLocked: {
    color: '#777',
  },
  lockedText: {
    color: '#ff4444',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    borderColor: '#00ff7f',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20, 
  },
  backButtonText: {
    color: '#00ff7f',
    fontSize: 16,
    fontFamily: 'monospace',
  }
});