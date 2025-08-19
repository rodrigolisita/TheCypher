import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudio } from '../../hooks/useAudio';


// This component contains the UI and logic for the pattern-matching puzzle.
export default function SymmetricPuzzle({ puzzle, language, onSolve }) {
  const [userPattern, setUserPattern] = useState([]);

  // hook for audio and haptic feedback
  const { playKeypressSound, playSuccessSound } = useAudio(); 

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

  const handleGridPress = (index) => {
    playKeypressSound(); // Play sound and haptic on key press

    // Check if the square is already in the pattern.
    if (userPattern.includes(index)) {
      // If it is, remove it (deselect).
      setUserPattern(current => current.filter(item => item !== index));
    } else {
      // If it's not, add it, but only if the pattern isn't full yet.
      if (userPattern.length < puzzle.keyLength) {
        setUserPattern(current => [...current, index]);
      }
    }
  };

  const checkSolution = () => {
    // Check if the user's pattern array matches the key array.
    if (JSON.stringify(userPattern) === JSON.stringify(randomKey)) {
      playSuccessSound();
      onSolve();
    } else {
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
