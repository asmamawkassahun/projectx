import React from 'react';
import { motion } from 'framer-motion';

interface NewsItem {
  position: number;
  title: string;
  link: string;
  source: string;
  date: string;
  snippet?: string;
  thumbnail?: string;
  favicon?: string;
}

interface NewsResultsProps {
  data: NewsItem[];
}

const NewsResults: React.FC<NewsResultsProps> = ({ data }) => {
  // Sort results by position if available
  const sortedResults = [...data].sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="mb-4">
      <h3 className="text-indigo-800 text-sm font-medium mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
          <path d="M18 14h-8"></path>
          <path d="M15 18h-5"></path>
          <path d="M10 6h8v4h-8V6Z"></path>
        </svg>
        News Results <span className="text-xs text-indigo-500">({data.length})</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedResults.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white border border-indigo-100 hover:border-indigo-200 rounded-lg overflow-hidden flex flex-col transition-colors shadow-sm hover:shadow"
          >
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex h-full"
            >
              <div className="flex flex-col flex-1 p-3">
                <div className="flex items-center gap-2 mb-1">
                  {item.favicon && (
                    <img 
                      src={item.favicon} 
                      alt={`${item.source} favicon`}
                      className="w-4 h-4 rounded-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex items-center text-xs">
                    <span className="text-indigo-700">{item.source}</span>
                    {item.date && (
                      <>
                        <span className="mx-1 text-indigo-300">•</span>
                        <span className="text-indigo-500">{item.date}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <h4 className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-1 line-clamp-2 transition-colors">
                  {item.title}
                </h4>
                
                <div className="flex gap-3 flex-1">
                  <div className="flex-1">
                    {item.snippet && (
                      <p className="text-indigo-700 text-xs line-clamp-3">
                        {item.snippet}
                      </p>
                    )}
                  </div>
                  
                  {item.thumbnail && (
                    <div className="flex-shrink-0 w-16 h-16">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md border border-indigo-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NewsResults; 