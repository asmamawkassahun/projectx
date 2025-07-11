"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface TaskStep {
  step: string;
  status: string;
}

interface TaskHeaderProps {
  currentStep: number;
  steps: TaskStep[];
  taskTitle?: string;
}

export default function TaskHeader({ currentStep, steps, taskTitle }: TaskHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Debug logging
  console.log("TaskHeader render:", { currentStep, stepsLength: steps.length, steps });

  // Use current step as title if no taskTitle provided and steps exist
  const displayTitle =
    taskTitle ||
    (steps.length > 0 && currentStep < steps.length ? steps[currentStep].step : "Task in Progress");

  return (
    <div className="relative">
      {/* Modern command interface */}
      <div className="relative">
        {/* Task header with modern centered design - all in single line */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-center py-2  group"
        >
          <span className="text-sm font-medium tracking-tight  truncate mr-3">{displayTitle}</span>

          <div className="flex items-center">
            <span className="text-xs text-white/60 tracking-wide uppercase font-medium">
              {currentStep + 1}/{steps.length}
            </span>

            {/* Toggle icon with modern animation */}
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="ml-2 w-5 h-5 flex items-center justify-center"
            >
              <ChevronDown className="w-4 h-4 text-white/70" />
            </motion.div>
          </div>
        </button>

        {/* Modern progress bar */}
        <div className="h-0.5 w-full mt-1 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-white"
            initial={{ width: 0 }}
            animate={{
              width: steps.length <= 1 ? "100%" : `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Dropdown menu - overlay style */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md border border-[#1e1e1e]/10 overflow-hidden z-50"
              style={{ transformOrigin: "top center" }}
            >
              <div className="py-1">
                {steps.map((stepObj, index) => (
                  <button
                    key={index}
                    className={`w-full py-2 px-3 text-xs flex items-center transition-colors duration-200 ${
                      index === currentStep
                        ? "bg-[#1e1e1e]/5 text-[#1e1e1e]"
                        : "hover:bg-[#1e1e1e]/5 text-[#1e1e1e]/70"
                    }`}
                    onClick={() => {
                      setIsDropdownOpen(false);
                    }}
                  >
                    {/* Status indicator based on step status */}
                    <div className="mr-3 w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {stepObj.status === "processing" ||
                      (index === currentStep && stepObj.status !== "completed") ? (
                        <svg
                          className="animate-spin w-4 h-4 text-[#1e1e1e]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : stepObj.status === "completed" ? (
                        <svg
                          className="w-4 h-4 text-[#1e1e1e]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#1e1e1e]/30"></div>
                      )}
                    </div>
                    <span className="truncate text-left">{stepObj.step}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
