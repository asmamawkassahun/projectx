"use client";

import { InputValueProvider } from "@/contexts/InputValueContext";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";
import { useCreateConversation } from "@/hooks/use-gemini-api";
import { useCombinedReplay } from "@/hooks/useCombinedReplay";
import { pusherManager } from "@/lib/pusher";
import { useConversationStore } from "@/stores/conversation-store";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Navbar from "../Navbar";
import Task from "../task";
import AgentChat from "./agent-chat";
import UIOverlay from "./ui-overlay";
import UnifiedToolHandler from "./unified-tool-handler";
import { connect } from "http2";
import { TasksStepsProvider } from "@/contexts/TasksStepsContext";

type TaskStatus =
  | "created"
  | "in_progress"
  | "completed"
  | "failed"
  | "waiting_user_response"
  | null;

export default function UnifiedAgent() {
  // Get API key from environment variable
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

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
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const { conversationId, setConversationId } = useConversationStore();
  const [taskUuid, setTaskUuid] = useState<string | null>(null);

  // UI overlay state management
  const [isUIGenerating, setIsUIGenerating] = useState(false);
  const [currentUITool, setCurrentUITool] = useState<string | null>(null);

  // Handle UI loading state changes
  const handleUILoadingStateChange = useCallback(
    (isLoading: boolean, toolName?: string) => {
      setIsUIGenerating(isLoading);
      setCurrentUITool(isLoading ? toolName || null : null);
    },
    []
  );

  // Handle UI generation completion
  const handleUIGenerated = useCallback((toolName: string) => {
    console.log(`🎨 UI generated successfully for: ${toolName}`);
    // You can add any additional logic here, like analytics or notifications
  }, []);

  // Task-related state (delegated to Task component)
  const [showTaskView, setShowTaskView] = useState(false);
  const [isWaitingUserResponse, setIsWaitingUserResponse] = useState(false);

  // Replay-related state
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);

  // Create a ref for the AgentChat component to add messages during replay
  const agentChatRef = useRef<{
    handleVoiceTranscript: (
      role: "user" | "model",
      text: string,
      timestamp: Date
    ) => void;
    addMessage: (
      role: "user" | "model",
      content: string,
      isWaitingUserResponse?: boolean
    ) => void;
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
    onEvent: (event) => handleEvent(event),
  });

  // Add conversation creation hook for regular chat
  const { createConversation } = useCreateConversation();

  // Track if initialization has already happened to prevent multiple calls
  const hasInitialized = useRef(false);

  // Handle task view changes from Task component
  const handleTaskViewChange = useCallback((show: boolean) => {
    setShowTaskView(show);
  }, []);

  // Handle waiting user response changes from Task component
  const handleWaitingUserResponseChange = useCallback((waiting: boolean) => {
    setIsWaitingUserResponse(waiting);
  }, []);

  // Set up the event handler for replay
  const handleEvent = (event: any) => {
    console.log("Event received:", event);
    // Handle task view updates and messages

    switch (event.eventType) {
      case "audio_message":
        console.log("Audio message received during replay:", event.data);
        // Add messages to chat during replay
        if (agentChatRef.current) {
          const role = event.data.role === "user" ? "user" : "model";
          agentChatRef.current.handleVoiceTranscript(
            role,
            event.data.content,
            event.data.created_at
          );
        }
        break;
      case "in_chat_updates":
        // Forward InChatUpdates events via custom event during replay
        window.dispatchEvent(
          new CustomEvent("replay-inchat-updates", { detail: event.data })
        );
        break;
      case "status_update":
      case "task_created":
      case "complete":
      case "error":
      case "agent_stopped":
        // Forward task-related events to Task component during replay
        window.dispatchEvent(
          new CustomEvent("replay-task-event", { detail: event })
        );
        break;
      default:
        console.log(`Unknown event type during replay: ${event.eventType}`);
    }
  };

  // Handle audio errors from replay
  useEffect(() => {
    if (audioError) {
      console.error("Audio replay error:", audioError);
      toast.error("Audio playback error occurred during replay");
    }
  }, [audioError]);

  // BELOW THIS LINE, NOTHING IS RELATED TO TASKS
  // Connect to Pusher
  const connectToPusher = async () => {
    try {
      setConnectionStatus("connecting");

      // Ensure any existing connection is closed
      pusherManager.disconnect();

      console.log("Connecting to Pusher with new session ID");
      const newSessionId = await pusherManager.connect();
      console.log("Connected to Pusher with session ID:", newSessionId);
      setSessionId(newSessionId);

      setConnectionStatus("connected");

      // Setup connection state listener
      pusherManager.pusher?.connection.bind("state_change", (states: any) => {
        console.log("Pusher connection state changed:", states);
        if (states.current === "disconnected" || states.current === "failed") {
          setConnectionStatus("disconnected");
        }
      });

      return newSessionId;
    } catch (error) {
      console.error("Failed to connect to Pusher:", error);
      setConnectionStatus("disconnected");
      toast.error("Failed to connect to chat service");
      throw error;
    }
  };

  useEffect(() => {
    connectToPusher();
  }, []);

  // Initialize conversation on component mount
  useEffect(() => {
    const initConversation = async () => {
      if (typeof window === "undefined") {
        console.log("Skipping initialization - server-side");
        return;
      }

      try {
        console.log("Starting conversation initialization...");

        const urlParams = new URLSearchParams(window.location.search);
        const conversationIdFromUrl = urlParams.get("conversationId");
        const isReplayFromUrl = urlParams.get("replay") === "1";

        console.log("URL params:", {
          conversationIdFromUrl,
          isReplayFromUrl,
          sessionId,
        });

        if (conversationIdFromUrl) {
          // Only mark as initialized if we have a conversation ID from URL
          if (hasInitialized.current) {
            console.log("Skipping URL-based initialization - already done");
            return;
          }
          hasInitialized.current = true;

          if (isReplayFromUrl) {
            // Initialize replay mode
            console.log(
              "Initializing replay mode for conversation:",
              conversationIdFromUrl
            );
            const replayResult = await initializeReplay(conversationIdFromUrl);
            setIsReplayMode(replayResult);
            setShowReplayButton(replayResult);
            console.log("Replay initialization result:", replayResult);
          } else {
            // Regular conversation mode
            console.log(
              "Setting up regular conversation mode for:",
              conversationIdFromUrl
            );
            setConversationId(conversationIdFromUrl);
            setIsReplayMode(false);
            setShowReplayButton(false);
          }
        } else if (sessionId && !conversationId) {
          // Create new conversation with session ID from Pusher connection
          // Only create if we don't already have a conversation ID
          console.log("Creating new conversation with sessionId:", sessionId);
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
          console.log(
            "No conversation ID or session ID available for initialization"
          );
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
      <InputValueProvider>
        {/* {isDebug && <Leva />} */}
        {/* Initialize tool handler without wrapping components */}
        <UnifiedToolHandler sessionId={sessionId} taskUuid={taskUuid} />
        <Navbar />
        {/* Main container with flex layout - prevent body scroll with useEffect */}
        <div className="fixed inset-0 flex flex-col overflow-hidden">
          {/* Always visible header - fixed to top */}

          {/* Main content area that takes remaining height - add top padding to account for fixed header */}
          <div className="flex-1 relative overflow-hidden pt-12">
            {/* Big Centered Play Button for Replay */}
            <AnimatePresence>
              {isReplayMode && showReplayButton && !isReplaying && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-50 bg-white/80 backdrop-blur-sm"
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
                      <h2 className="text-3xl font-light text-[#1e1e1e] mb-3">
                        Ready to replay
                      </h2>
                      <p className="text-[#1e1e1e]/50 text-lg">
                        {combinedEvents.length} events
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowReplayButton(false);
                        startReplay();
                      }}
                      className="group relative"
                    >
                      <div className="w-24 h-24 bg-[#1e1e1e] hover:bg-[#1e1e1e]/90 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-105">
                        <svg
                          className="w-10 h-10 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
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
                    <p className="text-[#1e1e1e]/80 font-medium">
                      Loading replay data...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Agent Chat Component - handles its own positioning */}
            <AgentChat
              sessionId={sessionId}
              connectionStatus={connectionStatus}
              taskUuid={taskUuid}
              isFloating={showTaskView}
              isReplayMode={isReplayMode}
              isWaitingUserResponse={isWaitingUserResponse}
              setIsWaitingUserResponse={setIsWaitingUserResponse}
              ref={agentChatRef}
            />
            <TasksStepsProvider>
              {/* Task Component - now handles all task-related logic */}
              <Task
                setTaskUuid={setTaskUuid}
                connectionStatus={connectionStatus}
                isReplayMode={isReplayMode}
                onTaskViewChange={handleTaskViewChange}
                onWaitingUserResponseChange={handleWaitingUserResponseChange}
              />
            </TasksStepsProvider>
          </div>
        </div>

        {/* Connection Status Indicator - subtle and non-intrusive */}
        {connectionStatus !== "connected" && (
          <div className="fixed bottom-4 right-4 px-3 py-1 bg-gray-800 text-white text-sm rounded-full shadow-lg opacity-80 z-50">
            {connectionStatus === "connecting"
              ? "Connecting..."
              : "Disconnected"}
          </div>
        )}

        {/* UI Generation Status Indicator */}
        {isUIGenerating && currentUITool && (
          <div className="fixed bottom-4 left-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-lg z-40 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>
              Generating {currentUITool.replace(/_/g, " ")} interface...
            </span>
          </div>
        )}

        {/* UI Overlay for productivity tools */}
        <UIOverlay
          onLoadingStateChange={handleUILoadingStateChange}
          onUIGenerated={handleUIGenerated}
        />
      </InputValueProvider>
    </LiveAPIProvider>
  );
}
