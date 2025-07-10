import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface NewsItem {
  title: string;
  link: string;
  snippet?: string;
  source?: string;
  date?: string;
  thumbnail?: string;
}

interface NewsProps {
  data: NewsItem[];
}

const News: React.FC<NewsProps> = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-zinc-200 text-sm font-medium mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
          <path d="M18 14h-8"></path>
          <path d="M15 18h-5"></path>
          <path d="M10 6h8v4h-8V6Z"></path>
        </svg>
        News <span className="text-xs text-zinc-400">({data.length})</span>
      </h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700/30 hover:border-zinc-600/50 rounded-lg overflow-hidden flex"
          >
            {/* News thumbnail */}
            {item.thumbnail && (
              <div className="w-24 h-24 shrink-0 relative bg-zinc-900/50">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
                    (e.target as HTMLImageElement).parentElement!.innerHTML += `
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-600">
                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                        <path d="M18 14h-8"></path>
                        <path d="M15 18h-5"></path>
                        <path d="M10 6h8v4h-8V6Z"></path>
                      </svg>
                    `;
                  }}
                />
              </div>
            )}
            
            {/* News details */}
            <div className="p-3 flex-grow flex flex-col">
              <h4 className="text-zinc-200 text-sm font-medium line-clamp-2 mb-1">
                {item.title}
              </h4>
              
              {item.snippet && (
                <p className="text-zinc-400 text-xs line-clamp-2 mb-2">
                  {item.snippet}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-zinc-500 text-xs mt-auto">
                {item.source && (
                  <span className="font-medium">{item.source}</span>
                )}
                
                {item.date && (
                  <>
                    {item.source && (
                      <span className="inline-block w-1 h-1 bg-zinc-600 rounded-full"></span>
                    )}
                    <span>{formatDate(item.date)}</span>
                  </>
                )}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default News; 