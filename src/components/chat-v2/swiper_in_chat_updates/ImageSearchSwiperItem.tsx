import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Image as ImageIcon, ExternalLink, AlertCircle } from 'lucide-react';
import { BaseSwiperItemProps } from './types';

const ImageSearchSwiperItem: React.FC<BaseSwiperItemProps> = ({ 
  updates, 
  isActive, 
  isDragging 
}) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(update => update.event_type === 'search_complete');
  const errorUpdate = updates.find(update => update.event_type === 'search_error');
  const imageResultsUpdate = updates.find(update => update.event_type === 'image_results');
  
  // Extract search data
  const searchData = searchCompleteUpdate?.data || imageResultsUpdate?.data || latestUpdate?.data || {};
  const { query, images = [], total_results } = searchData;
  
  // Get the first few images to display
  const displayImages = images.slice(0, 4);
  
  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const getTitle = () => {
    if (searchCompleteUpdate || imageResultsUpdate) return 'Image Search Results';
    if (errorUpdate) return 'Image Search Failed';
    return 'Searching Images';
  };

  return (
    <div className="w-full">
      <h2 className={`text-lg font-semibold mb-4 ${isActive ? "text-gray-900" : "text-gray-400"} tracking-tight`}>
        {getTitle()}
      </h2>
      
      <div className="relative h-[320px] w-full">
        {(searchCompleteUpdate || imageResultsUpdate) ? (
          // Show search results
          <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-lg">
            <div className="h-full flex flex-col">
              {/* Search info header */}
              {query && (
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900 line-clamp-1">
                        "{query}"
                      </span>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {total_results || images.length} images
                    </span>
                  </div>
                </div>
              )}
              
              {/* Images grid */}
              <div className="flex-1 overflow-y-auto">
                {displayImages.length > 0 ? (
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {displayImages.map((image: any, index: number) => (
                        <div key={index} className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                          {imageErrors.has(index) ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                              <AlertCircle className="w-6 h-6 text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500">Failed to load</span>
                            </div>
                          ) : (
                            <>
                              <img
                                src={image.thumbnail || image.url}
                                alt={image.title || 'Search result'}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                onError={() => handleImageError(index)}
                              />
                              
                              {/* Overlay with info */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
                                <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="text-xs font-medium line-clamp-2 mb-1">
                                    {image.title}
                                  </div>
                                  {image.source && (
                                    <div className="text-xs text-gray-300 line-clamp-1">
                                      {image.source}
                                    </div>
                                  )}
                                </div>
                                
                                {/* External link button */}
                                {image.link && (
                                  <button 
                                    className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                                    title="View source"
                                  >
                                    <ExternalLink className="w-3 h-3 text-white" />
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No images found</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-3 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ✓ Complete
                  </span>
                  {total_results && total_results > displayImages.length && (
                    <button className="text-xs text-gray-600 hover:text-gray-800 underline">
                      View all {total_results} images
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : errorUpdate ? (
          // Show error state
          <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-red-50 border border-red-200 shadow-lg">
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-base font-medium text-red-900 mb-2">Search Failed</h3>
              <p className="text-sm text-red-600 mb-4">
                {errorUpdate.data.error || 'An error occurred while searching for images'}
              </p>
              {query && (
                <div className="mb-4 p-3 bg-white rounded-lg border border-red-200">
                  <div className="text-xs font-medium text-red-700 mb-1">Search Query:</div>
                  <p className="text-sm text-red-600">"{query}"</p>
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
              {/* Animated search icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                {/* Animated search rings */}
                <div className="absolute inset-0 rounded-lg">
                  <div className="absolute inset-0 rounded-lg border-2 border-gray-300 animate-ping"></div>
                  <div className="absolute inset-2 rounded-lg border-2 border-gray-400 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              
              <h3 className="text-base font-medium text-gray-900 mb-2">Searching Images</h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                Finding relevant images...
              </p>
              
              {query && (
                <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-xs font-medium text-gray-700 mb-1">Query:</div>
                  <p className="text-sm text-gray-600">"{query}"</p>
                </div>
              )}
              
              {/* Progress indicator */}
              <div className="w-full max-w-xs">
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-gray-400 animate-pulse" style={{ width: '65%' }} />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500">Searching images...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ImageSearchSwiperItem; 