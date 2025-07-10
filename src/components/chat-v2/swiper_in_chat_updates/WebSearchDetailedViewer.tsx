import React from 'react';
import { motion } from 'framer-motion';
import { X, Search, ExternalLink, AlertCircle, Globe, Clock } from 'lucide-react';
import { createPortal } from 'react-dom';
import { InChatUpdate } from './types';

interface WebSearchDetailedViewerProps {
  updates: InChatUpdate[];
  isOpen: boolean;
  onClose: () => void;
}

const WebSearchDetailedViewer: React.FC<WebSearchDetailedViewerProps> = ({
  updates,
  isOpen,
  onClose
}) => {
  // Extract search data from all relevant updates
  const searchStarted = updates.find(update => update.event_type === 'search_started');
  const searchComplete = updates.find(update => update.event_type === 'search_complete');
  const organicResults = updates.filter(update => update.event_type === 'organic_results_batch');
  const errorUpdate = updates.find(update => update.event_type === 'search_error');
  
  // Get query from any available source
  const query = searchStarted?.data?.query || searchComplete?.data?.query || 'Web Search';
  
  // Combine all results from different sources
  let allResults: any[] = [];
  
  // Get results from search_complete if available
  if (searchComplete?.data?.results) {
    allResults = searchComplete.data.results;
  } else {
    // Otherwise, get from organic_results_batch updates
    allResults = organicResults.flatMap(update => update.data.organic_results || []);
  }
  
  const total_results = searchComplete?.data?.total_results || allResults.length;
  const search_time = searchComplete?.data?.search_time;

  // Format domain
  const formatDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'Unknown domain';
    }
  };

  // Get favicon URL
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return null;
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
            {query && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>"{query}"</span>
                </div>
                {total_results && (
                  <span>• {total_results.toLocaleString()} results</span>
                )}
                {search_time && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>({search_time}s)</span>
                  </div>
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

        {allResults.length > 0 ? (
          /* Search Results */
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {allResults.map((result: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* URL and Domain */}
                      <div className="flex items-center space-x-2 mb-2">
                        {getFaviconUrl(result.link || result.url) && (
                          <img
                            src={getFaviconUrl(result.link || result.url)!}
                            alt=""
                            className="w-4 h-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                        <span className="text-sm text-green-700 font-medium">
                          {formatDomain(result.link || result.url)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 mb-2">
                        <a
                          href={result.link || result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {result.title}
                        </a>
                      </h3>

                      {/* Snippet */}
                      {(result.snippet || result.description) && (
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          {result.snippet || result.description}
                        </p>
                      )}
                    </div>

                    {/* Visit Button */}
                    <div className="ml-4">
                      <a
                        href={result.link || result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-sm">Visit</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : errorUpdate ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Search Failed</h3>
              <p className="text-red-600 mb-6">
                {errorUpdate.data.error || 'An error occurred while searching the web'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Searching Web</h3>
              <p className="text-gray-600">Finding relevant results...</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default WebSearchDetailedViewer; 