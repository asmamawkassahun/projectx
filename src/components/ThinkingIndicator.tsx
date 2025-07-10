import React from 'react';
import { motion } from 'framer-motion';
import { LoadingDots } from '@/components/ui';

const ThinkingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4 px-4"
    >
      <div className="flex items-center gap-2 text-gray-700">
        <LoadingDots text="Thinking" size="sm" variant="default" />
      </div>
    </motion.div>
  );
};

export default ThinkingIndicator; 