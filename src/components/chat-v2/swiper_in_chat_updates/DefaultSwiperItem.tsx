import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { BaseSwiperItemProps } from './types';

interface DefaultSwiperItemProps extends BaseSwiperItemProps {
  tool: string;
}

const DefaultSwiperItem: React.FC<DefaultSwiperItemProps> = ({ 
  updates, 
  isActive, 
  tool 
}) => {
  return (
    <div className="w-full">
      <h2 className={`text-lg font-semibold mb-4 ${isActive ? "text-gray-900" : "text-gray-400"} tracking-tight`}>
        {tool.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </h2>
      
      <div className="relative h-[320px] w-full">
        <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-lg">
          <div className="h-full flex flex-col items-center justify-center p-6">
            <Search className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-base font-medium text-gray-600 mb-2">Processing {tool}</h3>
            <p className="text-sm text-gray-500 text-center">
              {updates.length} update{updates.length !== 1 ? 's' : ''} received
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DefaultSwiperItem; 