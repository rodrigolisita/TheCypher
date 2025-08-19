import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GameCompleteScreen() {
  const router = useRouter();
  const { language } = useLocalSearchParams();

  const handlePlayAgain = async () => {
    try {
      // Clear the saved progress from AsyncStorage
      await AsyncStorage.removeItem('completedMissions');
      console.log('Progress has been reset.');
    } catch (e) {
      console.error('Failed to reset progress.', e);
    }
    // Navigate back to the very first screen
    router.navigate('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {language === 'pt' ? 'MISSÃO CUMPRIDA' : 'MISSION COMPLETE'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'pt' 
            ? 'Parabéns, Agente. Você decodificou todas as mensagens. A agência está orgulhosa. Até a próxima missão.' 
            : 'Congratulations, Agent. You have decoded all messages. The agency is proud. Until the next mission.'}
        </Text>
        <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
          <Text style={styles.playAgainButtonText}>
            {language === 'pt' ? 'Jogar Novamente' : 'Play Again'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    color: '#00ff7f',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#a0a0a0',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  playAgainButton: {
    backgroundColor: '#00ff7f',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  playAgainButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});