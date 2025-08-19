import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudio } from '../../hooks/useAudio';

export default function CaesarPuzzle({ puzzle, language, onSolve }) {
  const [userInputKey, setUserInputKey] = useState('');
  const [randomKey] = useState(() => Math.floor(Math.random() * 25) + 1);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const { playKeypressSound, playSuccessSound } = useAudio();


  const ciphertext = useMemo(() => {
    return caesarCipherEncrypt(puzzle.plaintext.en, randomKey);
  }, [puzzle, randomKey]);

  const calculatedDecryptedMessage = useMemo(() => {
    const key = parseInt(userInputKey, 10);
    //if (isNaN(key)) return ciphertext;
    if (isNaN(key) || userInputKey === '') return ciphertext;
    
    const decryptedEnglish = caesarCipherDecrypt(ciphertext, key);
    if (language === 'pt' && decryptedEnglish === puzzle.plaintext.en) {
        return puzzle.plaintext.pt;
    }
    return decryptedEnglish;
  }, [userInputKey, ciphertext, language, puzzle]);

  // This useEffect creates the "typing" animation
  useEffect(() => {
    // This is the timer that waits for the user to stop typing
    const debounceTimer = setTimeout(() => {
      // All of our previous animation logic now goes inside this timer

      if (userInputKey === '') {
          setDisplayedMessage(ciphertext);
          return;
      }

      const animateText = (index) => {
        if (index > calculatedDecryptedMessage.length) {
          return;
        }
        setDisplayedMessage(calculatedDecryptedMessage.substring(0, index));
        const timeoutId = setTimeout(() => animateText(index + 1), 30);
        return () => clearTimeout(timeoutId);
      };

      const cleanupAnimation = animateText(1);
      // We don't need to return the cleanup function here anymore,
      // as the outer cleanup handles it.

    }, 500); // Wait 500ms (half a second) after the last keypress

    // This is the crucial part of the debounce:
    // If the user types another key, the effect re-runs,
    // and this cleanup function clears the previous timer, canceling the old animation.
    return () => clearTimeout(debounceTimer);
    
  }, [calculatedDecryptedMessage, userInputKey, ciphertext]);
  
  const handleKeyPress = (key) => {
    playKeypressSound();
    if (key === '⌫') {
      setUserInputKey(current => current.slice(0, -1));
    } else if (userInputKey.length < 2) {
      setUserInputKey(current => current + key);
    }
  };
  
  const checkSolution = () => {
    if (parseInt(userInputKey, 10) === randomKey) {
      playSuccessSound();
      onSolve();
    } else {
      alert('Incorrect. Try a different key.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.puzzleContainer}>
        <Text style={styles.label}>{language === 'pt' ? 'Mensagem Criptografada:' : 'Encrypted Message:'}</Text>
        <View style={styles.messageGrid}>
            <Text style={styles.messageText}>{ciphertext}</Text>
        </View>
        
        <Text style={styles.label}>{language === 'pt' ? 'Sua Decodificação:' : 'Your Decryption:'}</Text>
        <View style={styles.messageGrid}>
            <Text style={styles.messageText}>{displayedMessage}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
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

        <TouchableOpacity style={styles.decryptButton} onPress={checkSolution}>
            <Text style={styles.decryptButtonText}>{language === 'pt' ? 'Decodificar' : 'Decrypt'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// --- CIPHER LOGIC FUNCTIONS ---
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


const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  puzzleContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingTop: 20,
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