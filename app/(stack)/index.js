import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  // State for the current language, 'en' is the default
  const [language, setLanguage] = useState('en');
  const router = useRouter(); // Initialize the router

  // This function now navigates to the missionHub screen
  const handleBeginMission = () => {
    router.push({
      pathname: '/missionHub',
      params: { language: language } // Pass the selected language
    });
  };

  const handleResetProgress = async () => {
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Set status bar text to light for the dark theme */}
      <StatusBar barStyle="light-content" />
      
      {/* Main title section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{content[language].title}</Text>
        <Text style={styles.subtitle}>{content[language].subtitle}</Text>
      </View>

      {/* Language selection section */}
      <View style={styles.languageSelector}>
        <Text style={styles.prompt}>{content[language].selectPrompt}</Text>
        <View style={styles.flagsContainer}>
          <TouchableOpacity onPress={() => setLanguage('en')}>
            <Image 
              source={require('../../assets/flag_uk.png')}
              style={[styles.flag, language === 'en' && styles.selectedFlag]} 
              onError={(e) => console.log('Error loading UK flag:', e.nativeEvent.error)}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage('pt')}>
            <Image 
              source={require('../../assets/flag_brazil.png')}
              style={[styles.flag, language === 'pt' && styles.selectedFlag]} 
              onError={(e) => console.log('Error loading Brazil flag:', e.nativeEvent.error)}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Container for the main action buttons */}
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
