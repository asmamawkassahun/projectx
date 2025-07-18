"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useTasksSteps } from "@/contexts/TasksStepsContext";
import { TaskLayout } from "./task-layout";

interface PlanStep {
  number: string;
  title: string;
  subtitle: string;
}

interface TaskPlannerProps {
  setViewMode: (viewMode: "planner" | "execution") => void;
}

export default function TaskPlanner({ setViewMode }: TaskPlannerProps) {
  const { steps } = useTasksSteps();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [showPlanTitle, setShowPlanTitle] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);

  useEffect(() => {
    // DEBUG for now
    setTimeout(() => {
      setViewMode("execution");
    }, 5000);
  }, []);

  // Convert dynamic steps to PlanStep format
  const planSteps: PlanStep[] = steps.map((step, index) => {
    // Split step into title and subtitle if possible

    const parts = step.name?.split(" - ");
    const title = parts[0] || step.name;
    const subtitle = parts[1] || "";

    return {
      number: String(index + 1).padStart(2, "0"),
      title: title.length > 30 ? title.substring(0, 30) + "..." : title,
      subtitle:
        subtitle.length > 40 ? subtitle.substring(0, 40) + "..." : subtitle,
    };
  });

  return (
    <AnimatePresence>
      {/* Confirmation message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TaskLayout step={0} stepTitle="Creating a task plan">
          <div className="flex flex-col gap-8 max-w-[453px]">
            <p className="font-semibold text-[20px] leading-[125%] tracking-normal">
              OK, I'll help you process your video with advanced AI enhancement.
            </p>
            <p className="font-medium text-[14px] leading-[135%] tracking-[4%]">
              I'm executing a sophisticated multi-stage AI pipeline for your
              video processing task. This involves advanced neural networks,
              real-time optimization, and enterprise-grade quality assurance to
              deliver professional results.
            </p>
          </div>
        </TaskLayout>
      </motion.div>
    </AnimatePresence>
  );
}
