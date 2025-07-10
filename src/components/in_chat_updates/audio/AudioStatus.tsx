import React from 'react';
import { motion } from 'framer-motion';

interface AudioStatusProps {
  eventType: string;
  data: {
    status?: string;
    action?: string;
    text_length?: number;
    voice_description?: string;
  };
}

const AudioStatus: React.FC<AudioStatusProps> = ({ eventType, data }) => {
  // Determine if this is voice or sound effect based on data
  const actionType = data.action || 'text_to_speech';
  const isVoice = actionType === 'text_to_speech';
  
  // Get the appropriate status message based on event type and action
  const getStatusMessage = () => {
    if (data.status) {
      // If we have a specific status message, use it
      return data.status;
    }
    
    if (eventType === 'generation_started') {
      return isVoice 
        ? 'Creating voice...' 
        : 'Generating sound...';
    }
    
    if (eventType === 'status_update') {
      return isVoice 
        ? `Processing ${data.text_length ? `(${data.text_length} chars)` : ''}` 
        : 'Processing sound...';
    }
    
    if (eventType === 'processing_complete') {
      return 'Finalizing audio...';
    }
    
    // Default fallback message
    return 'Processing audio...';
  };

  // Get an appropriate title
  const getTitle = () => {
    return isVoice ? 'Voice Generation' : 'Sound Effect';
  };
  
  // Get subtitle info if available
  const getSubtitle = () => {
    if (isVoice && data.voice_description) {
      return `${data.voice_description}`;
    }
    return null;
  };

  // Render the appropriate icon based on the action type
  const renderIcon = () => {
    if (isVoice) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      );
    }
  };

  // Determine if we should show typing animation
  const showTypingAnimation = eventType !== 'processing_complete' && (eventType === 'status_update' || eventType === 'generation_started');

  return (
    <div className="w-full max-w-[400px] overflow-hidden rounded-lg border-0 bg-indigo-50/50 shadow-sm p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            {renderIcon()}
          </div>
          <div>
            <div className="text-xs font-medium text-gray-800">{getTitle()}</div>
            {getSubtitle() && <div className="text-xs text-gray-500 text-[11px]">{getSubtitle()}</div>}
          </div>
        </div>
        <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${eventType === 'processing_complete' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-100 text-indigo-700'}`}>
          {eventType === 'processing_complete' ? 'Complete' : 'Processing'}
        </div>
      </div>
      
      <div className="mt-2">
        <div className="text-[11px] text-gray-600 mb-1.5 flex items-center">
          {getStatusMessage()}
          {showTypingAnimation && (
            <span className="inline-flex ml-1 items-center">
              <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '100ms' }}></span>
              <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '200ms' }}></span>
            </span>
          )}
        </div>
        <div className="w-full h-1 bg-indigo-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: "10%" }}
            animate={{ 
              width: eventType === 'processing_complete' ? '100%' : ['10%', '95%'] 
            }}
            transition={{ 
              duration: eventType === 'processing_complete' ? 0.5 : 10,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioStatus; 