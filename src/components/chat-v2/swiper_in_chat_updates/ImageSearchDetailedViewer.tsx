import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, ExternalLink, Download, AlertCircle, Grid, List, Filter, SortAsc, Eye } from 'lucide-react';
import { createPortal } from 'react-dom';
import { InChatUpdate } from './types';

interface ImageSearchDetailedViewerProps {
  updates: InChatUpdate[];
  isOpen: boolean;
  onClose: () => void;
}

const ImageSearchDetailedViewer: React.FC<ImageSearchDetailedViewerProps> = ({
  updates,
  isOpen,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'size' | 'date'>('relevance');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(update => update.event_type === 'search_complete');
  const errorUpdate = updates.find(update => update.event_type === 'search_error');
  
  // Extract image data
  const imageData = searchCompleteUpdate?.data || latestUpdate?.data || {};
  const { query, images = [], total_results } = imageData;
  
  // Filter and sort images
  const filteredImages = images
    .filter((image: any) => {
      if (sizeFilter === 'all') return true;
      if (sizeFilter === 'small' && image.width && image.width < 500) return true;
      if (sizeFilter === 'medium' && image.width && image.width >= 500 && image.width < 1000) return true;
      if (sizeFilter === 'large' && image.width && image.width >= 1000) return true;
      return false;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'size':
          return (b.width * b.height || 0) - (a.width * a.height || 0);
        case 'date':
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        default:
          return 0; // Keep original relevance order
      }
    });

  // Handle image error
  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(Array.from(prev).concat(imageUrl)));
  };

  // Handle image download
  const handleDownload = async (image: any) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
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
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Image Search Results</h2>
            {query && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                <Search className="w-4 h-4" />
                <span>"{query}"</span>
                {total_results && (
                  <span>• {total_results.toLocaleString()} results</span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {searchCompleteUpdate ? (
          <>
            {/* Controls */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* View Mode */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'relevance' | 'size' | 'date')}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="size">Size (Largest)</option>
                      <option value="date">Date (Newest)</option>
                    </select>
                  </div>

                  {/* Size Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={sizeFilter}
                      onChange={(e) => setSizeFilter(e.target.value as 'all' | 'small' | 'medium' | 'large')}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="all">All Sizes</option>
                      <option value="small">Small (&lt;500px)</option>
                      <option value="medium">Medium (500-1000px)</option>
                      <option value="large">Large (&gt;1000px)</option>
                    </select>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {filteredImages.length} of {images.length} images
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredImages.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredImages.map((image: any, index: number) => (
                      <div
                        key={index}
                        className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedImage(image)}
                      >
                        {!imageErrors.has(image.url) ? (
                          <img
                            src={image.thumbnail || image.url}
                            alt={image.title || 'Search result'}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(image.url)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <AlertCircle className="w-8 h-8" />
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-white text-xs">
                            {image.width && image.height && (
                              <div>{image.width} × {image.height}</div>
                            )}
                            {image.source && (
                              <div className="truncate">{image.source}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredImages.map((image: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0">
                          {!imageErrors.has(image.url) ? (
                            <img
                              src={image.thumbnail || image.url}
                              alt={image.title || 'Search result'}
                              className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                              onClick={() => setSelectedImage(image)}
                              onError={() => handleImageError(image.url)}
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <AlertCircle className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {image.title || 'Untitled Image'}
                          </h3>
                          {image.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {image.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            {image.width && image.height && (
                              <span>{image.width} × {image.height}</span>
                            )}
                            {image.source && (
                              <span className="truncate">{image.source}</span>
                            )}
                            {image.date && (
                              <span>{new Date(image.date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedImage(image)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View full size"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(image)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {image.source_url && (
                            <a
                              href={image.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="View source"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No images match your filters</h3>
                  <p className="text-gray-600">Try adjusting your size filter or sort options</p>
                </div>
              )}
            </div>
          </>
        ) : errorUpdate ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Search Failed</h3>
              <p className="text-red-600 mb-6">
                {errorUpdate.data.error || 'An error occurred while searching for images'}
              </p>
              <button className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Searching Images</h3>
              <p className="text-gray-600">Finding relevant images...</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Full Size Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-5xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
              <button
                onClick={() => handleDownload(selectedImage)}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              {selectedImage.source_url && (
                <a
                  href={selectedImage.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  title="View source"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <img
              src={selectedImage.url}
              alt={selectedImage.title || 'Full size image'}
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            {(selectedImage.title || selectedImage.description) && (
              <div className="p-4 bg-white">
                {selectedImage.title && (
                  <h3 className="font-medium text-gray-900 mb-2">{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p className="text-sm text-gray-600">{selectedImage.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  {selectedImage.width && selectedImage.height && (
                    <span>{selectedImage.width} × {selectedImage.height}</span>
                  )}
                  {selectedImage.source && (
                    <span>{selectedImage.source}</span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default ImageSearchDetailedViewer; 