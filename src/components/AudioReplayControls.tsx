import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AudioMessage } from '@/types';
import { CombinedEvent } from '@/hooks/useCombinedReplay';

interface AudioReplayControlsProps {
  isReplayMode: boolean;
  isReplaying: boolean;
  isPlaying: boolean;
  showReplayButton: boolean;
  audioMessages: CombinedEvent[];
  currentAudioIndex: number;
  setShowCenteredPulse: (show: boolean) => void;
  setShowReplayButton: (show: boolean) => void;
  startReplay: () => Promise<void> | void;
  pauseReplay: () => Promise<void>;
  jumpToResults?: () => void;
  audioContext?: AudioContext;
}

const AudioReplayControls: React.FC<AudioReplayControlsProps> = ({
  isReplayMode,
  isReplaying,
  isPlaying,
  showReplayButton,
  audioMessages,
  currentAudioIndex,
  setShowCenteredPulse,
  setShowReplayButton,
  startReplay,
  pauseReplay,
  jumpToResults,
  audioContext
}) => {

  // Handle click on replay button
  const handleReplayClick = async () => {
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Hide the pulse while replaying
    setShowCenteredPulse(false);
    
    // Start replaying the conversation
    await startReplay();
  };

  // Handle click on the jump to end button
  const handleJumpToEnd = () => {
    if (jumpToResults) {
      jumpToResults();
    }
  };

  // When replay finishes, show a message indicating it's in replay-only mode
  const renderReplayCompletedMessage = () => {
    if (isReplayMode && !isReplaying && !showReplayButton) {
      return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-800/80 text-white py-2 px-4 rounded-lg text-sm">
            Replay completed. In replay-only mode.
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Center content - big play button */}
      {isReplayMode && showReplayButton && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-medium mb-5 text-center text-gray-800 dark:text-gray-500">Replay voice conversation?</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReplayClick}
                className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span className="font-medium">Play</span>
              </button>
              {jumpToResults && (
                <button
                  onClick={handleJumpToEnd}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="font-medium">Skip to End</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 19 22 12 13 5 13 19"></polygon>
                    <polygon points="2 19 11 12 2 5 2 19"></polygon>
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Empty div to maintain layout */}
      <div className="w-full" />
      
      {/* Jump to Results button (only shown during playback) */}
      {isReplayMode && isReplaying && !showReplayButton && jumpToResults && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleJumpToEnd}
            className="bg-gray-800/80 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="text-sm font-medium">Jump to Results</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 19 22 12 13 5 13 19"></polygon>
              <polygon points="2 19 11 12 2 5 2 19"></polygon>
            </svg>
          </button>
        </div>
      )}

      {/* Show message when replay is completed */}
      {renderReplayCompletedMessage()}
    </>
  );
};

export default AudioReplayControls; 