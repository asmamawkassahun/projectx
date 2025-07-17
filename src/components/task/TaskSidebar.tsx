"use client";

import { useTasksSteps } from "@/contexts/TasksStepsContext";
import { StopResponse } from "../icons/StopResponse"; // Assuming this path is correct
import Button from "../ui/Button"; // Assuming this is your custom Button component
import { cn } from "@/lib/utils"; // Import cn for conditional class names

interface TaskSidebarProps {
  onStopTask: () => void; // Add prop for stopping the task
}

export const TaskSidebar = ({ onStopTask }: TaskSidebarProps) => {
  const { steps, activeStep, setActiveStep } = useTasksSteps(); // Destructure setActiveStep

  console.log("TaskSidebar steps:", JSON.stringify(steps, null, 2));
  console.log("TaskSidebar activeStep:", activeStep);

  const handleStopResponse = () => {
    console.log("Stopping response...");
    onStopTask(); // Call the passed function to stop the task
  };

  const handleStepClick = (index: number) => {
    console.log(`Clicked step ${index + 1}`);
    setActiveStep(index); // Update the active step in the context
  };

  // Determine the indices of the steps to display: previous, active, and next
  const prevStep = activeStep > 0 ? steps[activeStep - 1] : null;
  const currentStep = steps[activeStep];
  const nextStep = activeStep < steps.length - 1 ? steps[activeStep + 1] : null;

  return (
    <div className="flex flex-col justify-center items-center px-5 space-y-2.5 bg-[#0A0A0A] h-[100vh] w-[5.25rem] flex-shrink-0">
      {/* Button for stopping response */}
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
        {/* Previous Step Button */}
        {prevStep && (
          <Button
            onClick={() => handleStepClick(activeStep - 1)}
            variant="primary"
            size="sm"
            aria-label={`Previous Step ${activeStep}`}
            className="w-[2.125rem] h-[2.125rem] bg-[#262626] text-white"
          >
            {activeStep-1}
          </Button>
        )}

        {/* Active Step Button */}
        {currentStep && (
          <div className="relative flex justify-center items-center">
            {/* Arc for processing state */}
            {currentStep.status === "processing" && (
              <div className="absolute w-[48px] h-[48px] rounded-full border-2 border-transparent border-t-gray-400 border-r-gray-400 animate-spin" />
            )}
            <Button
              onClick={() => handleStepClick(activeStep)}
              variant="primary"
              size="md"
              aria-label={`Current Step ${activeStep + 1}`}
              className={cn(
                "bg-background hover:bg-background/80 text-foreground text-2xl font-medium leading-[125%] text-center",
                // Add a border to the active step to make it more prominent
                currentStep.status === "processing"
                  ? "border-2 border-gray-400"
                  : ""
              )}
            >
              {activeStep}
            </Button>
          </div>
        )}

        {/* Next Step Button */}
        {nextStep && (
          <Button
            onClick={() => handleStepClick(activeStep + 1)}
            variant="primary"
            size="md"
            aria-label={`Next Step ${activeStep + 2}`}
            className="backdrop:blur-lg rounded-full opacity-40 text-lg font-medium leading-[125%] text-center"
          >
            {activeStep + 1}
          </Button>
        )}
      </div>
    </div>
  );
};
