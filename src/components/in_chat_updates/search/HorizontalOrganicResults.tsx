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

interface HorizontalOrganicResultsProps {
  data: OrganicResult[];
}

const HorizontalOrganicResults: React.FC<HorizontalOrganicResultsProps> = ({ data }) => {
  // Sort results by position if available
  const sortedResults = [...data].sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="mb-2">
      <div 
        className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar" 
        style={{ 
          msOverflowStyle: 'none', /* IE and Edge */
          scrollbarWidth: 'none' /* Firefox */
        }}
      >
        {sortedResults.map((result, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.2) }}
            className="bg-white rounded-lg border border-indigo-100 hover:border-indigo-200 hover:shadow-sm transition-all flex-shrink-0 w-60"
          >
            <div className="p-2.5">
              {/* Link and favicon */}
              <div className="flex items-center gap-1 mb-1">
                {result.favicon && (
                  <img 
                    src={result.favicon} 
                    alt=""
                    className="w-3 h-3 rounded-sm object-contain flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="text-[10px] text-indigo-400 truncate">{result.displayed_link || result.link}</div>
              </div>

              {/* Title */}
              <a 
                href={result.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium text-xs block mb-1.5 line-clamp-2"
              >
                {result.title}
              </a>
              
              {/* Content layout with horizontal thumbnail */}
              <div className="flex items-start gap-2">
                {/* Snippet */}
                <p className="text-indigo-700 text-[10px] line-clamp-3 flex-1">
                  {result.snippet}
                </p>
                
                {/* Thumbnail - if available */}
                {result.thumbnail && (
                  <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-indigo-50">
                    <img 
                      src={result.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HorizontalOrganicResults; 