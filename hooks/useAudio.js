/**
 * @file hooks/useAudio.js
 * @brief A custom hook that provides a simple interface for components to access the global AudioContext.
 * @author Rodrigo Lisita Ribera
 * @date August 2025
 */
import { useContext } from 'react';
import { AudioContext } from '../context/AudioContext';

// The hook is a simple way to access our global audio context.
export const useAudio = () => {
  return useContext(AudioContext);
};