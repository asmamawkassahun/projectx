import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Share2, ZoomIn, ZoomOut, RotateCw, AlertCircle, Copy, Eye } from 'lucide-react';
import { createPortal } from 'react-dom';
import { InChatUpdate } from './types';

interface ImageGenerationDetailedViewerProps {
  updates: InChatUpdate[];
  isOpen: boolean;
  onClose: () => void;
}

const ImageGenerationDetailedViewer: React.FC<ImageGenerationDetailedViewerProps> = ({
  updates,
  isOpen,
  onClose
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const imageGeneratedUpdate = updates.find(update => update.event_type === 'image_generated');
  const errorUpdate = updates.find(update => update.event_type === 'generation_error');
  
  // Extract image data
  const imageData = imageGeneratedUpdate?.data || latestUpdate?.data || {};
  const { image_url, width, height, prompt, model, style, seed, steps, guidance_scale } = imageData;
  
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };
  
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };
  
  const handleRetry = () => {
    setImageLoading(true);
    setImageError(false);
  };

  const handleDownload = () => {
    if (image_url) {
      const link = document.createElement('a');
      link.href = image_url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyPrompt = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);
  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  if (!isOpen) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Display Area */}
        <div className="flex-1 bg-gray-900 relative overflow-hidden">
          {imageGeneratedUpdate ? (
            <div className="h-full flex items-center justify-center p-4">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
              
              {imageError ? (
                <div className="text-center text-white">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-4">Failed to load image</p>
                  <button 
                    onClick={handleRetry}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <img
                  src={image_url}
                  alt="Generated image"
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{ 
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    display: imageLoading ? 'none' : 'block'
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          ) : errorUpdate ? (
            <div className="h-full flex items-center justify-center text-center text-white p-8">
              <div>
                <AlertCircle className="w-20 h-20 mx-auto mb-6 text-red-400" />
                <h3 className="text-xl font-medium mb-4">Generation Failed</h3>
                <p className="text-gray-300 mb-6">
                  {errorUpdate.data.error || 'An error occurred while generating the image'}
                </p>
                <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-white">
              <div>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
                <h3 className="text-xl font-medium mb-2">Generating Image</h3>
                <p className="text-gray-300">Please wait while we create your image...</p>
              </div>
            </div>
          )}

          {/* Image Controls */}
          {imageGeneratedUpdate && !imageError && (
            <div className="absolute top-4 left-4 flex space-x-2">
              <button
                onClick={zoomOut}
                className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={zoomIn}
                className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={rotate}
                className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                title="Rotate"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                title="Reset View"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="w-96 bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Image Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Prompt */}
            {prompt && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Prompt</h3>
                  <button
                    onClick={handleCopyPrompt}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy prompt"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{prompt}</p>
                </div>
              </div>
            )}

            {/* Image Properties */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Properties</h3>
              <div className="space-y-3">
                {width && height && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dimensions</span>
                    <span className="text-sm font-medium text-gray-900">{width} × {height}</span>
                  </div>
                )}
                {model && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Model</span>
                    <span className="text-sm font-medium text-gray-900">{model}</span>
                  </div>
                )}
                {style && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Style</span>
                    <span className="text-sm font-medium text-gray-900">{style}</span>
                  </div>
                )}
                {seed && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Seed</span>
                    <span className="text-sm font-medium text-gray-900">{seed}</span>
                  </div>
                )}
                {steps && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Steps</span>
                    <span className="text-sm font-medium text-gray-900">{steps}</span>
                  </div>
                )}
                {guidance_scale && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Guidance Scale</span>
                    <span className="text-sm font-medium text-gray-900">{guidance_scale}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Generation Timeline */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Generation Timeline</h3>
              <div className="space-y-2">
                {updates.map((update, index) => (
                  <div key={index} className="flex items-center space-x-3 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      update.event_type === 'generation_error' ? 'bg-red-400' :
                      update.event_type === 'image_generated' ? 'bg-green-400' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-gray-600">
                      {update.event_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-gray-400 ml-auto">
                      {update.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          {imageGeneratedUpdate && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
              <div className="text-center">
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  ✓ Generation Complete
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default ImageGenerationDetailedViewer; 