import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// This component contains the UI and logic for our asymmetric key puzzle metaphor.
export default function AsymmetricPuzzle({ puzzle, language, onSolve }) {
  const [selectedFilter, setSelectedFilter] = useState(null);

  const checkSolution = () => {
    if (selectedFilter === puzzle.privateKey) {
      onSolve(); // Call the onSolve prop passed from the parent
    } else {
      alert('Incorrect filter. The message is still encrypted.');
    }
  };

  // This function calculates the "encrypted" color by mixing the public key and the message.
  const getEncryptedColor = (color1, color2) => {
    if ((color1 === 'BLUE' && color2 === 'YELLOW') || (color1 === 'YELLOW' && color2 === 'BLUE')) return '#2E8B57'; // Green
    // Add more color mixing logic here for other puzzles if needed.
    return '#555'; // Default dark grey
  };

  const encryptedColor = getEncryptedColor(puzzle.publicKey, puzzle.message);

  return (
    <>
      <View style={styles.puzzleContainer}>
        <Text style={styles.label}>{language === 'pt' ? 'Cor Criptografada:' : 'Encrypted Color:'}</Text>
        <View style={[styles.colorBox, { backgroundColor: encryptedColor }]} />
        
        <Text style={styles.label}>{language === 'pt' ? 'Selecione o Filtro (Chave Privada):' : 'Select Filter (Private Key):'}</Text>
        <View style={styles.filterContainer}>
          {puzzle.filterOptions.map(color => (
            <TouchableOpacity 
              key={color} 
              style={[
                styles.filterOption, 
                { backgroundColor: color.toLowerCase() },
                selectedFilter === color && styles.selectedFilter
              ]}
              onPress={() => setSelectedFilter(color)}
            />
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.decryptButton} onPress={checkSolution}>
            <Text style={styles.decryptButtonText}>{language === 'pt' ? 'Aplicar Filtro' : 'Apply Filter'}</Text>
        </TouchableOpacity>
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
  colorBox: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 30,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 10,
    borderWidth: 2,
    borderColor: '#555',
  },
  selectedFilter: {
    borderColor: '#00ff7f',
    transform: [{ scale: 1.1 }],
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
    marginTop: 10,
  },
  decryptButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
