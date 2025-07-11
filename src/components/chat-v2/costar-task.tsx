"use client";

import { useState, useEffect, useCallback, useImperativeHandle } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardDeckSwiper from "./card-deck-swiper";
import CompletedTask from "./completed-task";
import { PusherEventType, pusherManager } from "@/lib/pusher";
import { File } from "@/types";
import { createPortal } from "react-dom";

interface CostarTaskProps {
  steps: string[];
  onDownload?: () => void;
  isTaskCompleted?: boolean;
  files?: File[];
  isReplayMode?: boolean;
}

const CostarTaskComponent = React.forwardRef<
  { handleStatusUpdate: (data: any) => void },
  CostarTaskProps
>(({ steps = [], onDownload, isTaskCompleted = false, files, isReplayMode = false }, ref) => {
  // State for VM view management
  const [showVMView, setShowVMView] = useState(false);
  const [browserStreamUrl, setBrowserStreamUrl] = useState<string | null>(null);
  const [showVMModal, setShowVMModal] = useState(false);

  // Determine view mode internally
  const viewMode = isTaskCompleted ? "completed" : "swiper";

  // Handle status update events
  const handleStatusUpdate = useCallback(
    (data: any) => {
      if (!data) return;

      // Handle stream URL updates - but not during replay mode
      if (data.stream_url && !isReplayMode) {
        console.log("Browser stream URL received:", data.stream_url);
        setBrowserStreamUrl(data.stream_url);
        localStorage.setItem("browserStreamUrl", data.stream_url);
        return;
      }

      // Handle live status updates to show/hide VM view based on tool - but not during replay mode
      if (data.type === "live_status" && data.tool_name && !isReplayMode) {
        if (data.tool_name === "web_browser") {
          setShowVMView(true);
        } else {
          setShowVMView(false);
        }
        return;
      }
    },
    [isReplayMode]
  );

  // Setup event listeners
  useEffect(() => {
    const setupEventListeners = () => {
      pusherManager.addEventListener(PusherEventType.StatusUpdate, handleStatusUpdate);
    };

    const cleanupEventListeners = () => {
      pusherManager.removeEventListener(PusherEventType.StatusUpdate, handleStatusUpdate);
    };

    setupEventListeners();

    // Load saved browser URL from localStorage on mount - but not during replay mode
    if (!isReplayMode) {
      const savedBrowserUrl = localStorage.getItem("browserStreamUrl");
      if (savedBrowserUrl) {
        console.log("Retrieved browser URL from localStorage:", savedBrowserUrl);
        setBrowserStreamUrl(savedBrowserUrl);
      }
    }

    return () => {
      cleanupEventListeners();
    };
  }, [handleStatusUpdate, isReplayMode]);

  useImperativeHandle(
    ref,
    () => ({
      handleStatusUpdate,
    }),
    [handleStatusUpdate]
  );

  // Handle VM modal
  const handleVMClick = () => {
    if (!isReplayMode) {
      setShowVMModal(true);
    }
  };

  const handleCloseVMModal = () => {
    setShowVMModal(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        {viewMode === "swiper" ? (
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CardDeckSwiper />
          </motion.div>
        ) : (
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CompletedTask
              onDownload={onDownload}
              taskTitle="Task"
              completionTime="3 minutes"
              filesGenerated={steps.length}
              files={files}
            />
          </motion.div>
        )}
      </div>

      {/* VM View - keep iframe in DOM but control visibility for better performance */}
      {browserStreamUrl && !isReplayMode && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: showVMView ? 1 : 0,
              scale: showVMView ? 1 : 0.8,
              y: showVMView ? 0 : 20,
              pointerEvents: showVMView ? "auto" : "none",
            }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 w-64 h-40 bg-black rounded-lg shadow-2xl border border-gray-300 overflow-hidden z-40 cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={handleVMClick}
          >
            {/* Processing animation overlay */}
            <div className="absolute top-2 right-2 z-10">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            </div>

            {/* Click to expand hint */}
            <div className="absolute top-2 left-2 z-10">
              <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-xs">
                Click to expand
              </div>
            </div>

            <div className="w-full h-full">
              <iframe
                src={browserStreamUrl}
                className="w-full h-full border-0 pointer-events-none"
                title="Browser Stream"
                allow="camera; microphone; display-capture"
              />
            </div>
          </motion.div>

          {/* Large VM Modal */}
          {typeof window !== "undefined" &&
            createPortal(
              <AnimatePresence>
                {showVMModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                    onClick={handleCloseVMModal}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full max-w-6xl h-full max-h-[90vh] bg-black rounded-lg shadow-2xl overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close button */}
                      <button
                        onClick={handleCloseVMModal}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      {/* Processing indicator */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="flex items-center space-x-2 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-white">
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Browser Automation Active</span>
                        </div>
                      </div>

                      {/* Large iframe */}
                      <div className="w-full h-full">
                        <iframe
                          src={browserStreamUrl}
                          className="w-full h-full border-0 pointer-events-none"
                          title="Browser Stream - Large View"
                          allow="camera; microphone; display-capture"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body
            )}
        </>
      )}
    </div>
  );
});

export default CostarTaskComponent;
