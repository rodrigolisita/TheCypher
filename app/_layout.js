import { Stack } from 'expo-router';
import { AudioProvider } from '../context/AudioContext';

export default function RootLayout() {
  return (
    // The AudioProvider now wraps your entire app,
    // making the sound functions available everywhere.
    <AudioProvider>
      <Stack>
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
      </Stack>
    </AudioProvider>
  );
}