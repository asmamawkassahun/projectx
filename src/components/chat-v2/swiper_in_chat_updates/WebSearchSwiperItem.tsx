import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Globe } from 'lucide-react';
import { BaseSwiperItemProps } from './types';
import { WebSearchDetailedViewer } from './index';

const WebSearchSwiperItem: React.FC<BaseSwiperItemProps> = ({ 
  updates, 
  isActive, 
  isDragging 
}) => {
  const [showDetailedViewer, setShowDetailedViewer] = useState(false);
  
  const searchStarted = updates.find(update => update.event_type === 'search_started');
  const searchComplete = updates.find(update => update.event_type === 'search_complete');
  const organicResults = updates.filter(update => update.event_type === 'organic_results_batch');
  const searchCompleted = updates.find(update => update.event_type === 'search_completed');
  
  const query = searchStarted?.data?.query || searchComplete?.data?.query || 'Web Search';
  const allResults = searchComplete?.data?.results || organicResults.flatMap(update => update.data.organic_results || []);
  const isComplete = !!searchCompleted || !!searchComplete;
  
  const getTitle = () => {
    if (isComplete) return `Search Results for "${query}"`;
    return `Searching for "${query}"`;
  };

  const handleCardClick = () => {
    if (!isDragging) {
      setShowDetailedViewer(true);
    }
  };

  // Get domain from URL
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Get favicon URL - prefer the one from result data, fallback to Google
  const getFavicon = (result: any) => {
    if (result.favicon) {
      return result.favicon;
    }
    try {
      const domain = new URL(result.link || result.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return undefined;
    }
  };

  return (
    <>
      <div className="w-full">
        <h2 className={`text-lg font-semibold mb-4 ${isActive ? "text-gray-900" : "text-gray-400"} tracking-tight`}>
          {getTitle()}
        </h2>
        
        <div className="relative h-[320px] w-full">
          {isComplete && allResults.length > 0 ? (
            <motion.div 
              className="absolute inset-0 cursor-pointer"
              onClick={handleCardClick}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Single card with multiple results */}
              <div className="h-full bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Costar found these results for you</h3>
                      <p className="text-xs text-gray-500">Today • {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Results list - more compact */}
                <div className="flex-1 overflow-y-auto">
                  {allResults.slice(0, 5).map((result: any, index: number) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Favicon/Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {result.thumbnail ? (
                          <img 
                            src={result.thumbnail} 
                            alt="thumbnail" 
                            className="w-6 h-6 rounded object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : getFavicon(result) ? (
                          <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center p-1">
                            <img 
                              src={getFavicon(result)} 
                              alt="favicon" 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                            <Globe className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">
                          {result.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1 leading-relaxed">
                          {result.snippet || result.description}
                        </p>
                        <span className="text-xs text-gray-500">
                          {getDomain(result.link || result.url)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                {allResults.length > 5 && (
                  <div className="p-3 bg-gray-50 text-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{allResults.length - 5} more results • Click to view all
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            // Loading state
            <motion.div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
              <div className="h-full flex flex-col items-center justify-center p-6">
                <div className="relative w-16 h-16 mb-6">
                  {/* Animated search rings */}
                  <div className="absolute inset-0 rounded-full border-3 border-blue-200"></div>
                  <div className="absolute inset-0 rounded-full border-3 border-blue-500 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-3 border-blue-300 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDelay: '0.3s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Searching the web</h3>
                <p className="text-sm text-blue-700 text-center mb-4 max-w-xs">
                  Finding the most relevant results for <span className="font-medium">"{query}"</span>
                </p>
                
                {organicResults.length > 0 && (
                  <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium">
                      Found {organicResults.reduce((acc, update) => acc + (update.data.organic_results?.length || 0), 0)} results so far...
                    </div>
                  </div>
                )}
                
                {/* Animated dots */}
                <div className="flex space-x-1 mt-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detailed Viewer */}
      <WebSearchDetailedViewer
        updates={updates}
        isOpen={showDetailedViewer}
        onClose={() => setShowDetailedViewer(false)}
      />
    </>
  );
};

export default WebSearchSwiperItem; 