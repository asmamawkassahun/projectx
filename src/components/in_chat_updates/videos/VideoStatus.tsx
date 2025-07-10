import React, { useEffect, useState } from 'react';

interface VideoStatusProps {
  eventType: string;
  data: {
    status?: string;
    retry_count?: number;
    video_id?: string;
    action?: string;
  };
}

const VideoStatus: React.FC<VideoStatusProps> = ({ eventType, data }) => {
  // Added state for dynamic progress tracking
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  
  // Use the retry_count to determine progress with different weights for different stages
  useEffect(() => {
    let initialProgress = 0;
    let initialStatus = 'Processing video...';
    
    // Set different starting points based on event type
    switch (eventType) {
      case 'generation_started':
        initialProgress = 5;
        initialStatus = 'Starting video...';
        break;
      case 'status_checking':
        initialProgress = 15;
        initialStatus = 'Requesting video...';
        break;
      case 'status_update':
        // For status updates, calculate progress based on retry count
        // Assuming ~20 retries (at 10s intervals) is typical for completion
        if (data.retry_count !== undefined) {
          // Allow for up to 85% progress from status updates (15% from earlier stages)
          initialProgress = 15 + Math.min(70, (data.retry_count / 20) * 70);
          setElapsedTime(data.retry_count * 10); // Assuming 10 second intervals
          
          // Set status based on progress
          if (data.retry_count < 3) {
            initialStatus = 'Processing...';
          } else if (data.retry_count < 7) {
            initialStatus = 'Generating frames...';
          } else if (data.retry_count < 12) {
            initialStatus = 'Rendering...';
          } else if (data.retry_count < 16) {
            initialStatus = 'Refining details...';
          } else {
            initialStatus = 'Finalizing video...';
          }
        } else {
          initialProgress = 25;
          initialStatus = 'Processing content...';
        }
        break;
      default:
        initialProgress = 10;
        initialStatus = 'Creating video...';
    }
    
    setProgress(initialProgress);
    setStatusMessage(initialStatus);
    
    // Create a slow auto-incrementing progress effect
    const interval = setInterval(() => {
      setProgress(prev => {
        // Don't auto-increment beyond certain thresholds based on stage
        const maxProgress = eventType === 'generation_started' ? 15 :
                           eventType === 'status_checking' ? 25 : 95;
        
        return prev < maxProgress ? prev + 0.2 : prev;
      });
      
      // Also increment elapsed time counter
      setElapsedTime(prev => prev + 1);
      
      // Occasionally update status message for better UX
      if (elapsedTime % 30 === 0 && elapsedTime > 0) {
        const statusMessages = [
          'Still working...',
          'Creating visuals...',
          'Adding details...',
          'Rendering frames...',
          'Perfecting animation...'
        ];
        
        if (progress < 90) {
          const randomIndex = Math.floor(Math.random() * statusMessages.length);
          setStatusMessage(statusMessages[randomIndex]);
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [eventType, data.retry_count]);
  
  // Format elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Determine what to display about time
  const getTimeDisplay = () => {
    if (elapsedTime < 10) {
      return '';
    }
    return formatTime(elapsedTime);
  };
  
  // Determine if we should show typing animation
  const showTypingAnimation = progress < 90 && eventType !== 'processing_complete';
  
  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-lg border-0 bg-indigo-50/50 shadow-sm">
      <div className="p-3">
        <div className="flex items-center justify-between">
          {/* Status icon with progress */}
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 flex-shrink-0">
              {/* Animated progress circle */}
              <svg className="h-6 w-6" viewBox="0 0 100 100">
                <circle 
                  className="text-indigo-200" 
                  strokeWidth="8"
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className="text-indigo-600 transition-all duration-500" 
                  strokeWidth="8" 
                  strokeDasharray={251.2} 
                  strokeDashoffset={251.2 - (251.2 * progress / 100)} 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
              </svg>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
              </div>
            </div>
            
            {/* Status text */}
            <div className="text-xs font-medium text-gray-800 flex items-center">
              {statusMessage}
              {showTypingAnimation && (
                <span className="inline-flex ml-1 items-center">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '100ms' }}></span>
                  <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '200ms' }}></span>
                </span>
              )}
            </div>
          </div>
          
          {/* Elapsed time badge - only shown if time is significant */}
          {getTimeDisplay() && (
            <div className="text-[10px] text-indigo-700 font-medium bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {getTimeDisplay()}
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-indigo-100">
          <div 
            className="h-full rounded-full bg-indigo-500 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Action/detail text */}
        <div className="mt-1.5 flex justify-between items-center">
          <div className="text-[11px] text-gray-600">
            {data.action === 'text_to_video' ? 'Creating from text' : 'Video generation'}
          </div>
          <div className="text-[10px] text-indigo-700 font-medium">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStatus; 