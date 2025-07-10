import React from 'react';

interface VoiceAgentHeaderProps {
  isReplayMode: boolean;
  isReplaying: boolean;
  currentAudioIndex: number;
  audioMessagesCount: number;
}

const VoiceAgentHeader: React.FC<VoiceAgentHeaderProps> = ({
  isReplayMode,
  isReplaying,
  currentAudioIndex,
  audioMessagesCount
}) => {
  return (
    <div className="py-4 px-4 flex items-center justify-between bg-white/80 shadow-sm">
      {/* Logo using the gradient style */}
      <h1 
        className="text-lg font-bold tracking-widest-1 uppercase font-montserrat bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent cursor-pointer"
        onClick={() => window.location.href = '/'}
      >
        COSTAR
      </h1>
      
      {/* Replay status indicator in header */}
      {isReplayMode && isReplaying && (
        <div className="flex items-center">
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-primary font-medium text-sm">
              Replaying {currentAudioIndex + 1} of {audioMessagesCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAgentHeader; 