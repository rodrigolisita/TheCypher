import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import the puzzle components
import AsymmetricPuzzle from '../../components/puzzles/AsymmetricPuzzle';
import AtbashPuzzle from '../../components/puzzles/AtbashPuzzle';
import CaesarPuzzle from '../../components/puzzles/CaesarPuzzle';
import SymmetricPuzzle from '../../components/puzzles/SymmetricPuzzle';
import VigenerePuzzle from '../../components/puzzles/VigenerePuzzle';


// Import the mission data from our central file
import { missions, puzzleData } from '../../data/missionData';


export default function DecryptionRoomScreen() {
  console.log('VigenerePuzzle type:', typeof VigenerePuzzle);
  console.log('AsymmetricPuzzle type:', typeof AsymmetricPuzzle);

  const router = useRouter();
  const { missionId, language } = useLocalSearchParams();
  const [isCodexVisible, setIsCodexVisible] = useState(false);

  // Find the selected mission and its corresponding puzzle.
  const selectedMission = missions.find(m => m.id === missionId);
  const currentPuzzle = puzzleData[missionId];

  // Automatically show the codex modal when the screen loads.
  useEffect(() => {
    setIsCodexVisible(true);
  }, []);
  
  const handleSolve = async () => {
      // This function is passed to the puzzle components.
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

      router.push({
        pathname: '/missionSuccess',
        params: {
          decryptedMessage: currentPuzzle.plaintext[language],
          language: language
        }
      });
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

  // This function decides which puzzle component to render.
  const renderPuzzle = () => {
    if (!currentPuzzle) return null;

    switch (selectedMission.cipher) {
        case 'Caesar':
            return <CaesarPuzzle puzzle={currentPuzzle} language={language} onSolve={handleSolve} />;
        case 'Atbash':
            return <AtbashPuzzle puzzle={currentPuzzle} language={language} onSolve={handleSolve} />;
        case 'Vigenère':
            return <VigenerePuzzle puzzle={currentPuzzle} language={language} onSolve={handleSolve} />;
        case 'Asymmetric':
            return <AsymmetricPuzzle puzzle={currentPuzzle} language={language} onSolve={handleSolve} />;
        case 'Symmetric':
            return <SymmetricPuzzle puzzle={currentPuzzle} language={language} onSolve={handleSolve} />;
        default:
            return <Text style={styles.errorText}>Unknown Cipher</Text>;
    }
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

        {/* Render the correct puzzle component */}
        {renderPuzzle()}

        <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.codexButton} onPress={() => setIsCodexVisible(true)}>
                <Text style={styles.codexButtonText}>{language === 'pt' ? 'Consultar Códice' : 'Consult Codex'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Text style={styles.backButtonText}>
                {language === 'pt' ? 'Retornar' : 'Return'}
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
  errorText: {
    color: '#ff4444',
    fontSize: 24,
    fontFamily: 'monospace',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 10,
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
  codexButton: {
    borderColor: '#00ff7f',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codexButtonText: {
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
