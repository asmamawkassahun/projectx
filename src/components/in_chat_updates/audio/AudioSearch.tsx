import React, { useState, useRef, useEffect } from 'react';

interface AudioSearchData {
  filename?: string;
  audio_url?: string;
  source_title?: string;
  duration_seconds?: number;
  search_query?: string;
  task_file_path?: string;
}

interface AudioSearchProps {
  data: AudioSearchData;
}

const AudioSearch: React.FC<AudioSearchProps> = ({ data }) => {
  // Debug log to see when component renders and what data it receives
  console.log('AudioSearch component rendering with data:', data);
  
  const {
    filename,
    audio_url,
    source_title,
    duration_seconds,
    search_query,
  } = data;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [useFallbackPlayer, setUseFallbackPlayer] = useState(false);
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Reset state when audio_url changes
    setAudioLoaded(false);
    setAudioError(null);
    setUseFallbackPlayer(false);
    
    // Create audio element if it doesn't exist
    if (!audioRef.current && audio_url) {
      console.log('Creating audio element with URL:', audio_url);
      const audio = new Audio(audio_url);
      audioRef.current = audio;
      
      // Add event listeners
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('play', () => setIsPlaying(true));
      
      // Add additional event listeners for debugging
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio can play through');
        setAudioLoaded(true);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setAudioError(`Error loading audio: ${audio.error?.message || 'unknown error'}`);
        // Try fallback method
        setUseFallbackPlayer(true);
      });
      
      audio.addEventListener('loadeddata', () => {
        console.log('Audio data loaded');
      });
      
      // Fix common audio loading issues by setting preload attribute
      audio.preload = 'auto';
      
      // Try to load the audio
      audio.load();
      
      return () => {
        // Clean up event listeners
        audio.removeEventListener('ended', () => setIsPlaying(false));
        audio.removeEventListener('pause', () => setIsPlaying(false));
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('canplaythrough', () => setAudioLoaded(true));
        audio.removeEventListener('error', () => {});
        audio.removeEventListener('loadeddata', () => {});
      };
    }
  }, [audio_url]);
  
  // Toggle play/pause
  const togglePlayback = () => {
    if (useFallbackPlayer && fallbackAudioRef.current) {
      if (isPlaying) {
        fallbackAudioRef.current.pause();
      } else {
        fallbackAudioRef.current.play().catch(error => {
          console.error("Error playing audio with fallback player:", error);
          setAudioError(`Fallback player error: ${error.message}`);
        });
      }
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setAudioError(`Player error: ${error.message}`);
          // Try fallback method
          setUseFallbackPlayer(true);
        });
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
  
  // Render play/pause icon
  const renderIcon = () => {
    if (isPlaying) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      );
    }
  };
  
  return (
    <div className="w-full max-w-[500px] overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex items-start p-3">
        <button 
          onClick={togglePlayback} 
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 rounded-full mr-3 hover:bg-blue-100 transition-colors"
          disabled={!audio_url || (!audioLoaded && !useFallbackPlayer)}
        >
          {audioError && !useFallbackPlayer ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          ) : !audioLoaded && !useFallbackPlayer && audio_url ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          ) : (
            renderIcon()
          )}
        </button>
        
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-900">Audio Clip</div>
            <div className="text-xs text-gray-500">{formatDuration(duration_seconds)}</div>
          </div>
          
          <div className="text-xs text-gray-500 mb-1 line-clamp-1">
            {source_title || 'Found audio'}
          </div>
          
          {search_query && (
            <div className="text-xs text-gray-600 mt-1">
              Search query: "{search_query}"
            </div>
          )}
          
          {audioError && !useFallbackPlayer && (
            <div className="text-xs text-red-500 mt-1">
              Unable to play audio. Trying alternative player...
            </div>
          )}
        </div>
      </div>
      
      {!audioLoaded && !useFallbackPlayer && audio_url && !audioError && (
        <div className="border-t px-3 py-2 bg-blue-50 text-xs text-blue-600">
          Loading audio... This may take a few moments.
        </div>
      )}
      
      {/* Fallback HTML5 audio player */}
      {useFallbackPlayer && audio_url && (
        <div className="border-t px-3 py-2">
          <audio 
            ref={fallbackAudioRef}
            src={audio_url}
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-8"
            preload="auto"
          />
        </div>
      )}
      
      {/* Display the URL for debugging */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="border-t px-3 py-2 bg-gray-100 text-xs text-gray-500 break-all">
          <div>URL: {audio_url || 'None'}</div>
          <div>Filename: {filename || 'None'}</div>
          <div>Player mode: {useFallbackPlayer ? 'HTML5 Fallback' : 'JS Audio API'}</div>
          <div>Status: {audioLoaded ? 'Loaded' : (audioError ? 'Error' : 'Loading')}</div>
        </div>
      )}
    </div>
  );
};

export default AudioSearch; 