import React, { useState, useMemo, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mission and puzzle data can be kept in a separate file later on.
const missions = [
  { id: '1', title: { en: 'Operation Nightingale', pt: 'Projeto Rouxinol' }, difficulty: 'Easy', cipher: 'Caesar' },
  { id: '2', title: { en: 'The Serpent\'s Kiss', pt: 'O Beijo da Serpente' }, difficulty: 'Easy', cipher: 'Atbash' },
  { id: '3', title: { en: 'Viper\'s Nest', pt: 'Covil da Víbora' }, difficulty: 'Medium', cipher: 'Vigenère' },
];

const puzzleData = {
  '1': {
    plaintext: {
        en: 'MEET AT THE OLD BRIDGE AT MIDNIGHT',
        pt: 'ENCONTRE NA PONTE VELHA A MEIA NOITE'
    },
    // Key and ciphertext are now generated dynamically.
    hint: {
      en: 'Agent, this is a simple Caesar cipher. Find the correct numerical shift (1-25) to reveal the message.',
      pt: 'Agente, esta é uma cifra de César simples. Encontre o deslocamento numérico correto (1-25) para revelar a mensagem.'
    },
    codex: {
        title: 'Caesar Cipher',
        text: {
            en: 'The Caesar cipher is one of the simplest forms of encryption.\n\n1. It is a substitution cipher where each letter in the plaintext is \'shifted\' a certain number of places down the alphabet.\n\n2. For example, with a shift of 3, \'A\' would be replaced by \'D\', \'B\' would become \'E\', and so on.\n\n3. Your task is to find the secret number used for the shift (the key).',
            pt: 'A cifra de César é uma das formas mais simples de criptografia.\n\n1. É uma cifra de substituição onde cada letra no texto original é \'deslocada\' um certo número de posições no alfabeto.\n\n2. Por exemplo, com um deslocamento de 3, \'A\' seria substituído por \'D\', \'B\' se tornaria \'E\', e assim por diante.\n\n3. Sua tarefa é encontrar o número secreto usado for o deslocamento (a chave).'
        }
    }
  }
};

// The Caesar cipher decryption logic.
function caesarCipherDecrypt(ciphertext, shift) {
  return ciphertext.split('').map(char => {
    if (char.match(/[A-Z]/)) {
      let code = char.charCodeAt(0);
      let shiftedCode = ((code - 65 - shift + 26) % 26) + 65;
      return String.fromCharCode(shiftedCode);
    }
    return char;
  }).join('');
}

// The Caesar cipher encryption logic.
function caesarCipherEncrypt(plaintext, shift) {
    return plaintext.split('').map(char => {
      if (char.match(/[A-Z]/)) {
        let code = char.charCodeAt(0);
        let shiftedCode = ((code - 65 + shift) % 26) + 65;
        return String.fromCharCode(shiftedCode);
      }
      return char;
    }).join('');
}


export default function DecryptionRoomScreen() {
  const router = useRouter();
  const { missionId, language } = useLocalSearchParams();

  const [userInputKey, setUserInputKey] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [isCodexVisible, setIsCodexVisible] = useState(false);

  // Find the selected mission and its corresponding puzzle.
  const selectedMission = missions.find(m => m.id === missionId);
  const currentPuzzle = puzzleData[missionId];
  
  // Generate a random key for the puzzle once, when the component loads.
  const [randomKey] = useState(() => Math.floor(Math.random() * 25) + 1);

  // Generate the ciphertext based on the English plaintext and the random key.
  const ciphertext = useMemo(() => {
    if (!currentPuzzle) return '';
    // The cipher always works on the English alphabet for consistency.
    return caesarCipherEncrypt(currentPuzzle.plaintext.en, randomKey);
  }, [currentPuzzle, randomKey]);

  // Automatically show the codex modal when the screen loads.
  useEffect(() => {
    setIsCodexVisible(true);
  }, []);

  // Memoize the decrypted message to avoid re-calculating on every render.
  const calculatedDecryptedMessage = useMemo(() => {
    const key = parseInt(userInputKey, 10);
    if (isNaN(key)) {
      return ciphertext;
    }
    const decryptedEnglish = caesarCipherDecrypt(ciphertext, key);
    // If the language is Portuguese, translate the result.
    if (language === 'pt' && decryptedEnglish === currentPuzzle.plaintext.en) {
        return currentPuzzle.plaintext.pt;
    }
    return decryptedEnglish;
  }, [userInputKey, ciphertext, language, currentPuzzle]);

  const handleKeyPress = (key) => {
    if (key === '⌫') { // Handle backspace
      setUserInputKey(current => current.slice(0, -1));
    } else if (userInputKey.length < 2) { // Limit key to 2 digits
      setUserInputKey(current => current + key);
    }
  };
  
  const checkSolution = async () => {
    if (parseInt(userInputKey, 10) === randomKey) {
      setIsSolved(true);
      
      // Save progress to AsyncStorage
      try {
        const completed = await AsyncStorage.getItem('completedMissions');
        const completedList = completed ? JSON.parse(completed) : [];
        if (!completedList.includes(missionId)) {
          completedList.push(missionId);
          await AsyncStorage.setItem('completedMissions', JSON.stringify(completedList));
        }
      } catch (e) {
        console.error("Failed to save progress.", e);
      }

      // Navigate to the success screen
      router.push({
        pathname: '/missionSuccess',
        params: {
          decryptedMessage: currentPuzzle.plaintext[language],
          language: language
        }
      });

    } else {
      alert('Incorrect. Try a different key.');
    }
  };

  const handleGoBack = () => {
    Alert.alert(
        language === 'pt' ? 'Retornar ao Hub' : 'Return to Hub',
        language === 'pt' ? 'Tem certeza que deseja abandonar a missão?' : 'Are you sure you want to abort the mission?',
        [
            { text: language === 'pt' ? 'Cancelar' : 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => router.back() }
        ]
    );
  };

  if (!selectedMission || !currentPuzzle) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Mission Data Not Found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Return to Hub</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Codex Modal for explaining the cipher */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCodexVisible}
        onRequestClose={() => setIsCodexVisible(false)}
      >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{currentPuzzle.codex.title}</Text>
                <Text style={styles.modalText}>{currentPuzzle.codex.text[language]}</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsCodexVisible(false)}>
                    <Text style={styles.modalCloseButtonText}>{language === 'pt' ? 'Fechar' : 'Close'}</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

        <View style={styles.header}>
          <Text style={styles.missionTitle}>{selectedMission.title[language]}</Text>
          <Text style={styles.missionInfo}>Cipher: {selectedMission.cipher}</Text>
        </View>

        <View style={styles.briefingBox}>
            <Text style={styles.briefingText}>{currentPuzzle.hint[language]}</Text>
        </View>

        <View style={styles.puzzleContainer}>
          <Text style={styles.label}>{language === 'pt' ? 'Mensagem Criptografada:' : 'Encrypted Message:'}</Text>
          <View style={styles.messageGrid}>
              <Text style={styles.messageText}>{ciphertext}</Text>
          </View>
          
          <Text style={styles.label}>{language === 'pt' ? 'Sua Decodificação:' : 'Your Decryption:'}</Text>
          <View style={[styles.messageGrid, isSolved && styles.solvedGrid]}>
              <Text style={[styles.messageText, isSolved && styles.solvedText]}>{calculatedDecryptedMessage}</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.codexButton} onPress={() => setIsCodexVisible(true)}>
              <Text style={styles.codexButtonText}>{language === 'pt' ? 'Consultar Códice' : 'Consult Codex'}</Text>
          </TouchableOpacity>

          <View style={styles.keyDisplay}>
              <Text style={styles.keyDisplayText}>{language === 'pt' ? 'Chave:' : 'Key:'} {userInputKey}</Text>
          </View>
          
          <View style={styles.keypad}>
              {[...Array(9).keys()].map(i => (
                  <TouchableOpacity key={i+1} style={styles.key} onPress={() => handleKeyPress((i+1).toString())}>
                      <Text style={styles.keyText}>{i+1}</Text>
                  </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('0')}>
                  <Text style={styles.keyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('⌫')}>
                  <Text style={styles.keyText}>⌫</Text>
              </TouchableOpacity>
          </View>

          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Text style={styles.backButtonText}>
                {language === 'pt' ? 'Retornar' : 'Return'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.decryptButton} onPress={checkSolution}>
                <Text style={styles.decryptButtonText}>{language === 'pt' ? 'Decodificar' : 'Decrypt'}</Text>
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 10,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  missionTitle: {
    fontSize: 24,
    color: '#00ff7f',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  missionInfo: {
    fontSize: 14,
    color: '#a0a0a0',
    fontFamily: 'monospace',
    marginTop: 5,
  },
  briefingBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  briefingText: {
    color: '#ddd',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  puzzleContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  label: {
    color: '#a0a0a0',
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 5,
  },
  messageGrid: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 80,
    justifyContent: 'center',
  },
  messageText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2,
  },
  solvedGrid: {
    backgroundColor: '#00ff7f20',
    borderColor: '#00ff7f',
    borderWidth: 1,
  },
  solvedText: {
    color: '#00ff7f',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  codexButton: {
    borderColor: '#00ff7f', // Green border
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  codexButtonText: {
    color: '#00ff7f', // Green text
    fontFamily: 'monospace',
    fontSize: 14,
  },
  keyDisplay: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
    width: '50%',
    marginBottom: 10,
  },
  keyDisplayText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 20,
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 240,
  },
  key: {
    width: 60,
    height: 60,
    margin: 5,
    backgroundColor: '#333',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    color: '#fff',
    fontSize: 24,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  decryptButton: {
    backgroundColor: '#00ff7f',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decryptButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 24,
    fontFamily: 'monospace',
  },
  backButton: {
    borderColor: '#00ff7f',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#00ff7f',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    borderWidth: 1,
    borderColor: '#00ff7f',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00ff7f',
    fontFamily: 'monospace',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#ddd',
    fontFamily: 'monospace',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#00ff7f',
    fontSize: 16,
    fontFamily: 'monospace',
  }
});
