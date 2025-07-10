"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Intent } from '@/hooks/use-intent-detection'

interface IntentFeedbackProps {
  intent: Intent | null
  isDetecting: boolean
  className?: string
}

const IntentFeedback: React.FC<IntentFeedbackProps> = ({
  intent,
  isDetecting,
  className = ""
}) => {
  // Always render the container, just control visibility
  const hasContent = intent !== null

  return (
    <motion.div
      animate={{
        height: hasContent ? 'auto' : 0,
        opacity: hasContent ? 1 : 0
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut"
      }}
      className="overflow-hidden"
    >
      {hasContent && (
        <motion.div
          initial={false}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          className={`flex items-center space-x-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm ${className}`}
        >
          {/* Icon with subtle animation */}
          <motion.div
            key={`${intent?.type}-${intent?.icon}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              duration: 0.3
            }}
            className="text-base flex-shrink-0"
          >
            {intent?.icon}
          </motion.div>
          
          {/* Feedback text with clean styling */}
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-1"
          >
            <motion.p
              key={intent?.feedback}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-xs text-gray-500 font-medium leading-relaxed"
            >
              {intent?.feedback}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default IntentFeedback 