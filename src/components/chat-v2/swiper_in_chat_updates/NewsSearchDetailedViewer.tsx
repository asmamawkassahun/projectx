import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, ExternalLink, Calendar, Clock, Filter, SortAsc, AlertCircle, Newspaper, Tag } from 'lucide-react';
import { createPortal } from 'react-dom';
import { InChatUpdate } from './types';

interface NewsSearchDetailedViewerProps {
  updates: InChatUpdate[];
  isOpen: boolean;
  onClose: () => void;
}

const NewsSearchDetailedViewer: React.FC<NewsSearchDetailedViewerProps> = ({
  updates,
  isOpen,
  onClose
}) => {
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'source'>('relevance');
  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'week' | 'month'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(update => update.event_type === 'search_complete');
  const errorUpdate = updates.find(update => update.event_type === 'search_error');
  
  // Extract news data
  const newsData = searchCompleteUpdate?.data || latestUpdate?.data || {};
  const { query, articles = [], total_results } = newsData;
  
  // Get unique sources for filter
  const uniqueSources: string[] = Array.from(new Set(articles.map((article: any) => article.source).filter(Boolean)));
  
  // Filter and sort articles
  const filteredArticles = articles
    .filter((article: any) => {
      // Time filter
      if (timeFilter !== 'all' && article.published_at) {
        const articleDate = new Date(article.published_at);
        const now = new Date();
        const diffTime = now.getTime() - articleDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        if (timeFilter === 'day' && diffDays > 1) return false;
        if (timeFilter === 'week' && diffDays > 7) return false;
        if (timeFilter === 'month' && diffDays > 30) return false;
      }
      
      // Source filter
      if (sourceFilter !== 'all' && article.source !== sourceFilter) return false;
      
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
        case 'source':
          return (a.source || '').localeCompare(b.source || '');
        default:
          return 0; // Keep original relevance order
      }
    });

  // Format time since publication
  const formatTimeSince = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch {
      return dateString;
    }
  };

  // Get category color
  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-100 text-gray-700';
    
    const colors: { [key: string]: string } = {
      'technology': 'bg-blue-100 text-blue-700',
      'business': 'bg-green-100 text-green-700',
      'politics': 'bg-red-100 text-red-700',
      'sports': 'bg-orange-100 text-orange-700',
      'entertainment': 'bg-purple-100 text-purple-700',
      'health': 'bg-pink-100 text-pink-700',
      'science': 'bg-indigo-100 text-indigo-700',
      'world': 'bg-yellow-100 text-yellow-700',
    };
    
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-700';
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
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">News Search Results</h2>
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
            {/* Filters and Sort */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'source')}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Date (Newest)</option>
                      <option value="source">Source</option>
                    </select>
                  </div>

                  {/* Time Filter */}
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value as 'all' | 'day' | 'week' | 'month')}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="all">All Time</option>
                      <option value="day">Past Day</option>
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                    </select>
                  </div>

                  {/* Source Filter */}
                  {uniqueSources.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="all">All Sources</option>
                        {uniqueSources.map((source: string) => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  Showing {filteredArticles.length} of {articles.length} articles
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredArticles.length > 0 ? (
                <div className="space-y-6">
                  {filteredArticles.map((article: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start space-x-4">
                        {/* Article Image */}
                        {article.image_url && (
                          <div className="flex-shrink-0">
                            <img
                              src={article.image_url}
                              alt={article.title}
                              className="w-32 h-24 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        {/* Article Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {article.title}
                              </h3>
                              
                              {/* Article Meta */}
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                {article.source && (
                                  <span className="font-medium">{article.source}</span>
                                )}
                                {article.author && (
                                  <span>by {article.author}</span>
                                )}
                                {article.published_at && (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatTimeSince(article.published_at)}</span>
                                  </div>
                                )}
                              </div>

                              {/* Categories/Tags */}
                              {article.category && (
                                <div className="flex items-center space-x-2 mb-3">
                                  <Tag className="w-3 h-3 text-gray-400" />
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                                    {article.category}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2 ml-4">
                              {article.url && (
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                  <span className="text-sm">Read Article</span>
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Article Description */}
                          {article.description && (
                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                              {article.description}
                            </p>
                          )}

                          {/* Additional Info */}
                          {(article.sentiment || article.relevance_score) && (
                            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                              {article.sentiment && (
                                <div className="flex items-center space-x-2 text-xs">
                                  <span className="text-gray-500">Sentiment:</span>
                                  <span className={`px-2 py-1 rounded-full font-medium ${
                                    article.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                    article.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {article.sentiment}
                                  </span>
                                </div>
                              )}
                              {article.relevance_score && (
                                <div className="text-xs text-gray-500">
                                  Relevance: {Math.round(article.relevance_score * 100)}%
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles match your filters</h3>
                  <p className="text-gray-600">Try adjusting your time range or source filters</p>
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
                {errorUpdate.data.error || 'An error occurred while searching for news'}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Searching News</h3>
              <p className="text-gray-600">Finding relevant articles...</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default NewsSearchDetailedViewer; 