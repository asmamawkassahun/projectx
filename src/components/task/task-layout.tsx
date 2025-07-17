import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTasksSteps } from "@/contexts/TasksStepsContext";

type Props = {
  children: React.ReactNode;
  step: number;
  stepTitle: string;
};

export const TaskLayout = ({ step, stepTitle, children }: Props) => {
  return (
    <div className="flex flex-col justify-center w-full gap-[64px] max-w-[689px] mx-auto">
      <h1 className="font-bold text-[32px] leading-[110%] tracking-normal">
        {stepTitle}
      </h1>
      <div className="relative flex-none w-fit">
        {/* Drawing the circle around with ::after to not mess with the layout */}
        <p className="relative font-semibold text-[24px] after:absolute after:inset-0 after:-z-10 after:w-[64px] after:h-[64px] after:rounded-full after:border after:border-white/10 after:left-1/2  after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']">
          {step}
        </p>
      </div>

      {children}
    </div>
  );
};
