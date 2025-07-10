import React from 'react';
import { motion } from 'framer-motion';

interface OrganicResult {
  position: number;
  title: string;
  link: string;
  displayed_link: string;
  snippet: string;
  favicon?: string;
  thumbnail?: string;
}

interface OrganicResultsProps {
  data: OrganicResult[];
}

const OrganicResults: React.FC<OrganicResultsProps> = ({ data }) => {
  // Sort results by position if available
  const sortedResults = [...data].sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="mb-6">
      <h3 className="text-zinc-200 text-sm font-medium mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        Web Results <span className="text-xs text-zinc-400">({data.length})</span>
      </h3>
      
      <div className="space-y-4">
        {sortedResults.map((result, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30 hover:border-zinc-600/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              {result.favicon && (
                <img 
                  src={result.favicon} 
                  alt={`${result.title} favicon`}
                  className="w-4 h-4 rounded-sm object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="text-xs text-zinc-400 truncate">{result.displayed_link || result.link}</div>
            </div>
            
            <div className="flex gap-3">
              {result.thumbnail && (
                <div className="flex-shrink-0 hidden sm:block">
                  <img 
                    src={result.thumbnail} 
                    alt={result.title}
                    className="w-16 h-16 object-contain rounded-md bg-zinc-900/50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <a 
                  href={result.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline font-medium text-sm block mb-1"
                >
                  {result.title}
                </a>
                
                <p className="text-zinc-300 text-xs line-clamp-3">
                  {result.snippet}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrganicResults; 