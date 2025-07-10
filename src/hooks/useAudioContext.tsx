import { useEffect, useState } from 'react';
import { audioContext as getAudioContext } from '@/lib/utils';

export const useAudioContext = () => {
  // State to store the actual AudioContext instance
  const [context, setContext] = useState<AudioContext | null>(null);

  // Initialize the audio context asynchronously
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const ctx = await getAudioContext();
        setContext(ctx);
      } catch (e) {
        console.error('Failed to initialize audio context:', e);
        setContext(null);
      }
    };

    initAudioContext();
  }, []);

  // Add an effect to handle user interaction to enable audio playback
  useEffect(() => {
    // Function to resume audio context on any user interaction
    const handleUserInteraction = async () => {
      if (context && context.state === 'suspended') {
        console.log('User interaction detected, resuming audio context');
        try {
          await context.resume();
          console.log('Audio context resumed successfully');
        } catch (err) {
          console.error('Failed to resume audio context:', err);
        }
      }
    };
    
    // Add event listeners for common user interactions
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [context]);

  // Function to safely resume audio context
  const resumeContext = async (): Promise<boolean> => {
    if (!context) {
      console.error('No audio context available');
      return false;
    }
    
    if (context.state === 'suspended') {
      try {
        await context.resume();
        // Give browser a moment to fully activate audio context
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (context.state !== 'suspended') {
          console.log('Audio context running successfully');
          return true;
        } else {
          console.warn('Audio context still suspended after resume attempt');
          return false;
        }
      } catch (error) {
        console.error('Failed to resume audio context:', error);
        return false;
      }
    }
    
    return true; // Already running
  };

  return {
    audioContext: context,
    resumeContext
  };
}; 