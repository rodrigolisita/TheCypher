/**
 * @file components/puzzles/SymmetricPuzzle.js
 * @brief The metaphorical puzzle for symmetric cryptography, using a pattern-matching grid mechanic.
 * @author Rodrigo Lisita Ribera
 * @date August 2025
 */
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudio } from '../../hooks/useAudio';

// This component contains the UI and logic for the pattern-matching puzzle.
export default function SymmetricPuzzle({ puzzle, language, onSolve }) {
  const [userPattern, setUserPattern] = useState([]);

  // hook for audio and haptic feedback
  const { playKeypressSound, playSuccessSound, playFailSound } = useAudio(); 

  // Generate a random key pattern once when the component loads.
  const [randomKey] = useState(() => {
    const key = [];
    while (key.length < puzzle.keyLength) {
        const randomIndex = Math.floor(Math.random() * 9);
        if (!key.includes(randomIndex)) {
            key.push(randomIndex);
        }
    }
    return key;
  });

  const handleGridPress = async (index) => {
    await playKeypressSound(); // Play sound and haptic on key press

    if (userPattern.includes(index)) {
      // Case 1: The square is already selected, so deselect it.
      setUserPattern(current => current.filter(item => item !== index));

    } else if (userPattern.length < puzzle.keyLength) {
      // Case 2: The square is new AND there's still space, so select it.
      setUserPattern(current => [...current, index]);

    } else {
      // Case 3: The square is new BUT the pattern is full, so reset the pattern.
      resetPattern();
    }
  }; 
  
  const checkSolution = async () => {
    // Check if the user's pattern array matches the key array.
    if (JSON.stringify(userPattern) === JSON.stringify(randomKey)) {
      await playSuccessSound();
      onSolve();
    } else {
      await playFailSound();
      alert('Incorrect pattern. Try again.');
    }
  };
  
  const resetPattern = () => {
    setUserPattern([]);
  };

  return (
    <>
      <View style={styles.puzzleContainer}>
        <Text style={styles.label}>{language === 'pt' ? 'Recrie o Padrão Chave:' : 'Recreate the Key Pattern:'}</Text>
        <FlatList
          data={Array(9).fill(0)} // Creates a 9-item array for a 3x3 grid
          renderItem={({ item, index }) => {
            const isSelected = userPattern.includes(index);
            const selectionOrder = userPattern.indexOf(index) + 1;
            return (
              <TouchableOpacity 
                style={[styles.gridCell, isSelected && styles.gridCellSelected]}
                onPress={() => handleGridPress(index)}
              >
                {isSelected && <Text style={styles.gridCellText}>{selectionOrder}</Text>}
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          style={styles.grid}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.resetButton} onPress={resetPattern}>
                <Text style={styles.resetButtonText}>{language === 'pt' ? 'Resetar' : 'Reset'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.decryptButton} onPress={checkSolution}>
                <Text style={styles.decryptButtonText}>{language === 'pt' ? 'Confirmar' : 'Confirm'}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

// Styles specific to this puzzle component
const styles = StyleSheet.create({
  puzzleContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#a0a0a0',
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 10,
  },
  grid: {
    width: 240, // 3 cells * (70 width + 10 margin)
  },
  gridCell: {
    width: 70,
    height: 70,
    backgroundColor: '#2a2a2a',
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  gridCellSelected: {
    backgroundColor: '#00ff7f',
    borderColor: '#fff',
  },
  gridCellText: {
      color: '#1a1a1a',
      fontSize: 24,
      fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
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
  resetButton: {
    borderColor: '#ff4444',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#ff4444',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});