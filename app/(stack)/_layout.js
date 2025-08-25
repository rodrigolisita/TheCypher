/**
 * @file app/(stack)/_layout.js
 * @brief Defines the Stack Navigator for the main application screens, with headers hidden by default.
 * @author Rodrigo Lisita Ribera
 * @date August 2025
 */
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}