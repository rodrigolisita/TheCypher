import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAudio } from '../../hooks/useAudio';

// Stores text for both English and Portuguese
const content = {
  en: {
    title: 'The Cypher',
    subtitle: 'A spy game of codes and secrets.',
    selectPrompt: 'Select your language:',
    startButton: 'Begin Mission',
    resetButton: 'Reset Progress',
    resetConfirmTitle: 'Reset Progress',
    resetConfirmMessage: 'Are you sure you want to clear all saved progress?'
  },
  pt: {
    title: 'O Enigma',
    subtitle: 'Um jogo de espionagem, códigos e segredos.',
    selectPrompt: 'Selecione seu idioma:',
    startButton: 'Iniciar Missão',
    resetButton: 'Resetar Progresso',
    resetConfirmTitle: 'Resetar Progresso',
    resetConfirmMessage: 'Tem certeza que deseja apagar todo o progresso salvo?'
  }
};

export default function App() {
  const [language, setLanguage] = useState('en');
  // Loading state to prevent UI flicker while loading from storage
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { playKeypressSound } = useAudio();

  // This useEffect runs once to load the saved language
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('user-language');
        if (savedLanguage !== null) {
          setLanguage(savedLanguage);
        }
      } catch (e) {
        console.error('Failed to load language from storage.', e);
      } finally {
        setIsLoading(false); // Stop loading once done
      }
    };
    loadLanguage();
  }, []);

  // saves the language choice
  const handleLanguageChange = async (selectedLang) => {
    playKeypressSound();
    setLanguage(selectedLang);
    try {
      await AsyncStorage.setItem('user-language', selectedLang);
    } catch (e) {
      console.error('Failed to save language to storage.', e);
    }
  };

  const handleBeginMission = async () => {
    await playKeypressSound();
    router.push({
      pathname: '/missionHub',
      params: { language: language }
    });
  };
  const handleResetProgress = async () => {
    await playKeypressSound();
    Alert.alert(
      content[language].resetConfirmTitle,
      content[language].resetConfirmMessage,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('completedMissions');
              alert('Progress has been reset.');
            } catch (e) {
              console.error("Failed to reset progress.", e);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // NEW: While loading from storage, show a spinner
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00ff7f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{content[language].title}</Text>
        <Text style={styles.subtitle}>{content[language].subtitle}</Text>
      </View>

      <View style={styles.languageSelector}>
        <Text style={styles.prompt}>{content[language].selectPrompt}</Text>
        <View style={styles.flagsContainer}>
          {/* MODIFIED: Use the new handler function */}
          <TouchableOpacity onPress={() => handleLanguageChange('en')}>
            <Image 
              source={require('../../assets/flag_uk.png')}
              style={[styles.flag, language === 'en' && styles.selectedFlag]} 
              onError={(e) => console.log('Error loading UK flag:', e.nativeEvent.error)}
            />
          </TouchableOpacity>
          {/* MODIFIED: Use the new handler function */}
          <TouchableOpacity onPress={() => handleLanguageChange('pt')}>
            <Image 
              source={require('../../assets/flag_brazil.png')}
              style={[styles.flag, language === 'pt' && styles.selectedFlag]} 
              onError={(e) => console.log('Error loading Brazil flag:', e.nativeEvent.error)}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleBeginMission}>
          <Text style={styles.buttonText}>{content[language].startButton}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetProgress}>
          <Text style={styles.resetButtonText}>{content[language].resetButton}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// All styles are in one place for organization
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark spy theme background
    alignItems: 'center',
    justifyContent: 'space-around', // Evenly distribute content vertically
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ff7f', // Hacker green for a thematic feel
    fontFamily: 'monospace', // Use a monospace font for the spy theme
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0', // Light gray for secondary text
    marginTop: 10,
    fontFamily: 'monospace',
  },
  languageSelector: {
    alignItems: 'center',
  },
  prompt: {
    fontSize: 18,
    color: '#ffffff', // White text for prompts
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  flagsContainer: {
    flexDirection: 'row', // Arrange flags side-by-side
  },
  flag: {
    width: 80,
    height: 50,
    borderRadius: 5,
    marginHorizontal: 15,
    borderColor: '#444', // Dark border for unselected flags
    borderWidth: 2,
    opacity: 0.6, // Make unselected flags less prominent
  },
  selectedFlag: {
    borderColor: '#00ff7f', // Highlight selected flag with the theme color
    opacity: 1.0,
    transform: [{ scale: 1.1 }], // Slightly enlarge the selected flag
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00ff7f',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 5, // Shadow for Android
    shadowColor: '#00ff7f', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  resetButton: {
    marginTop: 15,
    borderColor: '#ff4444',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#ff4444',
    fontSize: 14,
    fontFamily: 'monospace',
  }
});