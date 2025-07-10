"use client"

import { motion, AnimatePresence } from "framer-motion"

interface TaskStep {
  step: string
  status: string
}

interface TaskStatusProps {
  viewMode: "planner" | "execution"
  isLoading: boolean
  currentStep: number
  steps: TaskStep[]
  acknowledgmentMessage: string
  hasReceivedLiveStatus: boolean
  currentLiveStatusParts: Array<{text: string, style: string}>
}

export default function TaskStatus({
  viewMode,
  isLoading,
  currentStep,
  steps,
  acknowledgmentMessage,
  hasReceivedLiveStatus,
  currentLiveStatusParts
}: TaskStatusProps) {
  
  // Function to render styled message parts
  const renderMessageParts = (parts: Array<{text: string, style: string}>) => {
    return parts.map((part, index) => {
      let className = "text-xs text-[#1e1e1e]/80";
      
      switch (part.style) {
        case 'url':
          className = "text-xs text-blue-600 font-medium";
          break;
        case 'query':
          className = "text-xs text-purple-600 font-medium";
          break;
        case 'command':
          className = "text-xs text-green-600 font-mono";
          break;
        case 'filename':
          className = "text-xs text-orange-600 font-medium";
          break;
        case 'task':
          className = "text-xs text-indigo-600 font-medium";
          break;
        case 'step':
          className = "text-xs text-cyan-600 font-medium";
          break;
        case 'success':
          className = "text-xs text-green-600 font-medium";
          break;
        case 'task-completed':
          className = "text-xs text-green-600 font-medium line-through";
          break;
        case 'step-completed':
          className = "text-xs text-green-600 font-medium";
          break;
        default:
          className = "text-xs text-[#1e1e1e]/80";
      }
      
      return (
        <span key={index} className={className}>
          {part.text}
        </span>
      );
    });
  };

  return (
    <div className="mt-4">
      {/* Status message */}
      <AnimatePresence mode="wait">
        {/* Show loading state when waiting for task plan */}
        {viewMode === "planner" && steps.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-gray-500 text-sm font-medium tracking-tight">
              Creating your task plan...
            </p>
          </motion.div>
        ) : hasReceivedLiveStatus && currentLiveStatusParts.length > 0 ? (
          <motion.div
            key="live-status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center"
          >
            <svg
              className="animate-spin w-4 h-4 text-[#1e1e1e] mr-3 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-xs text-[#1e1e1e]/80 text-center truncate tracking-tight">
              {renderMessageParts(currentLiveStatusParts)}
            </span>
          </motion.div>
        ) : acknowledgmentMessage && !hasReceivedLiveStatus ? (
          <motion.div
            key="acknowledgment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 text-[#1e1e1e] mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs text-[#1e1e1e]/80 text-center tracking-tight">
              {acknowledgmentMessage}
            </p>
          </motion.div>
        ) : viewMode === "execution" && steps.length > 0 && currentStep >= steps.length - 1 ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-gray-500 text-sm font-medium tracking-tight">
              I've completed the task! Here are the final files for your research
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
} 