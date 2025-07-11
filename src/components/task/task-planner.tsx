"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

interface PlanStep {
  number: string
  title: string
  subtitle: string
}

interface TaskPlannerProps {
  steps?: string[]
  setViewMode: (viewMode: "planner" | "execution") => void
}

export default function TaskPlanner({
  steps = [],
  setViewMode,
}: TaskPlannerProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [showIntro, setShowIntro] = useState(true)
  const [showPlanTitle, setShowPlanTitle] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  // Convert dynamic steps to PlanStep format
  const planSteps: PlanStep[] = steps.map((step, index) => {
    // Split step into title and subtitle if possible
    const parts = step.split(' - ');
    const title = parts[0] || step;
    const subtitle = parts[1] || '';
    
    return {
      number: String(index + 1).padStart(2, '0'),
      title: title.length > 30 ? title.substring(0, 30) + '...' : title,
      subtitle: subtitle.length > 40 ? subtitle.substring(0, 40) + '...' : subtitle,
    };
  });

  // Animation sequence
  useEffect(() => {
    if (planSteps.length === 0) return;

    // Show intro message
    const introTimer = setTimeout(() => {
      // Show plan title and timeline container together
      setShowPlanTitle(true)

      // Show timeline with a slight delay after title starts appearing
      setTimeout(() => {
        setShowTimeline(true)

        // Start revealing steps after timeline is visible
        setTimeout(() => {
          // Show first step immediately with timeline
          setVisibleSteps([0])

          // Then continue with the rest of the steps
          const interval = setInterval(() => {
            setVisibleSteps((prev) => {
              const nextStep = prev.length
              if (nextStep < planSteps.length) {
                setActiveStepIndex(nextStep)
                return [...prev, nextStep]
              } else {
                clearInterval(interval)
                // Call setViewMode to switch to execution after all steps are shown
                setTimeout(() => setViewMode("execution"), 2000)
                return prev
              }
            })
          }, 1200)

          return () => clearInterval(interval)
        }, 300)
      }, 200)
    }, 2000)

    return () => {
      clearTimeout(introTimer)
    }
  }, [planSteps.length, setViewMode])

  return (
    <div className="flex flex-col items-center justify-center h-full absolute inset-0 z-20">
      {/* Confirmation message */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-[#1e1e1e]/70 max-w-lg px-4"
          >
            {/* Message can be customized here if needed */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan title and timeline container */}
      <motion.div
        className="flex flex-col items-center justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: showPlanTitle ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Plan title */}
        <motion.div
          className="mb-16 text-center"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-medium text-[#1e1e1e] tracking-tight">Here's the plan I've created...</h2>
        </motion.div>

        {/* Creative Modern Steps Timeline */}
        {showTimeline && (
          <motion.div
            className="w-full max-w-4xl px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#1e1e1e]/3 to-transparent opacity-30 blur-3xl"></div>
                <div className="absolute bottom-[20%] right-[15%] w-[250px] h-[250px] rounded-full bg-gradient-to-l from-[#1e1e1e]/3 to-transparent opacity-20 blur-3xl"></div>
              </div>

              {/* Main connecting line with gradient */}
              <div className="absolute top-[60px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1e1e1e]/15 to-transparent rounded-full z-0" />

              {/* Animated progress line */}
              <motion.div
                className="absolute top-[60px] left-0 h-[2px] bg-gradient-to-r from-[#1e1e1e]/40 to-[#1e1e1e]/80 rounded-full z-1"
                initial={{ width: "0%" }}
                animate={{
                  width: `${Math.min(100, (activeStepIndex / (planSteps.length - 1)) * 100)}%`,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              <div className="flex justify-between items-start">
                {/* Steps */}
                {planSteps.map((step, index) => {
                  const isVisible = visibleSteps.includes(index)
                  const isActive = activeStepIndex === index
                  const isPast = index < activeStepIndex
                  const isFuture = index > activeStepIndex

                  return (
                    <div
                      key={index}
                      className={`relative z-10 flex flex-col items-center w-1/5 px-2 transition-all duration-300 ${
                        isActive ? "scale-110" : ""
                      }`}
                    >
                      <AnimatePresence>
                        {isVisible && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.1,
                              type: "spring",
                              stiffness: 200,
                            }}
                            className="flex flex-col items-center w-full"
                          >
                            {/* Step number with floating animation */}
                            <motion.div
                              className={`mb-2 text-sm font-medium ${
                                isActive
                                  ? "text-[#1e1e1e]"
                                  : isPast
                                    ? "text-[#1e1e1e]/80"
                                    : "text-[#1e1e1e]/40"
                              } tracking-tight`}
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                y: isActive ? [0, -3, 0] : 0,
                              }}
                              transition={{
                                delay: 0.2,
                                y: {
                                  duration: 2,
                                  repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                                  repeatType: "reverse",
                                },
                              }}
                            >
                              {step.number}
                            </motion.div>

                            {/* Step indicator with creative design */}
                            <div className="relative mb-6">
                              {/* Outer glow for active step */}
                              {isActive && (
                                <motion.div
                                  className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#1e1e1e]/5 to-[#1e1e1e]/10 blur-md"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                />
                              )}

                              {/* Main indicator */}
                              <motion.div
                                className={`relative w-[40px] h-[40px] rounded-full flex items-center justify-center
                                  ${
                                    isPast
                                      ? "bg-[#1e1e1e] text-white shadow-md"
                                      : isActive
                                        ? "bg-white border-2 border-[#1e1e1e] shadow-lg"
                                        : "bg-white border border-[#1e1e1e]/20"
                                  }`}
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{
                                  scale: 1,
                                  rotate: 0,
                                  boxShadow: isActive
                                    ? [
                                        "0 0 0 rgba(30,30,30,0.1)",
                                        "0 0 15px rgba(30,30,30,0.2)",
                                        "0 0 0 rgba(30,30,30,0.1)",
                                      ]
                                    : undefined,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                  boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                                }}
                                whileHover={{ scale: 1.1 }}
                              >
                                {isPast && <Check className="w-5 h-5" />}

                                {isActive && (
                                  <motion.div
                                    className="w-4 h-4 bg-[#1e1e1e] rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Number.POSITIVE_INFINITY,
                                      repeatType: "reverse",
                                    }}
                                  />
                                )}

                                {/* Horizontal line through active indicator */}
                                {isActive && (
                                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#1e1e1e]/10" />
                                )}
                              </motion.div>

                              {/* Animated ring for active step */}
                              {isActive && (
                                <motion.div
                                  className="absolute -inset-1 rounded-full border-2 border-[#1e1e1e]/40"
                                  initial={{ opacity: 0.8, scale: 1 }}
                                  animate={{
                                    opacity: [0.8, 0.2, 0.8],
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 180, 360],
                                  }}
                                  transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "loop",
                                  }}
                                />
                              )}
                            </div>

                            {/* Step text with improved typography and animations */}
                            <motion.div
                              className={`text-center transition-all duration-300 ${
                                isFuture ? "opacity-40" : "opacity-100"
                              }`}
                              initial={{ y: 10, opacity: 0 }}
                              animate={{
                                y: 0,
                                opacity: isFuture ? 0.4 : 1,
                                x: isActive ? [0, 2, -2, 0] : 0,
                              }}
                              transition={{
                                delay: 0.3,
                                duration: 0.4,
                                x: {
                                  duration: 0.5,
                                  delay: 1,
                                  times: [0, 0.2, 0.8, 1],
                                  repeat: isActive ? 1 : 0,
                                },
                              }}
                            >
                              <div
                                className={`text-sm font-medium mb-1 ${
                                  isActive
                                    ? "text-[#1e1e1e]"
                                    : isPast
                                      ? "text-[#1e1e1e]"
                                      : "text-[#1e1e1e]/60"
                                } tracking-tight`}
                              >
                                {step.title}
                              </div>
                              <div
                                className={`text-xs ${
                                  isActive
                                    ? "text-[#1e1e1e]/70"
                                    : "text-[#1e1e1e]/50"
                                } tracking-tight`}
                              >
                                {step.subtitle}
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Creative loader for next step */}
                      <AnimatePresence>
                        {!isVisible && index === visibleSteps.length && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                            transition={{ duration: 0.4 }}
                            className="absolute top-[40px]"
                          >
                            <div className="relative w-10 h-10">
                              {/* Outer spinning ring */}
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-[#1e1e1e]/10 border-t-[#1e1e1e]/40 border-r-[#1e1e1e]/30"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              />

                              {/* Inner spinning ring - opposite direction */}
                              <motion.div
                                className="absolute inset-[3px] rounded-full border-2 border-[#1e1e1e]/20 border-b-[#1e1e1e]/50 border-l-[#1e1e1e]/40"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              />

                              {/* Center dot with pulse */}
                              <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                              >
                                <div className="w-2 h-2 rounded-full bg-[#1e1e1e]/60" />
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
