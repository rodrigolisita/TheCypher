/**
 * @file components/puzzles/AtbashPuzzle.js
 * @brief The puzzle component for the Atbash cipher, which is solved automatically and requires user confirmation.
 * @author Rodrigo Lisita Ribera
 * @date August 2025
 */
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudio } from '../../hooks/useAudio';

// This component contains all the UI and logic for the Atbash puzzle.
export default function AtbashPuzzle({ puzzle, language, onSolve }) {

  // hook for audio and haptic feedback
  const { playSuccessSound } = useAudio(); 

  // Generate the ciphertext.
  const ciphertext = useMemo(() => {
    return atbashCipher(puzzle.plaintext.en);
  }, [puzzle]);

  // The decrypted message is calculated directly.
  const calculatedDecryptedMessage = useMemo(() => {
    const decryptedEnglish = atbashCipher(ciphertext);
    if (language === 'pt' && decryptedEnglish === puzzle.plaintext.en) {
        return puzzle.plaintext.pt;
    }
    return decryptedEnglish;
  }, [ciphertext, language, puzzle]);

  // Handler to play the sound before solving
  const handleConfirm = () => {
    playSuccessSound();
    onSolve(); // This navigates to the next step
  };

  return (
    <>
      <View style={styles.puzzleContainer}>
        <Text style={styles.label}>{language === 'pt' ? 'Mensagem Criptografada:' : 'Encrypted Message:'}</Text>
        <View style={styles.messageGrid}>
            <Text style={styles.messageText}>{ciphertext}</Text>
        </View>
        
        <Text style={styles.label}>{language === 'pt' ? 'Sua Decodificação:' : 'Your Decryption:'}</Text>
        <View style={styles.messageGrid}>
            <Text style={styles.messageText}>{calculatedDecryptedMessage}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.decryptButton} onPress={handleConfirm}>
            <Text style={styles.decryptButtonText}>{language === 'pt' ? 'Confirmar' : 'Confirm'}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// --- CIPHER LOGIC ---
function atbashCipher(text) {
    return text.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            let code = char.charCodeAt(0);
            let reversedCode = 90 - (code - 65); // 90 is 'Z'
            return String.fromCharCode(reversedCode);
        }
        return char;
    }).join('');
}

// Styles specific to this puzzle component
const styles = StyleSheet.create({
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
  inputContainer: {
    width: '100%',
    alignItems: 'center',
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
});