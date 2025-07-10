import React, { useState, useRef } from 'react';

interface VideoGenerationProps {
  data: {
    video_url: string;
    width?: number;
    height?: number;
    filename?: string;
    task_file_path?: string;
  };
}

const VideoGeneration: React.FC<VideoGenerationProps> = ({ data }) => {
  const { video_url, width = 640, height = 360, filename = 'Generated Video' } = data;
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Calculate aspect ratio to maintain video proportions
  const aspectRatio = width / height;
  
  // Set maximum dimensions
  const maxWidth = Math.min(width, 380); // Limit width to 380px max
  const maxHeight = maxWidth / aspectRatio;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Video playback error:", error);
            setLoadError(true);
          });
        }
      }
    }
  };
  
  // Handle play/pause state changes from the video element itself
  const handleVideoPlay = () => {
    setIsPlaying(true);
  };
  
  const handleVideoPause = () => {
    setIsPlaying(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-lg border-0 bg-white shadow-sm">
      <div 
        className="relative mx-auto rounded-md overflow-hidden" 
        style={{ 
          height: `${maxHeight}px`,
          maxWidth: '100%'
        }}
      >
        {isLoading && !loadError && (
          <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 mb-2 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600"></div>
              <div className="text-xs text-indigo-700 flex items-center">
                Loading video
                <span className="inline-flex ml-1 items-center">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '100ms' }}></span>
                  <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '200ms' }}></span>
                </span>
              </div>
            </div>
          </div>
        )}
        
        {loadError && (
          <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center p-4">
            <div className="flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 mb-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="text-xs text-indigo-700 mb-2">Failed to load video</span>
              <button 
                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                onClick={() => {
                  setLoadError(false);
                  setIsLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={video_url}
          className="w-full h-full object-cover"
          controls
          onLoadedData={() => setIsLoading(false)}
          onError={handleError}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          style={{ 
            opacity: isLoading || loadError ? 0 : 1, 
            transition: 'opacity 0.3s'
          }}
          autoPlay={false}
          playsInline
        />
        
        {/* Custom play button overlay for better UX */}
        {!isLoading && !loadError && !isPlaying && (
          <button
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30 rounded-md backdrop-blur-sm"
            onClick={handlePlayPause}
            aria-label="Play video"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </button>
        )}
      </div>
      
      {/* Info bar */}
      {!isLoading && !loadError && (
        <div className="p-2 flex justify-between items-center">
          <div className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
            Generated video
          </div>
          <div className="text-[10px] text-gray-500">
            {Math.round(width)}×{Math.round(height)}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGeneration; 