import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Download, Share2, RotateCcw, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { InChatUpdate } from './types';

interface AudioGenerationDetailedViewerProps {
  updates: InChatUpdate[];
  isOpen: boolean;
  onClose: () => void;
}

const AudioGenerationDetailedViewer: React.FC<AudioGenerationDetailedViewerProps> = ({
  updates,
  isOpen,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const audioGeneratedUpdate = updates.find(update => update.event_type === 'audio_generated');
  const errorUpdate = updates.find(update => update.event_type === 'generation_error');
  
  // Extract audio data
  const audioData = audioGeneratedUpdate?.data || latestUpdate?.data || {};
  const { audio_url, filename, text, voice_description, approx_duration, action, model, style } = audioData;
  
  // Determine if this is voice or sound effect
  const isVoice = action === 'text_to_speech' || Boolean(text);

  useEffect(() => {
    if (!audioRef.current && audio_url) {
      const audio = new Audio(audio_url);
      audioRef.current = audio;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);
      const handleError = () => setError(true);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audio_url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error("Audio playback error:", error);
            setError(true);
          });
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (audio_url) {
      const link = document.createElement('a');
      link.href = audio_url;
      link.download = filename || 'generated-audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isVoice ? 'Voice Generation' : 'Sound Effect'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {audioGeneratedUpdate ? (
            <div className="space-y-6">
              {/* Audio Player */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <Volume2 className="w-12 h-12 text-gray-600" />
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button
                    onClick={handleRestart}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Restart"
                  >
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={togglePlayback}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isPlaying 
                        ? 'bg-gray-800 hover:bg-gray-900' 
                        : error 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-gray-700 hover:bg-gray-800'
                    }`}
                    disabled={!audio_url || error}
                  >
                    {error ? (
                      <AlertCircle className="w-8 h-8 text-white" />
                    ) : isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {/* Audio Information */}
              <div className="space-y-4">
                {text && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Generated Text:</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{text}</p>
                    </div>
                  </div>
                )}

                {voice_description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Voice Description:</h3>
                    <p className="text-gray-600">{voice_description}</p>
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  {model && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Model</h4>
                      <p className="text-gray-900">{model}</p>
                    </div>
                  )}
                  {style && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Style</h4>
                      <p className="text-gray-900">{style}</p>
                    </div>
                  )}
                  {approx_duration && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Duration</h4>
                      <p className="text-gray-900">{Math.round(approx_duration)}s</p>
                    </div>
                  )}
                  {filename && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Filename</h4>
                      <p className="text-gray-900">{filename}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  ✓ Generation Complete
                </span>
              </div>
            </div>
          ) : errorUpdate ? (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Generation Failed</h3>
              <p className="text-red-600 mb-6">
                {errorUpdate.data.error || 'An error occurred while generating the audio'}
              </p>
              <button className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                Try Again
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Audio</h3>
              <p className="text-gray-600">Please wait while we create your audio...</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default AudioGenerationDetailedViewer; 