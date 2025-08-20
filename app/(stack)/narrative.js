import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudio } from '../../hooks/useAudio';

const narrativeContent = {
  en: {
    title: "MISSION BRIEFING",
    body: "You are Agent Bob, a new recruit in spy training. Your handler, the veteran Agent Alice, will be sending you a series of encrypted messages.\n\nEach message is a mission. Your task is to decrypt them and follow the instructions.\n\nGood luck, Agent.",
    button: "Proceed to Mission Hub"
  },
  pt: {
    title: "BRIEFING DA MISSÃO",
    body: "Você é o Agente Bob, um novo recruta em treinamento de espionagem. Sua mentora, a veterana Agente Alice, enviará uma série de mensagens criptografadas.\n\nCada mensagem é uma missão. Sua tarefa é decifrá-las e seguir as instruções.\n\nBoa sorte, Agente.",
    button: "Prosseguir para a Central"
  }
};

export default function NarrativeScreen() {
  const router = useRouter();
  const { language } = useLocalSearchParams();
  const { playKeypressSound } = useAudio();

  const handleContinue = async () => {
    await playKeypressSound();

    // Navigate to the mission hub, passing the language along
    router.push({
      pathname: '/missionHub',
      params: { language }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{narrativeContent[language].title}</Text>
        <Text style={styles.body}>{narrativeContent[language].body}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>{narrativeContent[language].button}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#00ff7f',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  body: {
    fontSize: 18,
    color: '#a0a0a0',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 28,
  },
  button: {
    backgroundColor: '#00ff7f',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});