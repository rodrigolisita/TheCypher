import { useContext } from 'react';
import { AudioContext } from '../context/AudioContext';

// The hook is now just a simple way to access our global audio context.
export const useAudio = () => {
  return useContext(AudioContext);
};