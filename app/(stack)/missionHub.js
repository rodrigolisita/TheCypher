import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mission data, now without the hardcoded 'locked' property.
const missions = [
  { id: '1', title: { en: 'Operation Nightingale', pt: 'Projeto Rouxinol' }, difficulty: 'Easy', cipher: 'Caesar' },
  { id: '2', title: { en: 'The Serpent\'s Kiss', pt: 'O Beijo da Serpente' }, difficulty: 'Easy', cipher: 'Atbash' },
  { id: '3', title: { en: 'Viper\'s Nest', pt: 'Covil da Víbora' }, difficulty: 'Medium', cipher: 'Vigenère' },
  { id: '4', title: { en: 'Ghost Protocol', pt: 'Protocolo Fantasma' }, difficulty: 'Hard', cipher: 'RSA' },
  { id: '5', title: { en: 'Shadow Veil', pt: 'Véu das Sombras' }, difficulty: 'Hard', cipher: 'AES' },
];

// Reusable component for displaying a single mission.
const MissionCell = ({ mission, onPress, language, isUnlocked }) => {
  return (
    <TouchableOpacity 
      style={[styles.cell, !isUnlocked && styles.cellLocked]}
      onPress={() => isUnlocked && onPress(mission)}
      disabled={!isUnlocked}
    >
      <View>
        <Text style={[styles.cellTitle, !isUnlocked && styles.cellTextLocked]}>{mission.title[language]}</Text>
        <Text style={[styles.cellSubtitle, !isUnlocked && styles.cellTextLocked]}>
          {language === 'pt' ? 'Dificuldade' : 'Difficulty'}: {mission.difficulty}
        </Text>
      </View>
      {!isUnlocked && (
        <Text style={styles.lockedText}>LOCKED</Text>
      )}
    </TouchableOpacity>
  );
};

export default function MissionHubScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [completedMissions, setCompletedMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  // Add state to remember the language.
  const [currentLanguage, setCurrentLanguage] = useState(params.language || 'en');

  // This effect updates our language state if a new param is passed.
  useEffect(() => {
    if (params.language) {
      setCurrentLanguage(params.language);
    }
  }, [params.language]);

  // useFocusEffect runs every time the screen comes into view.
  useFocusEffect(
    React.useCallback(() => {
      const loadProgress = async () => {
        setIsLoading(true); // Start loading
        try {
          const completed = await AsyncStorage.getItem('completedMissions');
          if (completed !== null) {
            setCompletedMissions(JSON.parse(completed));
          } else {
            setCompletedMissions([]); // Ensure it's an empty array if nothing is stored
          }
        } catch (e) {
          console.error("Failed to load progress.", e);
        } finally {
          setIsLoading(false); // Finish loading
        }
      };
      loadProgress();
    }, [])
  );

  const handleMissionSelect = (mission) => {
    // Navigate to the decryption room, passing the mission's ID and language.
    router.push({ 
      pathname: '/decryptionRoom', 
      params: { missionId: mission.id, language: currentLanguage }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          {currentLanguage === 'pt' ? 'Central de Missões' : 'Mission Hub'}
        </Text>
        <Text style={styles.subtitle}>
          {currentLanguage === 'pt' ? 'Selecione sua próxima missão.' : 'Select your next mission.'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff7f" />
        </View>
      ) : (
        <FlatList
          data={missions}
          renderItem={({ item, index }) => {
            // A mission is unlocked if it's the first one, or if the previous one is completed.
            const isUnlocked = index === 0 || completedMissions.includes(missions[index - 1].id);
            return (
              <MissionCell 
                mission={item} 
                onPress={handleMissionSelect}
                language={currentLanguage}
                isUnlocked={isUnlocked}
              />
            );
          }}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
        <Text style={styles.backButtonText}>
          {currentLanguage === 'pt' ? 'Voltar' : 'Go Back'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
