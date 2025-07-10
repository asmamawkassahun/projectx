import React from 'react';

interface ImageGenerationProps {
  data: {
    image_url: string;
    width?: number;
    height?: number;
  };
}

const ImageGeneration: React.FC<ImageGenerationProps> = ({ data }) => {
  const { image_url, width = 512, height = 512 } = data;
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  
  // Calculate aspect ratio to maintain image proportions
  const aspectRatio = width / height;
  
  // Set maximum dimensions
  const maxWidth = Math.min(width, 380); // Limit width to 380px max
  const maxHeight = maxWidth / aspectRatio;

  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-lg border-0 bg-white shadow-sm">
      <div className="p-0">
        <div className="flex flex-col">
          <div 
            className="relative mx-auto w-full" 
            style={{ 
              height: `${maxHeight}px`,
              maxWidth: '100%'
            }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50">
                <div className="w-10 h-10 mb-2 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
                <div className="text-xs text-indigo-700 flex items-center">
                  Generating image
                  <span className="inline-flex ml-1 items-center">
                    <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '100ms' }}></span>
                    <span className="w-1 h-1 bg-indigo-500 rounded-full mx-0.5 animate-typing" style={{ animationDelay: '200ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            
            {loadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 mb-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div className="text-xs text-indigo-700 text-center">Failed to load image</div>
                <button 
                  className="mt-2 px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                  onClick={() => {
                    setLoadError(false);
                    setIsLoading(true);
                    // Force reload the image
                    const img = new Image();
                    img.src = image_url + '?reload=' + new Date().getTime();
                    img.onload = () => setIsLoading(false);
                    img.onerror = () => setLoadError(true);
                  }}
                >
                  Retry
                </button>
              </div>
            )}
            
            <img
              src={image_url}
              alt="Generated image"
              className="w-full h-full object-cover rounded-md"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setLoadError(true);
              }}
              style={{ 
                opacity: isLoading || loadError ? 0 : 1, 
                transition: 'opacity 0.3s'
              }}
            />
          </div>
          
          {/* Optional small info bar at bottom */}
          {!isLoading && !loadError && (
            <div className="p-2 flex justify-between items-center text-xs bg-white">
              <div className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                Generated image
              </div>
              <div className="text-[10px] text-gray-500">
                {`${width}×${height}`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGeneration; 