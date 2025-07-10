import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, AlertCircle, Download, Eye } from 'lucide-react';
import { BaseSwiperItemProps } from './types';
import { ImageGenerationDetailedViewer } from './index';

const ImageGenerationSwiperItem: React.FC<BaseSwiperItemProps> = ({ 
  updates, 
  isActive, 
  isDragging 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showDetailedViewer, setShowDetailedViewer] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const imageGeneratedUpdate = updates.find(update => update.event_type === 'image_generated');
  const errorUpdate = updates.find(update => update.event_type === 'generation_error');
  
  // Extract image data
  const imageData = imageGeneratedUpdate?.data || latestUpdate?.data || {};
  const { image_url, width, height, prompt, model, style } = imageData;
  
  // Calculate display dimensions while maintaining aspect ratio
  const getDisplayDimensions = () => {
    if (!width || !height) return { width: 280, height: 280 };
    
    const maxWidth = 280;
    const maxHeight = 200;
    const aspectRatio = width / height;
    
    let displayWidth = maxWidth;
    let displayHeight = maxWidth / aspectRatio;
    
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = maxHeight * aspectRatio;
    }
    
    return { width: Math.round(displayWidth), height: Math.round(displayHeight) };
  };
  
  const { width: displayWidth, height: displayHeight } = getDisplayDimensions();
  
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };
  
  const handleImageError = (imageUrl: string) => {
    setImageLoading(false);
    setImageError(true);
    setImageErrors(prev => new Set(Array.from(prev).concat(imageUrl)));
  };
  
  const handleRetry = () => {
    setImageLoading(true);
    setImageError(false);
  };

  const getTitle = () => {
    if (imageGeneratedUpdate) return 'Generated Image';
    if (errorUpdate) return 'Image Generation Failed';
    return 'Generating Image';
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
          {imageGeneratedUpdate && image_url ? (
            <motion.div 
              className="absolute inset-0 cursor-pointer"
              onClick={handleCardClick}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="h-full flex flex-col">
                  {/* Image container */}
                  <div className="flex-1 relative overflow-hidden">
                    {!imageErrors.has(image_url) ? (
                      <img
                        src={image_url}
                        alt={prompt || 'Generated image'}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(image_url)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Image failed to load</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    
                    {/* View indicator */}
                    <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full p-2">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Image details */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    {prompt && (
                      <div className="mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-1">Prompt:</div>
                        <p className="text-sm text-gray-600 line-clamp-2">{prompt}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          ✓ Complete
                        </span>
                        {width && height && (
                          <span className="text-xs text-gray-500">
                            {width} × {height}
                          </span>
                        )}
                        {model && (
                          <span className="text-xs text-gray-500">
                            {model}
                          </span>
                        )}
                      </div>
                      
                      {/* Action indicator */}
                      <div className="text-xs text-blue-600 font-medium">
                        Click to view details →
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
                  {errorUpdate.data.error || 'An error occurred while generating the image'}
                </p>
                {prompt && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-red-200 max-w-sm">
                    <div className="text-xs font-medium text-red-700 mb-1">Prompt:</div>
                    <p className="text-sm text-red-600">{prompt}</p>
                  </div>
                )}
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : (
            // Show progress state
            <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-lg">
              <div className="h-full flex flex-col items-center justify-center p-6">
                {/* Animated image placeholder */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  {/* Animated overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse rounded-lg"></div>
                </div>
                
                <h3 className="text-base font-medium text-gray-900 mb-2">Creating Image</h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Generating your image...
                </p>
                
                {prompt && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 max-w-sm">
                    <div className="text-xs font-medium text-gray-700 mb-1">Prompt:</div>
                    <p className="text-sm text-gray-600 line-clamp-2">{prompt}</p>
                  </div>
                )}
                
                {/* Progress indicator */}
                <div className="w-full max-w-xs">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-gray-400 animate-pulse" style={{ width: '45%' }} />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">Processing image...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detailed Viewer */}
      <ImageGenerationDetailedViewer
        updates={updates}
        isOpen={showDetailedViewer}
        onClose={() => setShowDetailedViewer(false)}
      />
    </>
  );
};

export default ImageGenerationSwiperItem; 