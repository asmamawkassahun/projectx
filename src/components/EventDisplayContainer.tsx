import React from 'react';
import { EventsDisplay } from './event-display';
import { ExtendedMessage } from '@/types/voice-agent';
import { motion } from 'framer-motion';

interface EventDisplayContainerProps {
  displayedEvents: ExtendedMessage[];
  isReplayMode?: boolean;
  isReplaying?: boolean;
}

const EventDisplayContainer: React.FC<EventDisplayContainerProps> = ({
  displayedEvents,
  isReplayMode = false,
  isReplaying = false
}) => {
  // Handle file click
  const handleFileClick = (file: any) => {
    console.log('File clicked:', file);
    
    // For images and videos, you might want to show a preview overlay
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExt);
    const isVideo = ['mp4', 'webm', 'mov'].includes(fileExt);
    
    if (isImage || isVideo) {
      // Open in new tab
      window.open(file.path, '_blank');
    } else {
      // For other files, trigger download directly
      const link = document.createElement('a');
      link.href = file.path;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle markdown file click
  const handleMarkdownFileClick = (file: any) => {
    console.log('Markdown file clicked:', file);
    
    // For demonstration, we'll just open it in a new tab
    if (file.file_url) {
      window.open(file.file_url, '_blank');
    } else {
      // If no URL but we have content, create a blob URL
      const blob = new Blob([file.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  };

  // Audio waveform bars for simulation
  const renderAudioWaveform = () => {
    // Create 20 bars with varying heights
    return (
      <div className="flex items-center justify-center gap-[2px] h-16 my-6">
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            className="w-1 bg-indigo-500/70 rounded-full"
            initial={{ height: 8 }}
            animate={{ 
              height: [
                8, 
                Math.random() * 30 + 8, 
                Math.random() * 10 + 4,
                Math.random() * 40 + 10,
                8
              ]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.05,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  };

  // Render empty state for when there are no events but replay is active
  const renderEmptyState = () => {
    if (displayedEvents.length === 0 && isReplayMode && isReplaying) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <motion.div 
            className="flex flex-col items-center p-8 rounded-xl bg-white backdrop-blur-sm shadow-md border border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-full bg-indigo-50 p-3 mb-4 shadow-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-indigo-600"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            
            {/* Audio waveform simulation */}
            {renderAudioWaveform()}
            
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Replaying conversation
            </h3>
            <p className="text-md text-gray-500 text-center max-w-sm">
              Task events and responses will appear here as they occurred during the original conversation.
            </p>
          </motion.div>
        </div>
      );
    }
    return null;
  };

  // Render empty state with a message for when replay mode is active but not yet started
  const renderInitialReplayState = () => {
    if (displayedEvents.length === 0 && isReplayMode && !isReplaying) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <motion.div 
            className="flex flex-col items-center p-8 rounded-xl bg-white backdrop-blur-sm shadow-md border border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-full bg-indigo-50 p-3 mb-4 shadow-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-indigo-600"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Ready to replay
            </h3>
            <p className="text-md text-gray-500 text-center max-w-sm">
              Press the Play button to start the conversation replay.
            </p>
          </motion.div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-grow flex items-end justify-center pb-24">
      {renderEmptyState()}
      {renderInitialReplayState()}
      {displayedEvents.length > 0 && (
        <EventsDisplay 
          displayedEvents={displayedEvents}
          onFileClick={handleFileClick}
          onMarkdownFileClick={handleMarkdownFileClick}
        />
      )}
    </div>
  );
};

export default EventDisplayContainer; 