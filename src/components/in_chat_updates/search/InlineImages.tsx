import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageData {
  link: string;
  source: string;
  thumbnail: string;
  original?: string;
  title?: string;
}

interface InlineImagesProps {
  data: ImageData[];
}

const InlineImages: React.FC<InlineImagesProps> = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const openImage = (image: ImageData) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  // Navigate to previous image
  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = data.findIndex(img => img.thumbnail === selectedImage.thumbnail);
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    setSelectedImage(data[prevIndex]);
  };

  // Navigate to next image
  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = data.findIndex(img => img.thumbnail === selectedImage.thumbnail);
    const nextIndex = (currentIndex + 1) % data.length;
    setSelectedImage(data[nextIndex]);
  };

  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {data.slice(0, 12).map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="cursor-pointer group relative rounded-lg overflow-hidden aspect-square bg-indigo-50 border border-indigo-100 shadow-sm"
            onClick={() => openImage(image)}
          >
            <img
              src={image.thumbnail}
              alt={image.title || 'Search result image'}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.classList.add('bg-indigo-50');
                (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="text-indigo-500 text-[8px] p-2 flex items-center justify-center h-full">Image unavailable</div>';
              }}
            />
            <div className="absolute inset-0 bg-indigo-800/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
              <p className="text-white text-[8px] line-clamp-1 text-center font-medium">
                {image.title || 'View'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-indigo-900/80 z-50 flex items-center justify-center p-4"
            onClick={closeImage}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[90vh] w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-indigo-600/70 p-2 rounded-full text-white hover:bg-indigo-700/80 z-10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600/70 p-2 rounded-full text-white hover:bg-indigo-700/80 z-10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              {/* Close button */}
              <button
                onClick={closeImage}
                className="absolute top-2 right-2 bg-indigo-600/70 p-2 rounded-full text-white hover:bg-indigo-700/80 z-10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Image container */}
              <div className="bg-white rounded-lg overflow-hidden max-h-[calc(90vh-80px)] shadow-lg">
                <img
                  src={selectedImage.original || selectedImage.thumbnail}
                  alt={selectedImage.title || 'Image'}
                  className="object-contain max-h-[calc(90vh-160px)] w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = selectedImage.thumbnail;
                  }}
                />
                
                {/* Image details */}
                <div className="bg-indigo-50 p-3 border-t border-indigo-100">
                  {selectedImage.title && (
                    <h3 className="text-indigo-900 text-sm font-medium mb-1">{selectedImage.title}</h3>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-indigo-500 text-xs">
                      {selectedImage.source && (
                        <span>Source: {selectedImage.source}</span>
                      )}
                    </div>
                    
                    <a
                      href={selectedImage.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 text-xs flex items-center gap-1 hover:text-indigo-800 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      View original
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InlineImages; 