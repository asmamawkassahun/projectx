import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./TextInput";
import ThinkingIndicator from "./ThinkingIndicator";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  requiresResponse?: boolean;
  clarificationId?: string;
  isClarification?: boolean;
  files?: { name: string; path: string }[];
  markdownFiles?: {
    name: string;
    path: string;
    content: string;
    file_url?: string;
  }[];
  type?: string;
  toolName?: string;
  markdownData?: {
    filename: string;
    path: string;
    file_url?: string;
    content?: string;
  };
  inChatUpdates?: any[];
}

interface ChatSectionProps {
  messages: Message[];
  isThinking: boolean;
  connectionStatus: "connected" | "disconnected" | "connecting";
  isProcessing: boolean;
  onSendMessage: (message: string) => void;
  onFileClick: (file: { name: string; path: string }) => void;
  onMarkdownFileClick: (file: {
    name: string;
    path: string;
    content: string;
    file_url?: string;
  }) => void;
  isLoadingHistory?: boolean;
  isReplayMode?: boolean;
  clarificationMode?: boolean;
  isInputDisabled?: boolean;
  sessionStatus?: "active" | "deactive";
}

const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  isThinking,
  connectionStatus,
  isProcessing,
  onSendMessage,
  onFileClick,
  onMarkdownFileClick,
  isLoadingHistory = false,
  isReplayMode = false,
  clarificationMode = false,
  isInputDisabled,
  sessionStatus = "active",
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or thinking state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // If loading history but no messages yet, show a loading indicator instead of welcome screen
  if (messages.length === 0 && isLoadingHistory) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div className="animate-pulse flex items-center justify-center p-8">
          <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-indigo-200 animate-spin"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading task history...</p>
      </div>
    );
  }

  return (
    <div className="flex-[0.6] min-w-0 flex flex-col overflow-hidden bg-red-400">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-white">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={
                isReplayMode ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: isReplayMode ? 0 : 0.1,
                delay: isReplayMode ? 0 : 0.02,
              }}
              className="break-words max-w-full overflow-hidden"
            >
              <ChatMessage
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                isLoading={
                  index === messages.length - 1 &&
                  message.role === "assistant" &&
                  isProcessing
                }
                files={message.files}
                markdownFiles={message.markdownFiles}
                onFileClick={onFileClick}
                onMarkdownFileClick={onMarkdownFileClick}
                type={message.type}
                toolName={message.toolName}
                isActive={
                  Boolean(message.type) &&
                  index ===
                    messages.findLastIndex(
                      (msg) => msg.type === message.type
                    ) &&
                  !messages.some(
                    (msg) => msg.type === "completed" || msg.type === "stopped"
                  )
                }
                markdownData={message.markdownData}
                inChatUpdates={message.inChatUpdates}
              />
            </motion.div>
          ))}
        </div>

        {/* Thinking indicator */}
        {isThinking && <ThinkingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="flex-1">
            <ChatInput
              onSendMessage={onSendMessage}
              isDisabled={connectionStatus !== "connected" || isLoadingHistory}
              isProcessing={isProcessing}
              connectionStatus={connectionStatus}
              clarificationMode={clarificationMode}
              isInputDisabled={isInputDisabled}
              sessionStatus={sessionStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
