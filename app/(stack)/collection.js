import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { allItems, missions } from '../../data/missionData';

export default function CollectionScreen() {
  const router = useRouter();
  const { language, decryptedMessage, missionId } = useLocalSearchParams();
  const [selectedItems, setSelectedItems] = useState([]);

  // --- Task 4 Logic: Find the current mission's data ---
  const currentMission = useMemo(() => {
    return missions.find(m => m.id === missionId);
  }, [missionId]);

  // --- Task 4 Logic: Check if the selection is correct ---
  const isSelectionCorrect = useMemo(() => {
    if (!currentMission) return false;

    const required = currentMission.requiredItems.sort();
    const selected = [...selectedItems].sort(); // Create a sorted copy

    if (required.length !== selected.length) return false;
    
    return required.every((value, index) => value === selected[index]);
  }, [selectedItems, currentMission]);

  // --- Task 5 Logic: Handle delivering items ---
  const handleDeliverItems = async () => {
    if (!isSelectionCorrect) return; // Failsafe

    try {
      const completed = await AsyncStorage.getItem('completedMissions');
      const completedList = completed ? JSON.parse(completed) : [];
      if (!completedList.includes(missionId)) {
        completedList.push(missionId);
        await AsyncStorage.setItem('completedMissions', JSON.stringify(completedList));
        console.log(`Progress saved! Mission ${missionId} completed.`);
      }
    } catch (e) {
      console.error("Failed to save progress.", e);
    }
    
    // Navigate back to the mission hub
    //router.back();
    //router.navigate('/missionHub');
    router.navigate({
        pathname: '/missionHub',
        params: { language: language } // Add this line
    });
  };

  const handleItemPress = (itemId) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(itemId)
        ? prevSelected.filter(id => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.itemCell, isSelected && styles.itemCellSelected]}
        onPress={() => handleItemPress(item.id)}
      >
        <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
          {item.name[language]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{language === 'pt' ? 'Itens a Coletar' : 'Items to Collect'}</Text>
        <Text style={styles.instructions}>"{decryptedMessage}"</Text>
      </View>

      <FlatList
        data={allItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <TouchableOpacity
        style={[styles.deliverButton, !isSelectionCorrect && styles.deliverButtonDisabled]}
        disabled={!isSelectionCorrect}
        onPress={handleDeliverItems} // --- Connects to our Task 5 logic ---
      >
        <Text style={styles.deliverButtonText}>{language === 'pt' ? 'Entregar Itens' : 'Deliver Items'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#00ff7f',
        fontFamily: 'monospace',
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
        color: '#a0a0a0',
        fontFamily: 'monospace',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    list: {
        width: '100%',
    },
    itemCell: {
        padding: 20,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginVertical: 8,
        borderColor: '#00ff7f',
        borderWidth: 1,
    },
    itemCellSelected: {
        backgroundColor: '#00ff7f',
        borderColor: '#fff',
    },
    itemText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'monospace',
    },
    itemTextSelected: {
        color: '#1a1a1a',
        fontWeight: 'bold',
    },
    deliverButton: {
        backgroundColor: '#00ff7f',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 20,
    },
    deliverButtonDisabled: {
        backgroundColor: '#555',
    },
    deliverButtonText: {
        color: '#1a1a1a',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    }
});