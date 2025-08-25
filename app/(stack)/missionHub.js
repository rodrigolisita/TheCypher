/**
 * @file app/(stack)/missionHub.js
 * @brief The main menu screen where players can view and select missions. Manages the display of locked, unlocked, and completed states.
 * @author Rodrigo Lisita Ribera
 * @date August 2025
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { missions } from '../../data/missionData';
import { useAudio } from '../../hooks/useAudio';

// Reusable component for displaying a single mission.
const MissionCell = ({ mission, onPress, language, isUnlocked, isCompleted }) => {
  return (
    <TouchableOpacity 
      style={[styles.cell, !isUnlocked && styles.cellLocked, isCompleted && styles.cellCompleted]}
      onPress={() => isUnlocked && onPress(mission)} 
      disabled={!isUnlocked}
    >
      <View>
        <Text style={[styles.cellTitle, !isUnlocked && styles.cellTextLocked]}>{mission.title[language]}</Text>
        <Text style={[styles.cellSubtitle, !isUnlocked && styles.cellTextLocked]}>
          {language === 'pt' ? 'Dificuldade' : 'Difficulty'}: {mission.difficulty}
        </Text>
      </View>
      {/* Show a "LOCKED" or "COMPLETE" message */}
      {!isUnlocked ? (
        <Text style={styles.lockedText}>LOCKED</Text>
      ) : isCompleted ? (
        <Text style={styles.completedText}>COMPLETE</Text>
      ) : null}
    </TouchableOpacity>
  );
};


export default function MissionHubScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [completedMissions, setCompletedMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(params.language || 'en');
  const { stopAmbianceSound, playAmbianceSound } = useAudio();

  const handleGoBack = () => {
    router.replace('/');
  };

  // This effect updates our language state if a new param is passed.
  useEffect(() => {
    if (params.language) {
      setCurrentLanguage(params.language);
    }
  }, [params.language]);

  // 1. This hook ONLY handles loading the saved progress
  useFocusEffect(
    React.useCallback(() => {
      //playAmbianceSound();
      const loadProgress = async () => {
        setIsLoading(true);
        try {
          const completed = await AsyncStorage.getItem('completedMissions');
          if (completed !== null) {
            setCompletedMissions(JSON.parse(completed));
          } else {
            setCompletedMissions([]);
          }
        } catch (e) {
          console.error("Failed to load progress.", e);
        } finally {
          setIsLoading(false);
        }
      };
      loadProgress();
      
    }, [])
  );

  // 2. This hook ONLY handles the ambient sound
  useFocusEffect(
    React.useCallback(() => {
      playAmbianceSound();
      // This cleanup function stops the sound when you leave the screen
      return () => {
        stopAmbianceSound();
      };
    }, [playAmbianceSound, stopAmbianceSound])
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
            const isCompleted = completedMissions.includes(item.id);
            return (
              <MissionCell 
                mission={item} 
                onPress={handleMissionSelect}
                language={currentLanguage}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
              />
            );
          }}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
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
  cellCompleted: {
    borderColor: '#555',
    backgroundColor: '#1f2a24',
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
  completedText: {
    color: '#00ff7f', // Hacker green
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