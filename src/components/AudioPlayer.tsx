import React, { useEffect, useState } from 'react';
import { usePCMPlayer } from '@/hooks/usePCMPlayer';

interface AudioPlayerProps {
  audioBase64?: string;
  sampleRate?: number;
  autoPlay?: boolean;
  onComplete?: () => void;
  className?: string;
}

/**
 * A reusable audio player component for PCM16 encoded audio
 */
export function AudioPlayer({
  audioBase64,
  sampleRate = 24000,
  autoPlay = false,
  onComplete,
  className = ''
}: AudioPlayerProps) {
  // Use the PCM player hook
  const {
    isReady,
    isPlaying,
    error,
    playFromBase64,
    stop,
    setVolume,
    volume
  } = usePCMPlayer();

  // Track if we should auto-play on load
  const [shouldAutoPlay, setShouldAutoPlay] = useState(autoPlay);

  // Auto-play when ready and audio is available
  useEffect(() => {
    if (isReady && audioBase64 && shouldAutoPlay) {
      playFromBase64(audioBase64, sampleRate);
      setShouldAutoPlay(false); // Reset so it doesn't keep playing on audio changes
    }
  }, [isReady, audioBase64, shouldAutoPlay, playFromBase64, sampleRate]);

  // Handle completion callback
  useEffect(() => {
    if (!isPlaying && onComplete) {
      onComplete();
    }
  }, [isPlaying, onComplete]);

  // Handle play/pause
  const handlePlayPause = async () => {
    if (!audioBase64 || !isReady) return;
    
    if (isPlaying) {
      await stop();
    } else {
      await playFromBase64(audioBase64, sampleRate);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handlePlayPause}
        disabled={!isReady || !audioBase64}
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          !isReady || !audioBase64 ? 'opacity-50 cursor-not-allowed' : ''
        } ${error ? 'bg-red-100' : 'bg-blue-100'}`}
        title={error ? error.message : undefined}
      >
        {isPlaying ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-blue-700"
          >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-blue-700"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>
      
      <div className="flex items-center w-24">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-gray-500"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        </svg>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="mx-1 w-full"
        />
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-gray-500"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      </div>
      
      {/* Status indicator */}
      <div className="text-xs text-gray-500">
        {!isReady ? 'Initializing...' : 
         error ? 'Error' : 
         isPlaying ? 'Playing' : 'Ready'}
      </div>
    </div>
  );
} 