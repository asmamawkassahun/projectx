"use client";

import { useSendMessage } from "@/hooks/use-gemini-api";
import { useIntentDetection } from "@/hooks/use-intent-detection";
import { PusherEventType, pusherManager } from "@/lib/pusher";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import InputWrapper from "../InputWrapper";
import ChatMessages from "./ChatMessages";
import { PopularExample } from "./popular-example";
import VoiceMobileAgent from "./voice-mobile-agent";
import VoiceModeControl from "./voice-mode-control";

// Define message type
interface Message {
  type: "user" | "model" | "agent";
  content: string;
  timestamp: Date;
}

interface AgentChatProps {
  conversationId?: string | null;
  setConversationId: (id: string | null) => void;
  sessionId?: string | null;
  connectionStatus?: "connected" | "disconnected" | "connecting";
  taskUuid?: string | null;
  isFloating?: boolean;
  isReplayMode?: boolean;
  isWaitingUserResponse?: boolean;
  setIsWaitingUserResponse?: (waiting: boolean) => void;
  onAddMessage?: (role: "user" | "model", content: string, isWaitingUserResponse?: boolean) => void;
}

const AgentChatComponent = React.forwardRef<
  {
    handleVoiceTranscript: (role: "user" | "model", text: string, timestamp: Date) => void;
  },
  AgentChatProps
>(
  (
    {
      sessionId,
      connectionStatus = "connected",
      conversationId,
      taskUuid,
      isFloating,
      isReplayMode = false,
      isWaitingUserResponse = false,
      setIsWaitingUserResponse,
    }: AgentChatProps,
    ref
  ) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
    const [chatStarted, setChatStarted] = useState(false);
    const [isFloatingOpen, setIsFloatingOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const { sendMessage, isLoading: isProcessingMessage } = useSendMessage();
    const { detectIntent, clearIntent } = useIntentDetection();

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Detect if we're on a mobile device - only on client side
    useEffect(() => {
      if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
        setIsMobile(mobileCheck);
      }
    }, []);

    // Handle complete events - these come from Pusher
    const handleCompleteEvent = useCallback((data: any) => {
      // Hide typing indicator
      setIsTyping(false);
    }, []);

    // Handle error events - these come from Pusher
    const handleErrorEvent = useCallback((data: any) => {
      console.error("Pusher error:", data);

      // Hide typing indicator
      setIsTyping(false);

      if (data.error) {
        toast.error(data.error);
      }
    }, []);

    // Handle chat message events
    const handleChatMessageEvent = useCallback((data: any) => {
      if (!data) return;

      // Handle text updates
      if (data.text) {
        // Hide thinking indicator
        setIsTyping(false);

        // Update or add assistant message
        const updateMessages = (prev: Message[]) => {
          const lastMessage = prev[prev.length - 1];

          // If the last message is from the assistant, update it
          if (lastMessage && lastMessage.type === "model") {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              content: data.text,
            };
            return updatedMessages;
          } else {
            // Add a new assistant message
            return [
              ...prev,
              {
                type: "model" as const,
                content: data.text,
                timestamp: new Date(),
              },
            ];
          }
        };

        setMessages((prev) => updateMessages(prev));
      }
    }, []);

    // Setup Pusher event listeners
    const setupEventListeners = useCallback(() => {
      pusherManager.addEventListener(PusherEventType.Error, handleErrorEvent);
      pusherManager.addEventListener(PusherEventType.ChatMessage, handleChatMessageEvent);
      pusherManager.addEventListener(PusherEventType.ChatComplete, handleCompleteEvent);
    }, [handleErrorEvent, handleChatMessageEvent, handleCompleteEvent]);

    // Clean up event listeners
    const cleanupEventListeners = useCallback(() => {
      pusherManager.removeEventListener(PusherEventType.Error, handleErrorEvent);
      pusherManager.removeEventListener(PusherEventType.ChatMessage, handleChatMessageEvent);
      pusherManager.removeEventListener(PusherEventType.ChatComplete, handleCompleteEvent);
    }, [handleErrorEvent, handleChatMessageEvent, handleCompleteEvent]);

    // Setup Pusher event listeners
    useEffect(() => {
      if (sessionId && conversationId) {
        // Only setup listeners if we have a session and conversation ID
        setupEventListeners();

        return () => {
          // Cleanup on unmount or when dependencies change
          cleanupEventListeners();
        };
      }
    }, [sessionId, conversationId, setupEventListeners, cleanupEventListeners]);

    // Focus input on load
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    // Simple scroll to bottom function
    const scrollToBottom = useCallback(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    }, []);

    // Scroll to bottom when messages change or typing state changes
    useEffect(() => {
      // Small delay to ensure content is rendered
      setTimeout(scrollToBottom, 10);
    }, [messages, isTyping, scrollToBottom]);

    // Handle input change
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInput(newValue);

        // Clear intent if input is empty
        if (!newValue.trim()) {
          clearIntent();
          return;
        }

        // Trigger intent detection on input change
        detectIntent(newValue);
      },
      [detectIntent, clearIntent]
    );

    // Handle form submission
    const handleSubmit = useCallback(
      async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        // Clear intent detection when submitting
        clearIntent();

        // Start chat if not already started
        if (!chatStarted) {
          setChatStarted(true);
        }

        // Ensure we have a session ID
        if (!sessionId || connectionStatus !== "connected") {
          toast.error("Chat connection not established");
          return;
        }

        // If we still don't have a conversation ID, wait for one
        if (!conversationId) {
          toast.error("Conversation initializing, please try again");
          return;
        }

        // Add user message to chat
        const userMessage = {
          type: "user" as const,
          content: input,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        if (!isWaitingUserResponse) {
          setIsTyping(true);
        }

        try {
          // Send the message with the conversation ID
          await sendMessage({
            message: input,
            conversation_uuid: conversationId,
            session_id: sessionId,
            task_uuid: taskUuid,
            is_clarification: isWaitingUserResponse,
          });

          // Reset waiting state if this was a clarification response
          if (isWaitingUserResponse && setIsWaitingUserResponse) {
            setIsWaitingUserResponse(false);
          }

          // Response streaming will be handled via Pusher events
        } catch (error) {
          console.error("Error sending message:", error);
          toast.error("Failed to send message");
          setIsTyping(false);
        }
      },
      [
        input,
        chatStarted,
        sessionId,
        connectionStatus,
        conversationId,
        sendMessage,
        setChatStarted,
        setMessages,
        setIsTyping,
        isWaitingUserResponse,
        setIsWaitingUserResponse,
      ]
    );

    // Handle voice mode change
    const handleVoiceModeChange = useCallback((isActive: boolean) => {
      setIsVoiceModeActive(isActive);
    }, []);

    // Toggle voice mode
    const startVoiceMode = useCallback(() => {
      setIsVoiceModeActive(true);
    }, []);

    // Handle voice transcript
    const handleVoiceTranscript = useCallback(
      (role: "user" | "model", text: string, timestamp: Date) => {
        // Start chat if not already started - use functional update to avoid dependency
        setChatStarted((prev) => {
          if (!prev) {
            return true;
          }
          return prev;
        });

        // Handle based on role
        if (role === "user") {
          console.log(text);
          // Add user message to chat
          const userMessage = {
            type: "user" as const,
            content: text,
            timestamp,
          };

          setMessages((prev) => [...prev, userMessage]);
          setIsTyping(true);
        } else if (role === "model") {
          // Handle model message
          setMessages((prev) => [
            ...prev,
            {
              type: "model",
              content: text,
              timestamp: new Date(),
            },
          ]);
          setIsTyping(false);
        }
      },
      []
    ); // Empty dependency array - no dependencies needed

    // Add message method for external use (e.g., from unified agent)
    const addMessage = useCallback(
      (role: "user" | "model", content: string, clarification: boolean = false) => {
        // Start chat if not already started
        setChatStarted((prev) => {
          if (!prev) {
            return true;
          }
          return prev;
        });

        const message = {
          type: role,
          content,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, message]);

        // Hide typing indicator when adding assistant/agent messages
        if (role === "model") {
          setIsTyping(false);
        }

        // Handle floating chat behavior based on voice mode and waiting state
        if (role === "model" && isFloating) {
          console.log(
            "[AGENT CHAT] Handling floating chat behavior based on voice mode and waiting state"
          );
          if (isVoiceModeActive && clarification) {
            console.log(
              "[AGENT CHAT] In voice mode and waiting for user response - emitting event"
            );
            // In voice mode and waiting for user response - emit event instead of opening chat
            window.dispatchEvent(
              new CustomEvent("agent-message-received", {
                detail: { content, isWaitingUserResponse: clarification },
              })
            );
          } else if (!isVoiceModeActive) {
            // Not in voice mode - open floating chat as usual
            setIsFloatingOpen(true);
            // Focus the input after a short delay to ensure the floating chat is open
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }
        }
      },
      [isFloating, isVoiceModeActive]
    );

    // Check if input should be disabled
    const isInputDisabled = isProcessingMessage || connectionStatus !== "connected";

    // Shared input styling for consistency

    // Animation variants for cleaner motion
    const floatingChatVariants = {
      hidden: {
        y: 100,
        opacity: 0,
        scale: 0.95,
      },
      visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.5,
          delay: 0.2, // Slight delay to coordinate with task view
        },
      },
      exit: {
        y: 100,
        opacity: 0,
        scale: 0.95,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      },
    };

    // Close floating chat when voice mode becomes active
    useEffect(() => {
      if (isVoiceModeActive && isFloating) {
        setIsFloatingOpen(false);
      }
    }, [isVoiceModeActive, isFloating]);

    // Expose methods through ref for external use
    useImperativeHandle(
      ref,
      () => ({
        handleVoiceTranscript,
        addMessage,
      }),
      [handleVoiceTranscript, addMessage]
    );

    // Regular chat interface
    return (
      <>
        <InputWrapper
          input={input}
          conversationId={conversationId || undefined}
          startVoiceMode={startVoiceMode}
          isVoiceModeActive={isVoiceModeActive}
          onTranscriptReceived={handleVoiceTranscript}
          onVoiceModeChange={handleVoiceModeChange}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          autoStart={true}
        />

        {/* Mobile Voice Agent - only render when needed */}
        {isVoiceModeActive && isMobile && !isReplayMode && (
          <VoiceMobileAgent
            conversationId={conversationId || undefined}
            sessionId={sessionId || undefined}
            onTranscriptReceived={handleVoiceTranscript}
            onClose={() => setIsVoiceModeActive(false)}
          />
        )}

        {/* Floating chat button when closed */}
        {isFloating && !isFloatingOpen && !isVoiceModeActive && !isReplayMode && (
          <motion.button
            className="fixed bottom-6 left-6 w-14 h-14 bg-[#1e1e1e] hover:bg-[#272727] rounded-full flex items-center justify-center shadow-lg z-50 transition-colors"
            onClick={() => setIsFloatingOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.button>
        )}

        {/* Voice mode control - only for desktop and when not in mobile voice agent */}
        {isVoiceModeActive && !isReplayMode && !isMobile && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <VoiceModeControl
              conversationId={conversationId || undefined}
              onTranscriptReceived={handleVoiceTranscript}
              onVoiceModeChange={handleVoiceModeChange}
              autoStart={true}
            />
          </div>
        )}

        {/* Main chat interface */}
        <AnimatePresence mode="wait">
          {(!isFloating || isFloatingOpen) && (
            <motion.div
              key="chat-interface"
              className={`flex flex-col ${
                isFloating && chatStarted
                  ? "fixed bottom-5 left-5 w-[400px] h-[70vh] rounded-xl shadow-2xl z-40"
                  : chatStarted
                  ? "h-full"
                  : "h-full"
              }`}
              variants={isFloating ? floatingChatVariants : undefined}
              initial={isFloating ? "hidden" : false}
              animate={isFloating ? "visible" : undefined}
              exit={isFloating ? "exit" : undefined}
            >
              {/* Close button for floating mode */}
              {isFloating && chatStarted && (
                <button
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
                  onClick={() => setIsFloatingOpen(false)}
                >
                  <X className="w-4 h-4 text-[#1e1e1e]/60" />
                </button>
              )}

              {/* Main content area */}
              <div
                className={`flex-1 flex flex-col h-full overflow-hidden p-4 w-full pt-20 md:pt-[232px] max-w-[689px] mx-auto`}
              >
                {!chatStarted && <PopularExample />}
                {/* Messages area - centered big text */}
                <div
                  className={`${
                    isFloating
                      ? "flex-1 flex flex-col"
                      : chatStarted
                      ? "flex-1 flex flex-col min-h-0"
                      : "hidden"
                  }`}
                >
                  <div
                    ref={messagesContainerRef}
                    data-scroll-container="true"
                    className={`${
                      isFloating
                        ? "flex-1 overflow-y-auto max-h-[calc(70vh-120px)] pb-4 [&::-webkit-scrollbar]:hidden"
                        : `flex-1 overflow-y-auto ${isVoiceModeActive ? "pb-24" : "pb-16"}`
                    }`}
                    style={
                      isFloating
                        ? {
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }
                        : undefined
                    }
                  >
                    {/* Messages container with proper spacing */}
                    <ChatMessages
                      messages={messages}
                      isFloating={isFloating}
                      chatStarted={chatStarted}
                      isTyping={isTyping}
                    />
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input area with layout animation */}
                {!isReplayMode && (
                  <motion.div
                    layout
                    className={`w-full ${
                      isFloating ? "max-w-2xl mx-auto" : "max-w-full px-2 sm:max-w-2xl sm:mx-auto"
                    } relative ${isFloating ? "flex-shrink-0" : ""}`}
                    initial={false}
                    animate={{
                      y: isFloating ? 0 : chatStarted ? 0 : -30,
                      alignSelf: isFloating ? "flex-end" : chatStarted ? "flex-end" : "center",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    {/* Waiting for user response indicator */}
                    {isWaitingUserResponse && !isVoiceModeActive && (
                      <div className="flex justify-center mb-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                          <span className="text-amber-600 font-medium">
                            Waiting for your response...
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

const AgentChat = React.memo(
  AgentChatComponent,
  (prevProps: AgentChatProps, nextProps: AgentChatProps) => {
    // Custom comparison function that determines when the component should re-render
    return (
      prevProps.sessionId === nextProps.sessionId &&
      prevProps.connectionStatus === nextProps.connectionStatus &&
      prevProps.conversationId === nextProps.conversationId &&
      prevProps.taskUuid === nextProps.taskUuid &&
      prevProps.isFloating === nextProps.isFloating &&
      prevProps.isReplayMode === nextProps.isReplayMode &&
      prevProps.isWaitingUserResponse === nextProps.isWaitingUserResponse
      // We intentionally don't compare setConversationId and onAddMessage as they are function references
      // that likely won't change between renders in the parent component
    );
  }
);

export default AgentChat;
