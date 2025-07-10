import React from 'react';
import { motion } from 'framer-motion';
import { StatusDot, Icon, Progress, CollapsiblePanel } from '@/components/ui';

interface Task {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface TaskProgressProps {
  tasks: Task[];
  currentStep: number;
  isPlanExpanded: boolean;
  toggleExpand: () => void;
}

const TaskProgress: React.FC<TaskProgressProps> = ({ 
  tasks, 
  currentStep, 
  isPlanExpanded, 
  toggleExpand 
}) => {
  // If no tasks, don't render anything
  if (tasks.length === 0) return null;
  
  const currentTask = currentStep < tasks.length ? tasks[currentStep] : null;

  // Map task status to StatusDot status
  const mapStatusToType = (status: 'pending' | 'processing' | 'completed' | 'failed') => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  // Create header for the collapsible panel
  const renderHeader = () => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">Task progress</span>
      </div>
      <span className="text-sm text-gray-500">{currentStep + 1} of {tasks.length}</span>
    </div>
  );

  return (
    <div className="flex-shrink-0 bg-gray-200/30 border-t border-gray-200">
      <div className="flex flex-col">
        {!isPlanExpanded && currentTask && (
          <div className="p-3 border-b border-gray-200">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={toggleExpand}
            >
              <div className="flex items-center gap-2">
                <Icon 
                  name={isPlanExpanded ? "chevron-up" : "chevron-down"} 
                  className="w-4 h-4 text-gray-500"
                />
                <span className="text-gray-700 font-medium">Task progress</span>
              </div>
              <span className="text-sm text-gray-500">{currentStep + 1} of {tasks.length}</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-3 mb-2">
                <StatusDot 
                  status={mapStatusToType(currentTask.status)} 
                  pulsing={currentTask.status === 'processing'} 
                />
                <span className="text-sm text-gray-700">{currentTask.step}</span>
              </div>
              <Progress 
                value={currentStep} 
                max={tasks.length}
                variant="success"
                size="sm"
              />
            </div>
          </div>
        )}

        {isPlanExpanded && (
          <div>
            <div 
              className="p-3 border-b border-gray-200 cursor-pointer"
              onClick={toggleExpand}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon 
                    name="chevron-up" 
                    className="w-4 h-4 text-gray-500"
                  />
                  <span className="text-gray-700 font-medium">Task progress</span>
                </div>
                <span className="text-sm text-gray-500">{currentStep + 1} of {tasks.length}</span>
              </div>
            </div>
            <motion.div 
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-3 bg-gray-200/20 max-h-64 overflow-y-auto">
                <ul className="space-y-3">
                  {tasks.map((task, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <StatusDot 
                        status={mapStatusToType(task.status)} 
                        pulsing={task.status === 'processing'} 
                        className="mt-1 flex-shrink-0"
                      />
                      <span className={`text-sm ${index === currentStep ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                        {task.step}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskProgress; 