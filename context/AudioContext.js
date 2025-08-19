import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { createContext, useEffect, useState } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [keypressSound, setKeypressSound] = useState();
  const [successSound, setSuccessSound] = useState();
  const [ambianceSound, setAmbianceSound] = useState();

  useEffect(() => {
    // This effect runs only once when the app starts
    const loadSounds = async () => {
      console.log('Loading sounds globally...');
      try {
        const { sound: keypress } = await Audio.Sound.createAsync(require('../assets/sounds/keypress.mp3'));
        setKeypressSound(keypress);

        const { sound: success } = await Audio.Sound.createAsync(require('../assets/sounds/success.mp3'));
        setSuccessSound(success);
        
        const { sound: ambiance } = await Audio.Sound.createAsync(require('../assets/sounds/hub_ambiance.mp3'));
        await ambiance.setIsLoopingAsync(true);
        setAmbianceSound(ambiance);
      } catch (e) {
        console.error("Failed to load sounds globally", e);
      }
    };
    
    loadSounds();

    // Cleanup function to unload sounds when the app closes
    return () => {
      console.log('Unloading all sounds...');
      keypressSound?.unloadAsync();
      successSound?.unloadAsync();
      ambianceSound?.unloadAsync();
    };
  }, []);

  const playKeypressSound = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await keypressSound?.replayAsync();
    } catch (e) { console.error("Failed to play keypress sound", e) }
  };

  const playSuccessSound = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await successSound?.replayAsync();
    } catch (e) { console.error("Failed to play success sound", e) }
  };

  const playAmbianceSound = async () => {
    try {
      await ambianceSound?.replayAsync();
    } catch (e) { console.error("Failed to play ambiance sound", e) }
  };

  const stopAmbianceSound = async () => {
    try {
      await ambianceSound?.stopAsync();
    } catch (e) { console.error("Failed to stop ambiance sound", e) }
  };

  const value = { playKeypressSound, playSuccessSound, playAmbianceSound, stopAmbianceSound };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};