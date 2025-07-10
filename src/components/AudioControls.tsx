import React, { useState } from 'react';
import { QueuedAudio } from '@/hooks/usePlaybackQueue';
import { AudioDebugInfo } from './AudioDebugInfo';

interface AudioControlsProps {
  isQueuePlaying: boolean;
  isReady: boolean;
  currentIndex: number;
  queueLength: number;
  currentItem: QueuedAudio | null;
  startQueue: () => void;
  pauseQueue: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  volume: number;
  className?: string;
  compact?: boolean;
  // Add debugging properties
  audioContext?: AudioContext | null;
  sourceSampleRate?: number;
}

/**
 * A component that provides controls for audio playback queue
 */
export function AudioControls({
  isQueuePlaying,
  isReady,
  currentIndex,
  queueLength,
  currentItem,
  startQueue,
  pauseQueue,
  next,
  previous,
  setVolume,
  volume,
  className = '',
  compact = false,
  audioContext,
  sourceSampleRate
}: AudioControlsProps) {
  const [showDebug, setShowDebug] = useState(false);
  
  const handlePlayPause = () => {
    if (isQueuePlaying) {
      pauseQueue();
    } else {
      startQueue();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };
  
  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  // If queue is empty or not ready, disable controls
  const isDisabled = !isReady || queueLength === 0;
  
  // Format the current position/total as text
  const positionText = isDisabled ? 
    'No audio' : 
    `${currentIndex + 1} of ${queueLength}`;

  return (
    <div className={`flex items-center gap-2 ${className} ${compact ? 'text-xs' : 'text-sm'} relative`}>
      {/* Progress indicator */}
      {!compact && (
        <div className="text-gray-500 min-w-[80px]">
          {positionText}
        </div>
      )}
      
      {/* Previous button */}
      <button
        onClick={previous}
        disabled={isDisabled || currentIndex <= 0}
        className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center ${
          isDisabled || currentIndex <= 0 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-50 hover:bg-blue-100'
        }`}
        title="Previous"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={compact ? "14" : "16"} 
          height={compact ? "14" : "16"} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-blue-700"
        >
          <polygon points="19 20 9 12 19 4 19 20"></polygon>
          <line x1="5" y1="19" x2="5" y2="5"></line>
        </svg>
      </button>
      
      {/* Play/Pause button */}
      <button
        onClick={handlePlayPause}
        disabled={isDisabled}
        className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'
        }`}
        title={isQueuePlaying ? "Pause" : "Play"}
      >
        {isQueuePlaying ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={compact ? "14" : "16"} 
            height={compact ? "14" : "16"} 
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
            width={compact ? "14" : "16"} 
            height={compact ? "14" : "16"} 
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
      
      {/* Next button */}
      <button
        onClick={next}
        disabled={isDisabled || currentIndex >= queueLength - 1}
        className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center ${
          isDisabled || currentIndex >= queueLength - 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-50 hover:bg-blue-100'
        }`}
        title="Next"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={compact ? "14" : "16"} 
          height={compact ? "14" : "16"} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-blue-700"
        >
          <polygon points="5 4 15 12 5 20 5 4"></polygon>
          <line x1="19" y1="5" x2="19" y2="19"></line>
        </svg>
      </button>
      
      {/* Volume slider */}
      {!compact && (
        <div className="flex items-center ml-2">
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
            className="mx-1 w-16 md:w-24"
            disabled={isDisabled}
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
      )}
      
      {/* Compact volume button if in compact mode */}
      {compact && (
        <button
          onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          disabled={isDisabled}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
          title={volume === 0 ? "Unmute" : "Mute"}
        >
          {volume === 0 ? (
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
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
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
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          )}
        </button>
      )}
      
      {/* Debug button */}
      <button
        onClick={toggleDebug}
        className={`w-8 h-8 rounded-full flex items-center justify-center ${showDebug ? 'bg-green-100' : 'hover:bg-gray-100'}`}
        title="Toggle audio debug info"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className={showDebug ? "text-green-600" : "text-gray-500"}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="8"></line>
        </svg>
      </button>
      
      {/* Current replay indicator - only show when actively replaying */}
      {isQueuePlaying && currentItem && (
        <div className={`flex items-center gap-1 bg-blue-100 ${compact ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-full text-blue-700 ${compact ? 'text-xs' : 'text-sm'} font-medium`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span>
            {compact ? 'Replaying' : `Replaying ${currentIndex + 1}/${queueLength}`}
          </span>
        </div>
      )}
      
      {/* Debug info */}
      {showDebug && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <AudioDebugInfo
            isPlaying={isQueuePlaying}
            sourceSampleRate={sourceSampleRate}
            contextSampleRate={audioContext?.sampleRate}
            audioContext={audioContext}
            showDetails={true}
          />
        </div>
      )}
    </div>
  );
} 