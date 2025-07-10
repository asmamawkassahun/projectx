import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task } from '@/types/voice-agent';

interface TaskPlanDisplayProps {
  taskPlan: Task[];
  currentStep: number;
  showPlanInCenter: boolean;
  planVisible: boolean;
}

const TaskPlanDisplay: React.FC<TaskPlanDisplayProps> = ({
  taskPlan,
  currentStep,
  showPlanInCenter,
  planVisible
}) => {
  // Don't render anything if there's no plan or if it shouldn't be visible
  if (taskPlan.length === 0 || !planVisible) return null;
  
  // Function to render task buttons with a + sign for the first item
  const renderTaskButtons = () => {
    return (
      <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
        {taskPlan.map((task, index) => (
          <div 
            key={index}
            className={cn(
              "py-2 px-6 rounded-full text-sm text-center flex items-center justify-center",
              index === currentStep && !showPlanInCenter
                ? "bg-indigo-100 border border-indigo-300 text-indigo-900"
                : "bg-gray-100 border border-gray-300 text-gray-800"
            )}
          >
            {index === 0 && <span className="mr-2">+</span>}
            <span>{task.step}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render the current step at the top when not showing in center
  const renderCurrentStep = () => {
    if (showPlanInCenter || currentStep >= taskPlan.length) return null;
    
    return (
      <motion.div 
        className="w-full flex justify-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-300 text-white py-3 px-8 rounded-full text-sm font-medium shadow-md flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 12H20.33" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{taskPlan[currentStep]?.step}</span>
          <motion.div 
            className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-white"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
    );
  };

  // Render the plan centered on screen
  const renderCenteredPlan = () => {
    if (!showPlanInCenter) return null;
    
    return (
      <>
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2 className="text-stone-400 text-sm">Here's the plan I've created...</h2>
        </motion.div>
        
        <motion.div
          className="flex-grow flex flex-col justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          {renderTaskButtons()}
        </motion.div>
      </>
    );
  };

  return (
    <>
      <AnimatePresence>
        {renderCurrentStep()}
      </AnimatePresence>
      
      <AnimatePresence>
        {renderCenteredPlan()}
      </AnimatePresence>
    </>
  );
};

export default TaskPlanDisplay; 