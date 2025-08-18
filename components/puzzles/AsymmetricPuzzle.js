import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';

// This component contains the UI and logic for our asymmetric key puzzle metaphor.
export default function AsymmetricPuzzle({ puzzle, language, onSolve }) {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;

  // This function calculates the "encrypted" color by mixing the public key and the message.
  const getEncryptedColor = (color1, color2) => {
    if (
      (color1 === 'BLUE' && color2 === 'YELLOW') ||
      (color1 === 'YELLOW' && color2 === 'BLUE')
    )
      return '#2E8B57'; // Green
    return '#555'; // Default dark grey
  };

  const encryptedColor = getEncryptedColor(puzzle.publicKey, puzzle.message).toLowerCase();
  const decryptedColor = puzzle.message.toLowerCase();

  const animatedColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [encryptedColor, decryptedColor],
  });

  const animatedBorder = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff', '#00ff7f'], // white to neon green
  });

  const animatedShadow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,255,127,0.6)'], // no shadow to green glow
  });

  const checkSolution = () => {
    if (selectedFilter === puzzle.privateKey) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        onSolve();
      });
    } else {
      Alert.alert(
        language === 'pt' ? 'Filtro Incorreto' : 'Incorrect Filter',
        language === 'pt' ? 'A mensagem ainda está criptografada.' : 'The message is still encrypted.'
      );
    }
  };

  return (
    <>
      <View style={styles.puzzleContainer}>
        <Text style={styles.label}>
          {language === 'pt' ? 'Cor Criptografada:' : 'Encrypted Color:'}
        </Text>
        <Animated.View
          style={[
            styles.colorBox,
            {
              backgroundColor: animatedColor,
              borderColor: animatedBorder,
              shadowColor: animatedShadow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 10,
            },
          ]}
        />

        <Text style={styles.label}>
          {language === 'pt' ? 'Selecione o Filtro (Chave Privada):' : 'Select Filter (Private Key):'}
        </Text>
        <View style={styles.filterContainer}>
          {puzzle.filterOptions.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.filterOption,
                { backgroundColor: color.toLowerCase() },
                selectedFilter === color && styles.selectedFilter,
              ]}
              onPress={() => setSelectedFilter(color)}
            />
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.decryptButton} onPress={checkSolution}>
          <Text style={styles.decryptButtonText}>
            {language === 'pt' ? 'Aplicar Filtro' : 'Apply Filter'}
          </Text>
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
