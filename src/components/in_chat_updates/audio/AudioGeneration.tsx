import React, { useState, useRef, useEffect } from 'react';

interface AudioGenerationProps {
  filename?: string;
  audio_url?: string;
  text?: string;
  description?: string;
  voice_description?: string;
  approx_duration?: number;
  action?: string; // 'text_to_speech' or 'sound_effect'
}

const AudioGeneration: React.FC<AudioGenerationProps> = ({
  filename,
  audio_url,
  text,
  description,
  voice_description,
  approx_duration,
  action = 'text_to_speech', // Default to voice generation
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Determine if this is voice or sound effect
  const isVoice = action === 'text_to_speech' || Boolean(text);
  
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current && audio_url) {
      const audio = new Audio(audio_url);
      audioRef.current = audio;
      
      // Add event listeners
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('error', () => setError(true));
      
      return () => {
        // Clean up event listeners
        audio.removeEventListener('ended', () => setIsPlaying(false));
        audio.removeEventListener('pause', () => setIsPlaying(false));
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('error', () => setError(true));
      };
    }
  }, [audio_url]);
  
  // Toggle play/pause
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio playback error:", error);
            setError(true);
          });
        }
      }
    }
  };
  
  // Format duration in mm:ss format
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Truncate text to a reasonable length
  const getTruncatedText = () => {
    if (!text) return '';
    return text.length > 50 ? `${text.substring(0, 50)}...` : text;
  };
  
  // Render appropriate icon based on type and playback state
  const renderIcon = () => {
    if (error) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      );
    }
    
    if (isPlaying) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      );
    }
    
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    );
  };
  
  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-lg border-0 bg-indigo-50/50 shadow-sm">
      <div className="flex items-center p-3">
        <button 
          onClick={togglePlayback} 
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 transition-colors ${isPlaying ? 'bg-indigo-600 hover:bg-indigo-700' : error ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
          disabled={!audio_url || error}
          title={error ? "Failed to load audio" : isPlaying ? "Pause" : "Play"}
        >
          {renderIcon()}
        </button>
        
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div className="text-xs font-medium text-gray-800">
              {isVoice ? "Voice" : "Sound Effect"}
              {voice_description && ` • ${voice_description}`}
            </div>
            <div className="text-[10px] text-indigo-700 font-medium bg-indigo-100 px-2 py-0.5 rounded-full">
              {formatDuration(approx_duration)}
            </div>
          </div>
          
          {text && (
            <div className="text-[11px] text-gray-600 mt-1 line-clamp-1">{getTruncatedText()}</div>
          )}
        </div>
      </div>
      
      {isVoice && text && text.length > 50 && (
        <details className="px-3 pb-2 text-xs">
          <summary className="cursor-pointer text-[10px] text-indigo-600 hover:text-indigo-800 mb-1">
            Show full text
          </summary>
          <p className="text-[11px] text-gray-600 whitespace-pre-line p-2 bg-white rounded-md border border-indigo-100">
            {text}
          </p>
        </details>
      )}
    </div>
  );
};

export default AudioGeneration; 