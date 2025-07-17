// TO DO
// In this context we want to handle logic for :
// [] the active step, -> basic useState
// [] step length, -> basic useState
import { TaskStep } from "@/components/chat-v2/swiper_in_chat_updates/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TasksStepsContextType {
  steps: TaskStep[];
  setSteps: React.Dispatch<React.SetStateAction<TaskStep[]>>;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const TasksStepsContext = createContext<TasksStepsContextType | undefined>(
  undefined
);

export const TasksStepsProvider = ({ children }: { children: ReactNode }) => {
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <TasksStepsContext.Provider
      value={{ steps, setSteps, activeStep, setActiveStep }}
    >
      {children}
    </TasksStepsContext.Provider>
  );
};

export const useTasksSteps = () => {
  const context = useContext(TasksStepsContext);
  if (!context) {
    throw new Error("useTasksSteps must be used within a TasksStepsProvider");
  }
  return context;
};
