import React from 'react';
import { motion } from 'framer-motion';

interface VideoItem {
  position: number;
  title: string;
  link: string;
  thumbnail?: string;
  channel?: string;
  duration?: string;
  platform?: string;
  date?: string;
}

interface InlineVideosProps {
  data: VideoItem[];
  title?: string;
}

const InlineVideos: React.FC<InlineVideosProps> = ({ data, title = 'Videos' }) => {
  return (
    <div className="mb-6">
      <h3 className="text-gray-800 dark:text-gray-200 text-sm font-medium mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
        {title} <span className="text-xs text-gray-500 dark:text-gray-400">({data.length})</span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((video, index) => (
          <motion.a
            key={index}
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                </div>
              )}
              
              {/* Duration badge */}
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 dark:bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
              )}
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 dark:bg-black/70 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Video details */}
            <div className="p-3 flex-1 flex flex-col">
              <h4 className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 text-sm font-medium line-clamp-2 mb-1">
                {video.title}
              </h4>
              
              <div className="mt-auto flex justify-between items-center text-xs">
                <div className="text-gray-700 dark:text-gray-300">
                  {video.channel}
                </div>
                
                <div className="flex gap-3 text-gray-500 dark:text-gray-400">
                  {video.platform && (
                    <span>{video.platform}</span>
                  )}
                  {video.date && (
                    <span>{video.date}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default InlineVideos; 