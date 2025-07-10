import React from 'react';
import { motion } from 'framer-motion';

interface ShortVideo {
  title: string;
  link: string;
  thumbnail?: string;
  creator?: string;
  views?: string;
  platform?: string;
}

interface ShortVideosProps {
  data: ShortVideo[];
  title?: string;
}

const ShortVideos: React.FC<ShortVideosProps> = ({ data, title = 'Short Videos' }) => {
  return (
    <div className="mb-6">
      <h3 className="text-gray-800 dark:text-gray-200 text-sm font-medium mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
        {title} <span className="text-xs text-gray-500 dark:text-gray-400">({data.length})</span>
      </h3>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-3 min-w-max">
          {data.map((video, index) => (
            <motion.a
              key={index}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow flex-shrink-0 w-48"
            >
              {/* Thumbnail */}
              <div className="relative">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                  </div>
                )}
                
                {/* Platform badge */}
                {video.platform && (
                  <div className="absolute top-1 left-1 bg-black/70 dark:bg-white/20 text-white dark:text-white text-xs px-1 py-0.5 rounded text-[10px]">
                    {video.platform}
                  </div>
                )}
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 dark:bg-black/70 rounded-full p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Video details */}
              <div className="p-2">
                <h4 className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 text-xs font-medium line-clamp-2 mb-0.5">
                  {video.title}
                </h4>
                
                <div className="flex items-center justify-between text-[10px] mt-0.5">
                  <div className="text-gray-600 dark:text-gray-300 truncate max-w-[80px]">
                    {video.creator}
                  </div>
                  {video.views && (
                    <div className="text-gray-500 dark:text-gray-400 text-[10px]">
                      {video.views}
                    </div>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortVideos; 