/**
 * @file app/_layout.js
 * @brief The root layout for the entire application. It wraps all screens in the global AudioProvider.
 * @author Rodrigo Lisita Ribera
 * @date August 2025
 */
import { Stack } from 'expo-router';
import { AudioProvider } from '../context/AudioContext';

export default function RootLayout() {
  return (
    // The AudioProvider wraps the entire app,
    // making the sound functions available everywhere.
    <AudioProvider>
      <Stack>
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
      </Stack>
    </AudioProvider>
  );
}