"use client";

import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import UnionLogo from "./union-logo";
import { PusherEventType, pusherManager } from "@/lib/pusher";
import AgentChat from "./agent-chat";
import TaskHeader from "./task-header";
import TaskStatus from "./task-status";
import TaskPlanner from "./task-planner";
import CostarTask from "./costar-task";
import UnifiedToolHandler from "./unified-tool-handler";
import { File } from "@/types";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";
import { useCombinedReplay } from "@/hooks/useCombinedReplay";
import { useCreateConversation } from "@/hooks/use-gemini-api";

type ViewMode = "planner" | "execution";

interface TaskStep {
  step: string;
  status: string;
}

export default function UnifiedAgent() {
  // Get API key from environment variable
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  console.log("RE RENDERING UNIFIED AGENT");

  // Prevent body scroll on mount and restore on unmount
  useEffect(() => {
    // Simple body scroll prevention
    document.body.style.overflow = "hidden";

    return () => {
      // Restore body scroll on cleanup
      document.body.style.overflow = "";
    };
  }, []);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [taskUuid, setTaskUuid] = useState<string | null>(null);

  // Task visualization state
  const [showTaskView, setShowTaskView] = useState(false);

  // Task-related state (moved from TaskView)
  const [viewMode, setViewMode] = useState<ViewMode>("planner");
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [taskStatus, setTaskStatus] = useState<
    "created" | "in_progress" | "completed" | "failed" | "waiting_user_response" | null
  >(null);
  const [acknowledgmentMessage, setAcknowledgmentMessage] = useState<string>("");
  const [hasReceivedLiveStatus, setHasReceivedLiveStatus] = useState(false);
  const [currentLiveStatusParts, setCurrentLiveStatusParts] = useState<Array<{ text: string; style: string }>>([]);

  // Files state for completed tasks
  const [completedFiles, setCompletedFiles] = useState<File[]>([]);

  // Replay-related state
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);

  // Create a ref to hold the event handler to avoid dependency issues
  const eventHandlerRef = useRef<((event: any) => void) | null>(null);

  // Create a ref for the AgentChat component to add messages during replay
  const agentChatRef = useRef<{
    handleVoiceTranscript: (role: "user" | "model", text: string, timestamp: Date) => void;
    addMessage: (role: "user" | "model", content: string, isWaitingUserResponse?: boolean) => void;
  } | null>(null);

  // Create a ref for the CostarTask component to handle status updates during replay
  const costarTaskRef = useRef<{
    handleStatusUpdate: (data: any) => void;
  } | null>(null);

  // Use the combined replay hook with new voice support
  const {
    combinedEvents,
    currentIndex,
    isReplaying,
    isPlaying,
    audioError,
    initializeReplay,
    startReplay,
    pauseReplay,
    jumpToEnd,
    isLoading: isReplayLoading,
  } = useCombinedReplay({
    apiUrl: "/api",
    delayBetweenEvents: 300,
    isNewVoice: true, // Enable new voice API
    conversationId: conversationId, // Pass conversationId to the hook
    onEvent: (event) => eventHandlerRef.current?.(event),
  });

  // Add conversation creation hook for regular chat
  const { createConversation } = useCreateConversation();

  // Track if initialization has already happened to prevent multiple calls
  const hasInitialized = useRef(false);

  // Additional state for waiting_user_response
  const [isWaitingUserResponse, setIsWaitingUserResponse] = useState(false);

  // Create a ref to hold the waiting user response state to avoid dependency issues
  const isWaitingUserResponseRef = useRef<boolean>(false);

  // Keep ref in sync with waiting user response state
  useEffect(() => {
    isWaitingUserResponseRef.current = isWaitingUserResponse;
  }, [isWaitingUserResponse]);

  // Listen for user answer sent event to reset waiting state
  useEffect(() => {
    const handleUserAnswerSent = () => {
      console.log("User answer sent event received - resetting waiting state");
      setIsWaitingUserResponse(false);
    };

    window.addEventListener("user-answer-sent", handleUserAnswerSent);

    return () => {
      window.removeEventListener("user-answer-sent", handleUserAnswerSent);
    };
  }, []);

  // Handle task plan updates from status_update events
  const handleStatusUpdate = useCallback(
    (data: any) => {
      if (!data) return;

      // Handle waiting for user response type
      if (data.type === "waiting_user_response") {
        setIsWaitingUserResponse(true);
        setTaskStatus("waiting_user_response");

        // Add the question message to show to user (if provided)
        if (data.message) {
          // The message will be handled by AgentChat component via Pusher events
          // but we need to ensure the task view shows waiting state

          if (agentChatRef.current) {
            agentChatRef.current.addMessage("model", data.message, true);
          }
        }
        return;
      }

      // For any other status update type, set task status to in_progress if currently waiting
      if (taskStatus === "waiting_user_response" && data.type !== "waiting_user_response") {
        setTaskStatus("in_progress");
      }

      // Handle task plan updates
      if (data.task_plan) {
        // If this is a structural plan update (plan_updated flag is true), simply replace the plan
        if (data.plan_updated) {
          // Simply replace the entire plan - the backend sends the complete updated structure
          setSteps(
            data.task_plan.map((stepObj: any) => ({
              step: stepObj.step,
              status: stepObj.status || "pending", // Only default to pending if status is null/undefined
            }))
          );

          // Log the plan update message if provided
          if (data.message) {
            // console.log("Plan update message:", data.message);
          }
        } else {
          // This is an initial plan creation - use the complete step objects from backend
          console.log("Processing initial plan creation in unified agent");
          setSteps(
            data.task_plan.map((stepObj: any) => ({
              step: stepObj.step,
              status: stepObj.status || "pending", // Only default to pending if status is null/undefined
            }))
          );
        }

        setIsLoading(false);
        return;
      }

      // Handle plan step status updates
      if (data.step_status && data.step_index !== undefined) {
        const stepIndex = data.step_index;

        if (stepIndex >= 0) {
          // If a step is processing, update currentStep
          if (data.step_status === "processing") {
            setCurrentStep(stepIndex);
          }
        }
        return;
      }

      // Handle live status updates (from executor and exe_tool)
      if (data.type === "live_status") {
        setHasReceivedLiveStatus(true);

        // If we receive a live status update but don't have a plan and task view isn't shown,
        // activate the task view (this handles cases where we start execution without planning)
        if (!showTaskView && steps.length === 0 && data.tool_name !== "task_planner") {
          // console.log("Activating task view due to live status without plan");
          setShowTaskView(true);
          setViewMode("execution");
          setIsTaskActive(true);
          setTaskStatus("in_progress");
        }

        // Handle structured message_parts if available
        if (data.message_parts && Array.isArray(data.message_parts)) {
          setCurrentLiveStatusParts(data.message_parts);
        } else if (data.message) {
          // Fallback to plain message if message_parts not available
          setCurrentLiveStatusParts([{ text: data.message, style: "normal" }]);
        }
        return;
      }

      // Handle initial acknowledgment message (first status_update with message)
      if (data.message && !hasReceivedLiveStatus && !acknowledgmentMessage) {
        setAcknowledgmentMessage(data.message);
        setIsTaskActive(true);
        setTaskStatus("in_progress");
        return;
      }
    },
    [isTaskActive, hasReceivedLiveStatus, acknowledgmentMessage, showTaskView]
  );

  // Handle task completion
  const handleCompleteEvent = useCallback((data: any) => {
    // console.log("Complete event received:", data);

    // Update task status to completed
    setTaskStatus("completed");
    setIsTaskActive(false);
    setViewMode("execution");
    setIsLoading(false);

    // Handle files from completion data
    const files = data.files || [];
    if (files.length > 0) {
      // console.log("Setting completed files:", files);
      setCompletedFiles(files);
    }

    // Clear live status when task completes
    setHasReceivedLiveStatus(false);
    setCurrentLiveStatusParts([]);
  }, []);

  // Handle errors
  const handleErrorEvent = useCallback((data: any) => {
    setTaskStatus("failed");
    setIsTaskActive(false);
    setIsLoading(false);
  }, []);

  // Handle agent stopped
  const handleAgentStoppedEvent = useCallback((data: any) => {
    setTaskStatus("failed");
    setIsTaskActive(false);
    setIsLoading(false);
  }, []);

  const handleTaskCreated = (data: any) => {
    // console.log("Task created:", data);
    setTaskUuid(data.task_uuid);
    setShowTaskView(true);
  };

  // Connect to Pusher and check for conversation ID in URL
  useEffect(() => {
    // Skip Pusher connection if in replay mode
    if (isReplayMode) {
      // console.log("Skipping Pusher connection - in replay mode");
      return;
    }

    // Connect to Pusher
    connectToPusher().then(() => {
      setupEventListeners();
    });

    return () => {
      // Cleanup on unmount
      cleanupEventListeners();
      pusherManager.disconnect();
    };
  }, [isReplayMode]);

  // Set up the event handler for replay
  eventHandlerRef.current = useCallback(
    (event: any) => {
      // console.log("Event received:", event);
      // Handle task view updates and messages
      switch (event.eventType) {
        case "audio_message":
          // Add messages to chat during replay
          if (agentChatRef.current) {
            const role = event.data.role === "user" ? "user" : "model";
            agentChatRef.current.handleVoiceTranscript(role, event.data.content, event.data.created_at);
          }
          break;
        case "in_chat_updates":
          // Forward InChatUpdates events via custom event during replay
          window.dispatchEvent(new CustomEvent("replay-inchat-updates", { detail: event.data }));
          break;
        case "status_update":
          handleStatusUpdate(event.data);
          // Also call CostarTask's handleStatusUpdate during replay for VM view management
          if (costarTaskRef.current) {
            costarTaskRef.current.handleStatusUpdate(event.data);
          }
          break;
        case "task_created":
          handleTaskCreated(event.data);
          break;
        case "complete":
          handleCompleteEvent(event.data);
          break;
        case "error":
          handleErrorEvent(event.data);
          break;
        case "agent_stopped":
          handleAgentStoppedEvent(event.data);
          break;
        default:
          console.log(`Unknown event type during replay: ${event.eventType}`);
      }
    },
    [handleStatusUpdate, handleCompleteEvent, handleErrorEvent, handleAgentStoppedEvent, handleTaskCreated]
  );

  // Handle audio errors from replay
  useEffect(() => {
    if (audioError) {
      // console.error("Audio replay error:", audioError);
      toast.error("Audio playback error occurred during replay");
    }
  }, [audioError]);

  // Connect to Pusher
  const connectToPusher = async () => {
    try {
      setConnectionStatus("connecting");

      // Ensure any existing connection is closed
      pusherManager.disconnect();

      const newSessionId = await pusherManager.connect();
      // console.log("Connected to Pusher with session ID:", newSessionId);
      setSessionId(newSessionId);

      setConnectionStatus("connected");

      // Setup connection state listener
      pusherManager.pusher?.connection.bind("state_change", (states: any) => {
        // console.log("Pusher connection state changed:", states);
        if (states.current === "disconnected" || states.current === "failed") {
          setConnectionStatus("disconnected");
        }
      });

      return newSessionId;
    } catch (error) {
      // console.error("Failed to connect to Pusher:", error);
      setConnectionStatus("disconnected");
      toast.error("Failed to connect to chat service");
      throw error;
    }
  };

  // Setup Pusher event listeners
  const setupEventListeners = () => {
    pusherManager.addEventListener(PusherEventType.TaskCreated, handleTaskCreated);
    pusherManager.addEventListener(PusherEventType.StatusUpdate, handleStatusUpdate);
    pusherManager.addEventListener(PusherEventType.Complete, handleCompleteEvent);
    pusherManager.addEventListener(PusherEventType.Error, handleErrorEvent);
    pusherManager.addEventListener(PusherEventType.AgentStopped, handleAgentStoppedEvent);
  };

  // Clean up event listeners
  const cleanupEventListeners = () => {
    pusherManager.removeEventListener(PusherEventType.TaskCreated, handleTaskCreated);
    pusherManager.removeEventListener(PusherEventType.StatusUpdate, handleStatusUpdate);
    pusherManager.removeEventListener(PusherEventType.Complete, handleCompleteEvent);
    pusherManager.removeEventListener(PusherEventType.Error, handleErrorEvent);
    pusherManager.removeEventListener(PusherEventType.AgentStopped, handleAgentStoppedEvent);
  };

  // Initialize conversation on component mount
  useEffect(() => {
    const initConversation = async () => {
      if (typeof window === "undefined") {
        // console.log("Skipping initialization - server-side");
        return;
      }

      try {
        console.log("Starting conversation initialization...");

        const urlParams = new URLSearchParams(window.location.search);
        const conversationIdFromUrl = urlParams.get("conversationId");
        const isReplayFromUrl = urlParams.get("replay") === "1";

        // console.log("URL params:", {
        //   conversationIdFromUrl,
        //   isReplayFromUrl,
        //   sessionId,
        // });

        if (conversationIdFromUrl) {
          // Only mark as initialized if we have a conversation ID from URL
          if (hasInitialized.current) {
            // console.log("Skipping URL-based initialization - already done");
            return;
          }
          hasInitialized.current = true;

          if (isReplayFromUrl) {
            // Initialize replay mode
            // console.log(
            //   "Initializing replay mode for conversation:",
            //   conversationIdFromUrl
            // );
            const replayResult = await initializeReplay(conversationIdFromUrl);
            setIsReplayMode(replayResult);
            setShowReplayButton(replayResult);
            // console.log("Replay initialization result:", replayResult);
          } else {
            // Regular conversation mode
            console.log("Setting up regular conversation mode for:", conversationIdFromUrl);
            setConversationId(conversationIdFromUrl);
            setIsReplayMode(false);
            setShowReplayButton(false);
          }
        } else if (sessionId && !conversationId) {
          // Create new conversation with session ID from Pusher connection
          // Only create if we don't already have a conversation ID
          // console.log("Creating new conversation with sessionId:", sessionId);
          const newConversation = await createConversation(sessionId);
          if (newConversation?.uuid) {
            setConversationId(newConversation.uuid);
            // Update URL with new conversation ID
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set("conversationId", newConversation.uuid);
            window.history.replaceState({}, "", newUrl.toString());
            console.log("New conversation created:", newConversation.uuid);
          }
          setIsReplayMode(false);
          setShowReplayButton(false);
        } else {
          console.log("No conversation ID or session ID available for initialization");
        }
      } catch (error) {
        console.error("Error initializing conversation:", error);
        // Reset the flag on error so it can be retried
        hasInitialized.current = false;
      }
    };

    initConversation();
  }, [sessionId, conversationId]); // Depend on both sessionId and conversationId

  return (
    <LiveAPIProvider apiKey={API_KEY}>
      {/* Initialize tool handler without wrapping components */}
      <UnifiedToolHandler conversationId={conversationId} sessionId={sessionId} taskUuid={taskUuid} />

      {/* Main container with flex layout - prevent body scroll with useEffect */}
      <div className="fixed inset-0 flex flex-col overflow-hidden">
        {/* Always visible header - fixed to top */}
        <header className="fixed top-0 left-0 right-0 p-4 z-50 flex-shrink-0">
          <div className="relative w-full grid grid-cols-3 items-start">
            {/* Left column - Logo */}
            <div className="flex justify-start">
              <UnionLogo />
            </div>

            {/* Center column - Task header and status */}
            <div className="flex justify-center">
              {isReplayMode && !showTaskView && (
                <motion.div
                  className="flex items-center space-x-2 px-4 py-2 bg-[#1e1e1e]/5 text-[#1e1e1e] rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Replay Mode</span>
                  {isPlaying && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-[#1e1e1e] rounded-full animate-pulse"></div>
                      <span className="text-xs">Playing Audio</span>
                    </div>
                  )}
                </motion.div>
              )}

              {showTaskView && taskStatus !== "completed" && taskStatus !== "failed" && steps.length > 0 && (
                <motion.div
                  className="w-full max-w-md pointer-events-none"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                >
                  <div className="flex flex-col items-center pointer-events-auto">
                    <TaskHeader currentStep={currentStep} steps={steps} />
                    <TaskStatus
                      viewMode={viewMode}
                      isLoading={isLoading}
                      currentStep={currentStep}
                      steps={steps}
                      acknowledgmentMessage={acknowledgmentMessage}
                      hasReceivedLiveStatus={hasReceivedLiveStatus}
                      currentLiveStatusParts={currentLiveStatusParts}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right column - Minimal replay progress */}
            <div className="flex justify-end">
              {/* Minimal Replay Progress - only show during active replay */}
              {isReplayMode && isReplaying && (
                <motion.div
                  className="flex items-center space-x-3 px-3 py-2 bg-[#1e1e1e]/5 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#1e1e1e] rounded-full animate-pulse"></div>
                    <span className="text-sm text-[#1e1e1e]/80">
                      {currentIndex + 1} / {combinedEvents.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={pauseReplay}
                      className="p-1 hover:bg-[#1e1e1e]/10 rounded transition-colors"
                      title="Pause"
                    >
                      <svg className="w-4 h-4 text-[#1e1e1e]/60" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={jumpToEnd}
                      className="p-1 hover:bg-[#1e1e1e]/10 rounded transition-colors"
                      title="Jump to End"
                    >
                      <svg className="w-4 h-4 text-[#1e1e1e]/60" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* Main content area that takes remaining height - add top padding to account for fixed header */}
        <div className="flex-1 relative overflow-hidden pt-12 min-h-screen">
          {/* Big Centered Play Button for Replay */}
          <AnimatePresence>
            {isReplayMode && showReplayButton && !isReplaying && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-50  backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex flex-col items-center space-y-8"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-light text-[#1e1e1e] mb-3">Ready to replay</h2>
                    <p className="text-[#1e1e1e]/50 text-lg">{combinedEvents.length} events</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowReplayButton(false);
                      startReplay();
                    }}
                    className="group relative"
                  >
                    <div className="w-24 h-24 bg-[#1e1e1e] hover:bg-[#1e1e1e]/90 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-105">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowReplayButton(false);
                      jumpToEnd();
                    }}
                    className="text-[#1e1e1e]/40 hover:text-[#1e1e1e]/70 text-sm transition-colors underline"
                  >
                    Skip to end
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading indicator for replay initialization */}
          <AnimatePresence>
            {isReplayLoading && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-40 bg-white/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-8 h-8 border-4 border-[#1e1e1e]/20 border-t-[#1e1e1e] rounded-full animate-spin"></div>
                  <p className="text-[#1e1e1e]/80 font-medium">Loading replay data...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Agent Chat Component - handles its own positioning */}
          <AgentChat
            sessionId={sessionId}
            conversationId={conversationId}
            setConversationId={setConversationId}
            connectionStatus={connectionStatus}
            taskUuid={taskUuid}
            isFloating={showTaskView}
            isReplayMode={isReplayMode}
            isWaitingUserResponse={isWaitingUserResponse}
            setIsWaitingUserResponse={setIsWaitingUserResponse}
            ref={agentChatRef}
          />

          {/* Task Visualization View */}
          <AnimatePresence>
            {showTaskView && taskUuid && (
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
                className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 flex flex-col items-center z-30 backdrop-blur-sm"
              >
                {/* Main content area */}
                <motion.div
                  className="flex-1 w-full flex items-center justify-center overflow-hidden px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <AnimatePresence mode="wait">
                    {taskStatus === "failed" ? (
                      <motion.div
                        key="failed"
                        className="flex flex-col items-center justify-center h-full text-center"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-8 h-8 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">Task Stopped</h3>
                          <p className="text-gray-600 mb-4">
                            The agent has been stopped and the task execution has been halted.
                          </p>
                          <p className="text-sm text-gray-500">
                            You can start a new conversation to begin a different task.
                          </p>
                        </div>
                      </motion.div>
                    ) : viewMode === "planner" ? (
                      <motion.div
                        key="planner"
                        className="w-full max-w-6xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {steps.length > 0 ? (
                          <TaskPlanner steps={steps.map((stepObj) => stepObj.step)} setViewMode={setViewMode} />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-center">
                              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-4"></div>
                              <p className="text-gray-600 text-lg">Creating your task plan...</p>
                              <p className="text-gray-400 text-sm mt-2">Waiting for task plan...</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="execution"
                        className="w-full max-w-6xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <CostarTask
                          steps={steps.map((stepObj) => stepObj.step)}
                          isTaskCompleted={taskStatus === "completed"}
                          files={completedFiles}
                          ref={costarTaskRef}
                          isReplayMode={isReplayMode}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Connection Status Indicator - subtle and non-intrusive */}
      {connectionStatus !== "connected" && (
        <div className="fixed bottom-4 right-4 px-3 py-1 bg-gray-800 text-white text-sm rounded-full shadow-lg opacity-80 z-50">
          {connectionStatus === "connecting" ? "Connecting..." : "Disconnected"}
        </div>
      )}
    </LiveAPIProvider>
  );
}
