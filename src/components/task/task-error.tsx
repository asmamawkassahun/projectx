import { motion } from "framer-motion";
import React from "react";

type Props = {};

export const TaskError = (props: Props) => {
  return (
    <motion.div
      key="failed"
      className="flex flex-col items-center justify-center h-full text-center"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Task Stopped
        </h3>
        <p className="text-gray-600 mb-4">
          The agent has been stopped and the task execution has been halted.
        </p>
        <p className="text-sm text-gray-500">
          You can start a new conversation to begin a different task.
        </p>
      </div>
    </motion.div>
  );
};
