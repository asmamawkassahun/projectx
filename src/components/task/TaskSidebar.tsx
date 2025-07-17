"use client";

import { useTasksSteps } from "@/contexts/TasksStepsContext";
import { StopResponse } from "../icons/StopResponse";
import Button from "../ui/Button";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TaskSidebarProps {
  onStopTask: () => void;
}

export const TaskSidebar = ({ onStopTask }: TaskSidebarProps) => {
  const { steps, activeStep, setActiveStep } = useTasksSteps();
  const [prevActiveStep, setPrevActiveStep] = useState<number>(activeStep);

  useEffect(() => {
    if (activeStep !== prevActiveStep) {
      setPrevActiveStep(activeStep);
    }
  }, [activeStep]);

  const handleStopResponse = () => onStopTask();
  const handleStepClick = (index: number) => setActiveStep(index);

  // Boundary checks
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  const currentStep = steps[activeStep];

  return (
    <div className="flex flex-col justify-center items-center px-5 space-y-2.5 bg-[#0A0A0A] h-[100vh] w-[5.25rem] flex-shrink-0">
      <Button
        onClick={handleStopResponse}
        variant="primary"
        size="md"
        aria-label="Stop Response"
        className="bg-[#262626] hover:bg-[#333333]"
      >
        <StopResponse />
      </Button>

      <div className="flex flex-col items-center gap-2 mt-8">
        {!isFirstStep && (
          <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 0.9, opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              onClick={() => handleStepClick(activeStep - 1)}
              variant="primary"
              size="sm"
              aria-label={`Previous Step ${activeStep - 1}`}
              className="w-[2.125rem] h-[2.125rem] bg-[#262626] backdrop:blur-lg text-lg font-medium leading-[125%] text-center text-white"
            >
              {activeStep - 1}
            </Button>
          </motion.div>
        )}

        <motion.div
          layout
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: 1.1,
            opacity: 1,
            boxShadow:
              currentStep?.status === "processing"
                ? "0 0 0 4px #60a5fa"
                : "none",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative flex justify-center items-center"
        >
          {currentStep?.status === "processing" && (
            <motion.div
              className="absolute w-[48px] h-[48px] rounded-full border-2 border-transparent border-t-gray-400 border-r-gray-400"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          )}
          <Button
            onClick={() => handleStepClick(activeStep)}
            variant="primary"
            size="md"
            aria-label={`Current Step ${activeStep + 1}`}
            className={cn(
              "bg-background hover:bg-background/80 text-foreground text-2xl font-medium leading-[125%] text-center",
              currentStep?.status === "processing" &&
                "border-2 border-gray-400 "
            )}
          >
            {activeStep}
          </Button>
        </motion.div>

        {!isLastStep && (
          <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0.3 }}
            animate={{ scale: 0.9, opacity: 0.4 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              onClick={() => handleStepClick(activeStep + 1)}
              variant="primary"
              size="md"
              aria-label={`Next Step ${activeStep + 1}`}
              className="backdrop:blur-lg rounded-full text-lg font-medium leading-[125%] text-center"
            >
              {activeStep + 1}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
