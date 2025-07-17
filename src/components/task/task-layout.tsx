import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTasksSteps } from "@/contexts/TasksStepsContext";

type Props = {
  children: React.ReactNode;
};

export const TaskLayout = ({ children }: Props) => {
  const { steps, activeStep } = useTasksSteps();
  const [stepTitle, setStepTitle] = useState("");

  useEffect(() => {
    if (steps.length === 0) {
      setStepTitle("Creating a task plan");
    } else {
      setStepTitle(steps[activeStep]?.name);
    }
  }, [steps, activeStep]);

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.6,
      }}
      className="fixed inset-0 flex z-30 bg-black text-white"
    >
      {/* SIDE BAR */}
      <div className="bg-green-500">SIDE BAR</div>
      {/* MAIN CONTENT OF THE TASK */}
      <div className="flex flex-col justify-center w-full gap-[64px] max-w-[689px] mx-auto">
        <h1 className="font-bold text-[32px] leading-[110%] tracking-normal">
          {stepTitle}
        </h1>
        <div className="relative flex-none w-fit">
          {/* Drawing the circle around with ::after to not mess with the layout */}
          <p className="relative font-semibold text-[24px] after:absolute after:inset-0 after:-z-10 after:w-[64px] after:h-[64px] after:rounded-full after:border after:border-white/10 after:left-1/2  after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']">
            {activeStep}
          </p>
        </div>

        {children}
      </div>
    </motion.div>
  );
};
