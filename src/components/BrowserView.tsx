import React from 'react';
import { motion } from 'framer-motion';

interface BrowserViewProps {
  browserStreamUrl: string | null;
  userHasControl: boolean;
  onTakeControl: () => void;
  onFinishControl: () => void;
}

const BrowserView: React.FC<BrowserViewProps> = ({
  browserStreamUrl,
  userHasControl,
  onTakeControl,
  onFinishControl
}) => {
  if (!browserStreamUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <motion.div 
          className="text-center max-w-sm mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">Browser view</p>
          <p className="text-gray-500 text-sm">Will appear when needed</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <iframe 
        src={browserStreamUrl}
        className="w-full h-full border-0 bg-white"
        title="Browser View"
        style={{ 
          display: 'block',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
        sandbox="allow-same-origin allow-scripts"
        scrolling="auto"
      />
      
      {!userHasControl && (
        <motion.div 
          className="absolute inset-0 bg-transparent hover:bg-gradient-to-t hover:from-black/30 hover:to-transparent cursor-pointer group transition-all duration-300"
          onClick={onTakeControl}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div 
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <button 
              className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg 
                       border border-gray-300/50 hover:bg-gray-100 hover:border-gray-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
              </svg>
              Take Control
            </button>
          </div>
        </motion.div>
      )}

      {userHasControl && (
        <div className="flex-shrink-0 bg-white text-gray-700 p-3 flex justify-between items-center absolute bottom-0 left-0 right-0">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-medium">You have control</span>
          </div>
          <motion.button
            onClick={onFinishControl}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg 
                     transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Finish
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default BrowserView; 