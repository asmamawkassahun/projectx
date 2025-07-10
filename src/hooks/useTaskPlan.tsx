import { useState, useEffect } from 'react';
import { Task } from '@/types/voice-agent';

type StepStatus = 'pending' | 'processing' | 'completed' | 'failed';

export const useTaskPlan = () => {
  const [taskPlan, setTaskPlan] = useState<Task[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showPlanInCenter, setShowPlanInCenter] = useState(true);
  const [planVisible, setPlanVisible] = useState(false);

  // Update task plan with new plan
  const updateTaskPlan = (plan: string[]) => {
    setTaskPlan(plan.map((step: string) => ({
      step, 
      status: 'pending' as StepStatus
    })));
  };

  // Update step status
  const updateStepStatus = (stepIndex: number, status: StepStatus) => {
    setTaskPlan(prevPlan => {
      if (!prevPlan || prevPlan.length === 0) return prevPlan;
      
      const newPlan = [...prevPlan];
      
      if (stepIndex >= 0 && stepIndex < newPlan.length) {
        newPlan[stepIndex] = {
          ...newPlan[stepIndex],
          status
        };
        
        // If a step is processing, update currentStep
        if (status === 'processing') {
          setCurrentStep(stepIndex);
        }
      }
      
      return newPlan;
    });
  };

  // Effect to handle plan visibility and animation
  useEffect(() => {
    if (taskPlan.length > 0) {
      setPlanVisible(true);
      
      // After a delay, move the plan up
      const timer = setTimeout(() => {
        setShowPlanInCenter(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [taskPlan]);

  // Reset task plan
  const resetTaskPlan = () => {
    setTaskPlan([]);
    setPlanVisible(false);
    setShowPlanInCenter(true);
    setCurrentStep(0);
  };

  return {
    taskPlan,
    currentStep,
    showPlanInCenter,
    planVisible,
    updateTaskPlan,
    updateStepStatus,
    resetTaskPlan
  };
}; 