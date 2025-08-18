// CaesarPuzzle.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// This component now contains all the UI and logic for the Caesar puzzle.
export default function CaesarPuzzle({ puzzle, language, onSolve }) {
  const [userInputKey, setUserInputKey] = useState('');

  // Generate a random key for the puzzle once.
  const [randomKey] = useState(() => Math.floor(Math.random() * 25) + 1);

  // Generate the ciphertext based on the plaintext and the random key.
  const ciphertext = useMemo(() => {
    return caesarCipherEncrypt(puzzle.plaintext.en, randomKey);
  }, [puzzle, randomKey]);

  // Decrypt the message in real-time as the user types.
  const calculatedDecryptedMessage = useMemo(() => {
    const key = parseInt(userInputKey, 10);
    if (isNaN(key)) return ciphertext;
    
    const decryptedEnglish = caesarCipherDecrypt(ciphertext, key);
    if (language === 'pt' && decryptedEnglish === puzzle.plaintext.en) {
        return puzzle.plaintext.pt;
    }
    return decryptedEnglish;
  }, [userInputKey, ciphertext, language, puzzle]);

  const handleKeyPress = (key) => {
    if (key === '⌫') {
      setUserInputKey(current => current.slice(0, -1));
    } else if (userInputKey.length < 2) {
      setUserInputKey(current => current + key);
    }
  };
  
  const checkSolution = () => {
    if (parseInt(userInputKey, 10) === randomKey) {
      onSolve(); // Call the onSolve prop passed from the parent
    } else {
      alert('Incorrect. Try a different key.');
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
    </>
  );
}

// --- CIPHER LOGIC ---
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

// Styles are now specific to this puzzle component
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
