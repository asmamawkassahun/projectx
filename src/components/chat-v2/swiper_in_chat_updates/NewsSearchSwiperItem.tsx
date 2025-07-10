import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { BaseSwiperItemProps } from './types';

const NewsSearchSwiperItem: React.FC<BaseSwiperItemProps> = ({ 
  updates, 
  isActive, 
  isDragging 
}) => {
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(update => update.event_type === 'search_complete');
  const errorUpdate = updates.find(update => update.event_type === 'search_error');
  const newsResultsUpdate = updates.find(update => update.event_type === 'news_results');
  
  // Extract search data
  const searchData = searchCompleteUpdate?.data || newsResultsUpdate?.data || latestUpdate?.data || {};
  const { query, news = [], total_results } = searchData;
  
  // Get the first few news articles to display
  const displayNews = news.slice(0, 3);
  
  // Format time ago
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getTitle = () => {
    if (searchCompleteUpdate || newsResultsUpdate) return 'News Search Results';
    if (errorUpdate) return 'News Search Failed';
    return 'Searching News';
  };

  return (
    <div className="w-full">
      <h2 className={`text-lg font-semibold mb-4 ${isActive ? "text-gray-900" : "text-gray-400"} tracking-tight`}>
        {getTitle()}
      </h2>
      
      <div className="relative h-[320px] w-full">
        {(searchCompleteUpdate || newsResultsUpdate) ? (
          // Show search results
          <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-lg">
            <div className="h-full flex flex-col">
              {/* Search info header */}
              {query && (
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Newspaper className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900 line-clamp-1">
                        "{query}"
                      </span>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {total_results || news.length} articles
                    </span>
                  </div>
                </div>
              )}
              
              {/* News list */}
              <div className="flex-1 overflow-y-auto">
                {displayNews.length > 0 ? (
                  <div className="space-y-3 p-4">
                    {displayNews.map((article: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 mr-2">
                            {article.title}
                          </h3>
                          {article.link && (
                            <button 
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                              title="Read full article"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        
                        {article.snippet && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {article.snippet}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-3">
                            {article.source && (
                              <span className="font-medium">{article.source}</span>
                            )}
                            {article.published_date && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(article.published_date)}</span>
                              </div>
                            )}
                          </div>
                          
                          {article.category && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                              {article.category}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                      <Newspaper className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No news articles found</p>
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
                  {total_results && total_results > displayNews.length && (
                    <button className="text-xs text-gray-600 hover:text-gray-800 underline">
                      View all {total_results} articles
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
                {errorUpdate.data.error || 'An error occurred while searching for news'}
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
              {/* Animated news icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Newspaper className="w-8 h-8 text-gray-400" />
                </div>
                {/* Animated search rings */}
                <div className="absolute inset-0 rounded-lg">
                  <div className="absolute inset-0 rounded-lg border-2 border-gray-300 animate-ping"></div>
                  <div className="absolute inset-2 rounded-lg border-2 border-gray-400 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              
              <h3 className="text-base font-medium text-gray-900 mb-2">Searching News</h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                Finding latest news articles...
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
                  <div className="h-full rounded-full bg-gray-400 animate-pulse" style={{ width: '75%' }} />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500">Searching articles...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewsSearchSwiperItem; 