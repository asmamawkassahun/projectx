"use client";

import { useBackground } from "@/contexts/BackgroundContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const BackgroundImage: React.FC = () => {
  const { backgroundImage, isVoiceModeActive, isActive } = useBackground();
  console.log("isacatve", isActive);
  const { resolvedTheme } = useTheme();

  // Make the globe image change when in dark use white part for light use the globe
  const globeImage =
    resolvedTheme === "light" ? "/icons/globe_light.png" : "/icons/globe.svg";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundImage}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Globe at the bottom */}
      {!isActive && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image src={globeImage} alt="Globe" width={1196} height={1196} />
          </motion.div>
        </div>
      )}

      {/* Voice mode active indicator with audio equalizer */}
      <AnimatePresence>
        {isVoiceModeActive && (
          <>
            {/* Audio Equalizer at the bottom */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-end space-x-1">
                {Array.from({ length: 40 }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="w-1 bg-white rounded-full"
                    animate={{
                      height: [
                        Math.random() * 8 + 2,
                        Math.random() * 20 + 8,
                        Math.random() * 8 + 2,
                      ],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: index * 0.05,
                      ease: "easeInOut",
                    }}
                    style={{
                      height: `${Math.random() * 20 + 4}px`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackgroundImage;
