/**
 * @file context/AudioContext.js
 * @brief Creates and provides the global context for managing all audio and haptic feedback throughout the app.
 * @author Rodrigo Lisita Ribera
 * @date August 2025
 */
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React, { createContext, useEffect, useState } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [keypressSound, setKeypressSound] = useState();
  const [successSound, setSuccessSound] = useState();
  const [failSound, setFailSound] = useState();
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

        const { sound: fail } = await Audio.Sound.createAsync(require('../assets/sounds/fail.mp3'));
        setFailSound(fail);
        
        const { sound: ambiance } = await Audio.Sound.createAsync(require('../assets/sounds/ambiance.mp3'));
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
      failSound?.unloadAsync();
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

  const playFailSound = async () => {
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await failSound?.replayAsync();
  } catch (e) { console.error("Failed to play fail sound", e) }
};

  const playAmbianceSound = async () => {
    if (!ambianceSound) return;
    try {
      const status = await ambianceSound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await ambianceSound.playAsync();
      }
    } catch (e) { console.error("Failed to play ambiance sound", e) }
  };

  const stopAmbianceSound = async () => {
    if (!ambianceSound) return;
    try {
      // Check the status before stopping
      const status = await ambianceSound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await ambianceSound.stopAsync();
      }
    } catch (e) { console.error("Failed to stop ambiance sound", e) }
  };

  const value = { playKeypressSound, playSuccessSound, playFailSound, playAmbianceSound, stopAmbianceSound };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};