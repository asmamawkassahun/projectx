import { useState, useEffect, useRef, useCallback } from 'react';
import { PCMPlayer } from '@/lib/pcm-player';
import { audioContext } from '@/lib/utils';

/**
 * Custom hook for PCM audio playback
 * Provides a simple interface to play PCM16 audio data in React components
 */
export function usePCMPlayer() {
  // Track the PCM player instance
  const pcmPlayerRef = useRef<PCMPlayer | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [volume, setVolume] = useState(1.0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Initialize the audio context and PCM player
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Get or create audio context
        const ctx = await audioContext({ id: "pcm-player-audio" });
        audioCtxRef.current = ctx;
        
        // Create PCM player
        pcmPlayerRef.current = new PCMPlayer(ctx);
        
        // Set up completion callback
        pcmPlayerRef.current.onComplete = () => {
          setIsPlaying(false);
        };
        
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize PCM player:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing audio'));
        setIsReady(false);
      }
    };

    initializeAudio();

    // Clean up on unmount
    return () => {
      if (pcmPlayerRef.current) {
        pcmPlayerRef.current.dispose();
        pcmPlayerRef.current = null;
      }
    };
  }, []);

  // Set volume whenever it changes
  useEffect(() => {
    if (pcmPlayerRef.current) {
      pcmPlayerRef.current.setVolume(volume);
    }
  }, [volume]);

  // Set playback speed whenever it changes
  useEffect(() => {
    if (pcmPlayerRef.current) {
      pcmPlayerRef.current.setPlaybackSpeed(playbackSpeed);
    }
  }, [playbackSpeed]);

  // Function to play PCM16 audio data
  const play = useCallback(async (pcmData: Uint8Array, sampleRate?: number) => {
    if (!pcmPlayerRef.current || !isReady) {
      setError(new Error('PCM player not ready'));
      return false;
    }

    try {
      // Set sample rate if provided
      if (sampleRate) {
        pcmPlayerRef.current.sampleRate = sampleRate;
      }

      // Play the audio
      await pcmPlayerRef.current.playPCM16(pcmData);
      setIsPlaying(true);
      return true;
    } catch (err) {
      console.error('Error playing audio:', err);
      setError(err instanceof Error ? err : new Error('Unknown error playing audio'));
      setIsPlaying(false);
      return false;
    }
  }, [isReady]);

  // Function to stop audio playback
  const stop = useCallback(async () => {
    if (!pcmPlayerRef.current) return;
    
    try {
      await pcmPlayerRef.current.stop();
      setIsPlaying(false);
    } catch (err) {
      console.error('Error stopping audio:', err);
      setError(err instanceof Error ? err : new Error('Unknown error stopping audio'));
    }
  }, []);

  // Function to decode base64 audio data to PCM
  const decodeBase64ToPCM = useCallback((base64Data: string): Uint8Array | null => {
    try {
      // If it's a data URL, extract just the base64 part
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }
      
      // Replace URL-safe characters if present
      base64Data = base64Data.replace(/-/g, '+').replace(/_/g, '/');
      
      // Add padding if needed
      while (base64Data.length % 4 !== 0) {
        base64Data += '=';
      }
      
      // Decode base64 to array buffer
      const binaryData = atob(base64Data);
      const pcmData = new Uint8Array(binaryData.length);
      
      for (let i = 0; i < binaryData.length; i++) {
        pcmData[i] = binaryData.charCodeAt(i);
      }
      
      return pcmData;
    } catch (err) {
      console.error('Error decoding base64 data:', err);
      setError(err instanceof Error ? err : new Error('Failed to decode base64 data'));
      return null;
    }
  }, []);

  // Function to play audio from base64 data
  const playFromBase64 = useCallback(async (
    base64Data: string, 
    sampleRate?: number,
    speed?: number
  ): Promise<boolean> => {
    // Update playback speed if provided
    if (speed !== undefined && pcmPlayerRef.current) {
      pcmPlayerRef.current.setPlaybackSpeed(speed);
    }
    
    const pcmData = decodeBase64ToPCM(base64Data);
    if (!pcmData) return false;
    
    return play(pcmData, sampleRate);
  }, [play, decodeBase64ToPCM]);

  // Resume audio context (useful for handling autoplay restrictions)
  const resumeAudioContext = useCallback(async (): Promise<boolean> => {
    if (!audioCtxRef.current) return false;
    
    try {
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      return true;
    } catch (err) {
      console.error('Error resuming audio context:', err);
      setError(err instanceof Error ? err : new Error('Failed to resume audio context'));
      return false;
    }
  }, []);

  // Return the hook API
  return {
    isReady,
    isPlaying,
    error,
    volume,
    setVolume,
    playbackSpeed,
    setPlaybackSpeed,
    play,
    stop,
    decodeBase64ToPCM,
    playFromBase64,
    resumeAudioContext,
    // Expose audio context and sample rate for debugging
    audioContext: audioCtxRef.current,
    sampleRate: pcmPlayerRef.current?.sampleRate
  };
} 