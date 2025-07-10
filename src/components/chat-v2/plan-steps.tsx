"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Define the plan steps
const planSteps = [
  "Choose destinations in Japan",
  "Research local cuisine spots with best reviews",
  "Find accommodation options",
  "Research best surf experiences in Tokyo",
  "Plan transportation between cities",
  "Create daily itinerary",
  "Book activities and experiences",
]

export function PlanSteps() {
  const [isOpen, setIsOpen] = useState(false)
  // Current active step (0-based index)
  const [activeStep, setActiveStep] = useState(3)

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="relative w-full max-w-sm">
      {/* Dropdown button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-5 py-2 bg-[#1e1e1e] rounded-full text-[#fff] transition-colors text-sm"
      >
        <span>Plan a 7 day Japan trip</span>
        {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
      </button>

      {/* Dropdown content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden"
          >
            <ul className="py-1">
              {planSteps.map((step, index) => (
                <li
                  key={index}
                  className={`px-4 py-1.5 cursor-pointer transition-colors text-sm ${
                    index === activeStep ? "bg-[#272727] text-[#fff]" : "text-[#fff]/70 hover:bg-[#272727]/50"
                  }`}
                  onClick={() => {
                    setActiveStep(index)
                    setIsOpen(false)
                  }}
                >
                  {step}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current processing step */}
      <div className="flex items-center mt-2 px-4 py-2 bg-[#1e1e1e]/10 rounded-full">
        <Loader2 className="w-4 h-4 mr-2 text-[#1e1e1e] animate-spin" />
        <span className="text-[#000]/80 text-sm">{planSteps[activeStep]}</span>
      </div>
    </div>
  )
}
