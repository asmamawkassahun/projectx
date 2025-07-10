import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, AlertCircle, Eye } from 'lucide-react';
import { BaseSwiperItemProps } from './types';
import { AudioGenerationDetailedViewer } from './index';

const AudioGenerationSwiperItem: React.FC<BaseSwiperItemProps> = ({ 
  updates, 
  isActive, 
  isDragging 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showDetailedViewer, setShowDetailedViewer] = useState(false);
  
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const audioGeneratedUpdate = updates.find(update => update.event_type === 'audio_generated');
  const errorUpdate = updates.find(update => update.event_type === 'generation_error');
  
  // Extract audio data
  const audioData = audioGeneratedUpdate?.data || latestUpdate?.data || {};
  const { audio_url, filename, text, voice_description, approx_duration, action } = audioData;
  
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
    return text.length > 100 ? `${text.substring(0, 100)}...` : text;
  };

  const getTitle = () => {
    if (audioGeneratedUpdate) return 'Generated Audio';
    if (errorUpdate) return 'Audio Generation Failed';
    return 'Generating Audio';
  };

  const handleCardClick = () => {
    if (!isDragging) {
      setShowDetailedViewer(true);
    }
  };

  return (
    <>
      <div className="w-full">
        <h2 className={`text-lg font-semibold mb-4 ${isActive ? "text-gray-900" : "text-gray-400"} tracking-tight`}>
          {getTitle()}
        </h2>
        
        <div className="relative h-[320px] w-full">
          {audioGeneratedUpdate ? (
            <motion.div 
              className="absolute inset-0 cursor-pointer"
              onClick={handleCardClick}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="h-full flex flex-col">
                  {/* Audio visualization */}
                  <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Play className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full p-1">
                          <Eye className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-base font-medium text-gray-900 mb-1">
                        {isVoice ? "Voice Generation" : "Sound Effect"}
                      </h3>
                      {voice_description && (
                        <p className="text-sm text-gray-600 mb-2">{voice_description}</p>
                      )}
                      <div className="text-xs text-gray-500">
                        Duration: {formatDuration(approx_duration)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Text content if available */}
                  {text && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="text-xs font-medium text-gray-700 mb-1">Generated Text:</div>
                      <p className="text-sm text-gray-600 line-clamp-3">{getTruncatedText()}</p>
                      {text.length > 100 && (
                        <button className="text-xs text-gray-500 hover:text-gray-700 mt-1">
                          Show more
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  <div className="p-3 bg-white border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        ✓ Complete
                      </span>
                      <div className="text-xs text-blue-600 font-medium">
                        Click to play →
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : errorUpdate ? (
            // Show error state
            <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-red-50 border border-red-200 shadow-lg">
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-base font-medium text-red-900 mb-2">Generation Failed</h3>
                <p className="text-sm text-red-600 mb-4">
                  {errorUpdate.data.error || 'An error occurred while generating the audio'}
                </p>
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : (
            // Show progress state
            <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-lg">
              <div className="h-full flex flex-col items-center justify-center p-6">
                {/* Animated audio waves */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-end space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gray-400 rounded-full animate-pulse"
                        style={{
                          height: `${20 + Math.random() * 20}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '1s'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <h3 className="text-base font-medium text-gray-900 mb-2">Creating Audio</h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {isVoice ? "Generating voice from text..." : "Creating sound effect..."}
                </p>
                
                {/* Progress indicator */}
                <div className="w-full max-w-xs">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-gray-400 animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">Processing audio...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detailed Viewer */}
      <AudioGenerationDetailedViewer
        updates={updates}
        isOpen={showDetailedViewer}
        onClose={() => setShowDetailedViewer(false)}
      />
    </>
  );
};

export default AudioGenerationSwiperItem; 