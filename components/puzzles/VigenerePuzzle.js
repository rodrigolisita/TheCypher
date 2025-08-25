/**
 * @file components/puzzles/VigenerePuzzle.js
 * @brief The puzzle component for the Vigenère cipher, featuring a QWERTY keyboard for keyword input.
 * @author Rodrigo Lisita Ribera
 * @date August 2025
 */
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudio } from '../../hooks/useAudio';


const QWERTY_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

// This component contains all the UI and logic for the Vigenere puzzle.
export default function VigenerePuzzle({ puzzle, language, onSolve }) {
  
  // hook for audio and haptic feedback
  const { playKeypressSound, playSuccessSound, playFailSound } = useAudio(); 
  
  // track the full user input, including the pre-filled letters.
  const [userInputKeyword, setUserInputKeyword] = useState(puzzle.hintedKey);

  // The ciphertext is pre-calculated based on the correct keyword.
  const ciphertext = useMemo(() => {
    return vigenereCipherEncrypt(puzzle.plaintext.en, puzzle.key);
  }, [puzzle]);

  // Decrypt the message in real-time as the user types the keyword.
  const calculatedDecryptedMessage = useMemo(() => {
    // Only try to decrypt if the user has filled in all the blanks.
    if (userInputKeyword.includes('_')) return ciphertext;
    
    const decryptedEnglish = vigenereCipherDecrypt(ciphertext, userInputKeyword);
    if (language === 'pt' && decryptedEnglish === puzzle.plaintext.en) {
        return puzzle.plaintext.pt;
    }
    return decryptedEnglish;
  }, [userInputKeyword, ciphertext, language, puzzle]);

  const handleKeyPress = async (key) => {
    await playKeypressSound(); // Play sound and haptic on key press
    if (key === '⌫') {
      // Find the last letter the user typed and replace it with a '_'
      let lastTypedIndex = -1;
      for (let i = userInputKeyword.length - 1; i >= 0; i--) {
          if (puzzle.hintedKey[i] === '_' && userInputKeyword[i] !== '_') {
              lastTypedIndex = i;
              break;
          }
      }
      if (lastTypedIndex !== -1) {
          setUserInputKeyword(current => {
              const newKey = current.split('');
              newKey[lastTypedIndex] = '_';
              return newKey.join('');
          });
      }
    } else {
      // Find the next available blank space '_' and fill it.
      const nextBlankIndex = userInputKeyword.indexOf('_');
      if (nextBlankIndex !== -1) {
        setUserInputKeyword(current => {
            const newKey = current.split('');
            newKey[nextBlankIndex] = key;
            return newKey.join('');
        });
      }
    }
  };
  
  const checkSolution = async () => {
    if (userInputKeyword.toUpperCase() === puzzle.key.toUpperCase()) {
      await playSuccessSound();
      onSolve(); // Call the onSolve prop passed from the parent
    } else {
      await playFailSound();
      alert('Incorrect keyword. Try again.');
    }
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
        <View style={styles.keyDisplay}>
            <Text style={styles.keyDisplayText}>{language === 'pt' ? 'Palavra-chave:' : 'Keyword:'} {userInputKeyword}</Text>
        </View>
        
        {/* QWERTY Keyboard */}
        <View style={styles.keyboard}>
          {QWERTY_LAYOUT.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map(key => (
                <TouchableOpacity key={key} style={styles.key} onPress={() => handleKeyPress(key)}>
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.decryptButton} onPress={checkSolution}>
            <Text style={styles.decryptButtonText}>{language === 'pt' ? 'Decodificar' : 'Decrypt'}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// --- CIPHER LOGIC ---
function vigenereCipher(text, key, isEncrypt = true) {
  let result = '';
  const textLength = text.length;
  const keyLength = key.length;
  
  for (let i = 0; i < textLength; i++) {
    const char = text[i];
    if (char.match(/[A-Z]/)) {
      const keyChar = key[i % keyLength].toUpperCase();
      const keyShift = keyChar.charCodeAt(0) - 65;
      const textCode = char.charCodeAt(0) - 65;
      
      let resultCode;
      if (isEncrypt) {
        resultCode = (textCode + keyShift) % 26;
      } else {
        resultCode = (textCode - keyShift + 26) % 26;
      }
      result += String.fromCharCode(resultCode + 65);
    } else {
      result += char; // Non-alphabetic characters remain unchanged
    }
  }
  return result;
}

const vigenereCipherEncrypt = (plaintext, key) => vigenereCipher(plaintext, key, true);
const vigenereCipherDecrypt = (ciphertext, key) => vigenereCipher(ciphertext, key, false);


// Styles are specific to this puzzle component
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
  keyDisplay: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
    width: '80%',
    marginBottom: 10,
    minHeight: 40,
  },
  keyDisplayText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 20,
    textAlign: 'center',
  },
  keyboard: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  key: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 10,
    margin: 2,
    minWidth: 30,
    alignItems: 'center',
  },
  keyText: {
    color: '#fff',
    fontSize: 16,
  },
  decryptButton: {
    backgroundColor: '#00ff7f',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  decryptButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});