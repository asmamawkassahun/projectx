import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface KnowledgeGraphProps {
  data: {
    title: string;
    type?: string;
    description?: string;
    image?: string;
    website?: string;
    images?: string[];
    facts?: Record<string, any>;
    related?: Array<{ name: string; link: string; image?: string }>;
    profiles?: Array<{ name: string; link: string; image?: string }>;
    source?: {
      name: string;
      link: string;
    };
  };
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data }) => {
  const [showMore, setShowMore] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  
  const formatFact = (key: string, value: any) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    } else if (typeof value === 'object' && value !== null) {
      return Object.values(value).join(', ');
    }
    return value;
  };

  // Only show first few facts initially
  const factKeys = data.facts ? Object.keys(data.facts) : [];
  const visibleFactKeys = showMore ? factKeys : factKeys.slice(0, 4);
  
  // Show limited number of images initially
  const initialImagesCount = 4;
  const visibleImages = showAllImages ? data.images : data.images?.slice(0, initialImagesCount);
  
  // Handle image view
  const openImageViewer = (index: number) => {
    setActiveImageIndex(index);
  };
  
  const closeImageViewer = () => {
    setActiveImageIndex(null);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-indigo-100 rounded-lg overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="relative">
        {data.image && (
          <div className="w-full h-32 overflow-hidden bg-gradient-to-b from-indigo-50 to-indigo-100/30">
            <motion.div 
              className="absolute inset-0 opacity-30 bg-center bg-cover"
              style={{ 
                backgroundImage: `url(${data.image})`,
                filter: 'blur(10px)',
                transform: 'scale(1.1)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          </div>
        )}
        
        <div className={`relative ${data.image ? 'px-4 pb-4 pt-20' : 'p-4'} flex items-center`}>
          {data.image && (
            <motion.div 
              className="mr-3 rounded-lg overflow-hidden shadow-md border border-indigo-100 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={data.image} 
                alt={data.title}
                className="w-16 h-16 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </motion.div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-indigo-900 text-base font-semibold truncate">{data.title}</h2>
                {data.type && (
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                    {data.type}
                  </span>
                )}
              </div>
              
              {data.website && (
                <a 
                  href={data.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 mt-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span className="truncate hover:underline">{data.website}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      {data.description && (
        <div className="px-4 pb-3">
          <p className="text-indigo-700 text-xs leading-relaxed">{data.description}</p>
          
          {/* Source citation */}
          {data.source && (
            <div className="text-indigo-500 text-xs mt-1.5">
              Source: 
              <a href={data.source.link} target="_blank" rel="noopener noreferrer" className="ml-1 text-indigo-600 hover:underline transition-colors">
                {data.source.name}
              </a>
            </div>
          )}
        </div>
      )}
      
      {/* Facts Section */}
      {data.facts && visibleFactKeys.length > 0 && (
        <div className="px-4 py-3 border-t border-indigo-100">
          <h3 className="text-indigo-800 text-xs font-medium mb-2">Key Facts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {visibleFactKeys.map((key, i) => (
              <motion.div 
                key={key}
                className="bg-indigo-50 hover:bg-indigo-100/50 transition-colors rounded-md px-3 py-2 text-xs shadow-sm border border-indigo-100"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <div className="text-indigo-600 capitalize font-medium mb-0.5">{key.replace(/_/g, ' ')}</div>
                <div className="text-indigo-800">{formatFact(key, data.facts![key])}</div>
              </motion.div>
            ))}
          </div>
          
          {factKeys.length > 4 && (
            <button 
              onClick={() => setShowMore(!showMore)}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 transition-colors"
            >
              {showMore ? 'Show less' : `Show ${factKeys.length - 4} more facts`}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transform transition-transform ${showMore ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Images Gallery */}
      {data.images && data.images.length > 0 && (
        <div className="px-4 py-3 border-t border-indigo-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-indigo-800 text-xs font-medium">Gallery</h3>
            {data.images.length > initialImagesCount && (
              <button 
                onClick={() => setShowAllImages(!showAllImages)}
                className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 transition-colors"
              >
                {showAllImages ? 'Show less' : `Show all ${data.images.length}`}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transform transition-transform ${showAllImages ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {visibleImages?.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="cursor-pointer rounded-md overflow-hidden aspect-square bg-indigo-50 border border-indigo-100 shadow-sm"
                onClick={() => openImageViewer(idx)}
              >
                <img
                  src={img}
                  alt={`${data.title} image ${idx+1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.classList.add('bg-indigo-50');
                    (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="text-indigo-500 text-[8px] p-2 flex items-center justify-center h-full">Image unavailable</div>';
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Related Entities */}
      {data.related && data.related.length > 0 && (
        <div className="px-4 py-3 border-t border-indigo-100">
          <h3 className="text-indigo-800 text-xs font-medium mb-2">Related Entities</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {data.related.map((entity, idx) => (
              <motion.a
                key={idx}
                href={entity.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="bg-white border border-indigo-100 hover:border-indigo-200 rounded-lg p-2 flex flex-col items-center w-24 flex-shrink-0 shadow-sm hover:shadow transition-all"
              >
                <div className="h-12 w-12 rounded-full overflow-hidden bg-indigo-50 mb-1 border border-indigo-100 flex-shrink-0">
                  {entity.image ? (
                    <img 
                      src={entity.image}
                      alt={entity.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = entity.name.charAt(0).toUpperCase();
                        (e.target as HTMLImageElement).parentElement!.className += ' flex items-center justify-center text-xl font-medium text-indigo-600';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xl font-medium text-indigo-600">
                      {entity.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-indigo-700 text-xs text-center line-clamp-1">
                  {entity.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      )}
      
      {/* Social Profiles */}
      {data.profiles && data.profiles.length > 0 && (
        <div className="px-4 py-3 border-t border-indigo-100">
          <h3 className="text-indigo-800 text-xs font-medium mb-2">Social Profiles</h3>
          <div className="flex flex-wrap gap-2">
            {data.profiles.map((profile, idx) => (
              <motion.a
                key={idx}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center gap-1 transition-colors"
              >
                {profile.image && (
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-4 h-4 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <span>{profile.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {activeImageIndex !== null && data.images && (
        <div 
          className="fixed inset-0 bg-indigo-900/80 z-50 flex items-center justify-center p-4"
          onClick={closeImageViewer}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button 
              onClick={closeImageViewer}
              className="absolute top-2 right-2 z-10 bg-indigo-600/70 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img 
              src={data.images[activeImageIndex]} 
              alt={`${data.title} image ${activeImageIndex+1}`}
              className="max-h-[80vh] max-w-full rounded-lg border border-indigo-100 shadow-xl"
            />
            <div className="absolute bottom-2 left-2 right-2 flex justify-between">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev === null || prev === 0) ? data.images!.length - 1 : prev - 1);
                }}
                className="bg-indigo-600/70 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
                disabled={data.images.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev === null || prev === data.images!.length - 1) ? 0 : prev + 1);
                }}
                className="bg-indigo-600/70 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
                disabled={data.images.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
};

export default KnowledgeGraph; 